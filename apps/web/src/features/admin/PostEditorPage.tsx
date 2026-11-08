import { Form, Link, useActionData, useLoaderData, useNavigation } from 'react-router';
import type { FieldErrors, PostEditorActionData, postEditorLoader } from './PostEditor.route';
import { useDeferredValue, useId, useState, type ReactNode } from 'react';
import { slugify } from './slugify'
import type { PublishMode } from './adminPosts.schemas';
import { toDateTimeLocal } from './dateTimeLocal';
import { Markdown } from '../../components/ui/Markdown';
import { getPostStatus } from './postStatus';

import styles from './PostEditorPage.module.css';




export function PostEditorPage() {
    const post = useLoaderData<typeof postEditorLoader>();
    const actionData = useActionData() as PostEditorActionData | undefined;
    const errors: FieldErrors = actionData?.fieldErrors ?? {};
    const navigation = useNavigation();
    const isSaving = navigation.state === 'submitting';

    const isNew = post === null;
    const status = post ? getPostStatus(post.publishedAt) : 'draft';

    // controlled fields: the ones something else on the page reacts to
    const [title, setTitle] = useState(post?.title ?? '')
    const [slug, setSlug] = useState(post?.slug ?? '')

    // new posts: the slug follows the title until you type in the slug box yourself.
    // existing posts: never change the slug automatically (that would break old links).
    const [slugEdited, setSlugEdited] = useState(!isNew)
    const [body, setBody] = useState(post?.body ?? '')
    const [publishMode, setPublishMode] = useState<PublishMode>(
        status === 'draft' ? 'draft' : status === 'scheduled' ? 'schedule' : 'now',
    )

    // rendering Markdown on every keystroke can lag on long posts.
    // useDeferredValue lets typing stay instant; the preview catches up a moment later.
    const previewBody = useDeferredValue(body)


    return (
        <>
            <title>{`${isNew ? 'New post' : `Edit: ${post.title}`} | Admin`}</title>

            <header className={styles.header}>
                <Link to="/admin/posts" className={styles.back}>
                    <span aria-hidden="true">◀ </span>All posts
                </Link>
                <h1 className={styles.title}>{isNew ? 'New post' : 'Edit post'}</h1>
            </header>

            {actionData?.formError && (
                <p className={styles.formError} role="alert">
                    {actionData.formError}
                </p>
            )}
            {Object.keys(errors).length > 0 && (
                <p className={styles.formError} role="alert">
                    Some fields need fixing. Check the messages below.
                </p>
            )}

            <Form method="post" className={styles.form} noValidate>
                <div className={styles.meta}>
                    <Field label="Title" name="title" errors={errors.title}>
                        {(props) => (
                            <input
                                {...props}
                                value={title}
                                maxLength={200}
                                onChange={(event) => {
                                    setTitle(event.target.value)
                                    if (!slugEdited) setSlug(slugify(event.target.value))
                                }}
                            />
                        )}
                    </Field>

                    <Field
                        label="Slug"
                        name="slug"
                        errors={errors.slug}
                        hint={`The post's address: /blog/${slug || 'your-slug'}`}
                    >
                        {(props) => (
                            <input
                                {...props}
                                value={slug}
                                maxLength={100}
                                spellCheck={false}
                                autoCapitalize="none"
                                onChange={(event) => {
                                    setSlug(event.target.value)
                                    setSlugEdited(true)
                                }}
                            />
                        )}
                    </Field>

                    <Field label="Summary" name="summary" errors={errors.summary} hint="Shown on the blog list.">
                        {(props) => <textarea {...props} rows={3} maxLength={500} defaultValue={post?.summary} />}
                    </Field>

                    <Field label="Tags" name="tags" errors={errors.tags} hint="Separate with commas, e.g. python, networking">
                        {(props) => <input {...props} defaultValue={post?.tags.join(', ')} />}
                    </Field>
                </div>

                <fieldset className={styles.publish}>
                    <legend className={styles.label}>Visibility</legend>
                    {post?.publishedAt && <input type="hidden" name="currentPublishedAt" value={post.publishedAt} />}

                    <PublishOption mode="draft" current={publishMode} onChange={setPublishMode}>
                        Draft <span className={styles.optionHint}>only you can see it</span>
                    </PublishOption>
                    <PublishOption mode="now" current={publishMode} onChange={setPublishMode}>
                        {status === 'published' ? 'Published' : 'Publish now'}
                    </PublishOption>
                    <PublishOption mode="schedule" current={publishMode} onChange={setPublishMode}>
                        Schedule for later
                    </PublishOption>

                    {publishMode === 'schedule' && (
                        <Field label="Publish on" name="scheduledFor" errors={errors.scheduledFor} hint="Your local time.">
                            {(props) => (
                                <input
                                    {...props}
                                    type="datetime-local"
                                    defaultValue={post?.publishedAt ? toDateTimeLocal(post.publishedAt) : undefined}
                                />
                            )}
                        </Field>
                    )}
                </fieldset>

                <div className={styles.writer}>
                    <Field label="Body (Markdown)" name="body" errors={errors.body}>
                        {(props) => (
                            <textarea
                                {...props}
                                className={`${props.className} ${styles.bodyInput}`}
                                value={body}
                                onChange={(event) => setBody(event.target.value)}
                                spellCheck
                            />
                        )}
                    </Field>

                    <section className={styles.preview} aria-label="Preview">
                        <p className={styles.label} aria-hidden="true">
                            Preview
                        </p>
                        <div className={styles.previewPaper}>
                            {previewBody.trim() ? (
                                <Markdown>{previewBody}</Markdown>
                            ) : (
                                <p className={styles.placeholder}>Start writing and the preview appears here.</p>
                            )}
                        </div>
                    </section>
                </div>

                <div className={styles.actions}>
                    <button type="submit" className={styles.save} disabled={isSaving}>
                        {isSaving ? 'Saving…' : isNew ? 'Create post' : 'Save changes'}
                    </button>
                    <Link to="/admin/posts" className={styles.cancel}>
                        Cancel
                    </Link>
                </div>
            </Form>
        </>
    )
}




