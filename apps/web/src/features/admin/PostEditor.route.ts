import { z } from 'zod';
import { type ActionFunctionArgs, data, type LoaderFunctionArgs, redirect } from 'react-router';
import { withAdminSession } from '../auth/redirects';
import { createPost, fetchAdminPost, updatePost } from './adminPosts.api';
import { ApiError } from '../../lib/api';
import { type PostFormValues, type PostInput, postFormSchema } from './adminPosts.schemas';
import { fromDateTimeLocal } from './dateTimeLocal';




const idSchema = z.uuid();


/** /admin/posts/new -> null (empty form). /admin/posts/:id/edit → the post */
export async function postEditorLoader({ request, params }: LoaderFunctionArgs) {
    if (params.id === undefined) {
        return null;
    }
    if (!idSchema.safeParse(params.id).success) {
        throw data('Post not found', { status: 404 });
    }

    try {
        return await withAdminSession(request, fetchAdminPost(params.id, request.signal));
    } 
    catch (error) {
        if (error instanceof ApiError && error.status === 404) {
            throw data('Post not found', { status: 404 });
        }
        throw error;
    }
}


/** Field name -> messages to show under that field */
export type FieldErrors = Partial<Record<keyof PostFormValues, string[]>>;

export type PostEditorActionData = { fieldErrors?: FieldErrors; formError?: string };


/** works out the publish date the API should store */
export function toPublishedAt(form: PostFormValues, now = new Date()): string | null {
    switch (form.publishMode) {
        case 'draft':
            return null;
        case 'schedule':
            return fromDateTimeLocal(form.scheduledFor ?? '');
        case 'now': {
        // leep its original date if already live so editing a typo doesn't make an
        // old post look brand new (or jump to the top of the blog)
        const current = form.currentPublishedAt ? new Date(form.currentPublishedAt) : null;
        if (current && !Number.isNaN(current.getTime()) && current <= now) {
            return current.toISOString();
        }
        return now.toISOString();
        }
    }
}


export async function postEditorAction({
    request,
    params,
}: ActionFunctionArgs): Promise<PostEditorActionData | Response> {
    const formData = Object.fromEntries(await request.formData());
    const result = postFormSchema.safeParse(formData);

    if (!result.success) {
        return { fieldErrors: z.flattenError(result.error).fieldErrors as FieldErrors };
    }

    const form = result.data;
    const input: PostInput = {
        title: form.title,
        slug: form.slug,
        summary: form.summary,
        body: form.body,
        tags: form.tags,
        publishedAt: toPublishedAt(form),
    };

    try {
        const save = params.id === undefined ? createPost(input) : updatePost(params.id, input);
        await withAdminSession(request, save);
    } 
    catch (error) {
        if (error instanceof ApiError && error.status === 409) {
            return { fieldErrors: { slug: [error.message] } };
        }
        if (error instanceof ApiError && error.status === 400) {
            return { formError: error.message };
        }
        if (error instanceof ApiError && error.status === 404) {
            return { formError: 'This post no longer exists. It may have been deleted in another tab.' };
        }
        throw error;
    }

    return redirect('/admin/posts');
}