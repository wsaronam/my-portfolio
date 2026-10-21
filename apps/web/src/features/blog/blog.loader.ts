import type { LoaderFunctionArgs } from "react-router";
import { fetchPostList } from "./posts.api";




/** runs before the Blog page renders, so the page always has its data. */
export async function blogLoader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const page = parsePage(url.searchParams.get('page'));

    return fetchPostList(page, request.signal);
}

/** turns ?page=... into a sensible page number. anything invalid means page 1. */
function parsePage(value: string | null): number {
    const page = Number(value ?? '1');
    return Number.isInteger(page) && page >= 1 ? page : 1;
}