type FieldInputProps = {
    id: string
    name: string
    className: string
    'aria-invalid': boolean
    'aria-describedby': string | undefined
}


/**
 * one labelled form field with its hint and error messages wired up for
 * screen readers. the input is passed in as a function ("render prop"),
 * so the same wrapper works for <input>, <textarea> and different input types
 */
function Field({
    label,
    name,
    hint,
    errors,
    children,
}: {
    label: string;
    name: string;
    hint?: string;
    errors?: string[];
    children: (props: FieldInputProps) => ReactNode;
}) {
    const id = useId();
    const hintId = `${id}-hint`;
    const errorId = `${id}-error`;
    const hasError = Boolean(errors?.length);
    const describedBy = [hint && hintId, hasError && errorId].filter(Boolean).join(' ') || undefined;

    return (
        <div className={styles.field}>
            <label htmlFor={id} className={styles.label}>
                {label}
            </label>
            {children({
                id,
                name,
                className: styles.input,
                'aria-invalid': hasError,
                'aria-describedby': describedBy,
            })}
            {hint && (
                <p id={hintId} className={styles.hint}>
                    {hint}
                </p>
            )}
            {hasError && (
                <p id={errorId} className={styles.error}>
                    {errors?.join(' ')}
                </p>
            )}
        </div>
    )
}



function PublishOption({
    mode,
    current,
    onChange,
    children,
}: {
    mode: PublishMode;
    current: PublishMode;
    onChange: (mode: PublishMode) => void;
    children: ReactNode;
}) {
    return (
        <label className={styles.option}>
            <input
                type="radio"
                name="publishMode"
                value={mode}
                checked={current === mode}
                onChange={() => onChange(mode)}
            />
            <span>{children}</span>
        </label>
    )
}