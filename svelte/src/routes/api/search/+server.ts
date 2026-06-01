/**
 * Search API — Tìm kiếm pages và posts
 *
 * Luồng hoạt động:
 *
 *  1. Kiểm tra query param ?search=...
 *     └─ Null hoặc < 3 ký tự → 400
 *
 *  2. Fetch pages + posts song song (Promise.all)
 *     ├─ Pages: tìm trong title, permalink (không filter status)
 *     └─ Posts: chỉ tìm published, trong title, description, slug, content
 *
 *  3. Map kết quả thành format chung: { id, title, type, link, description? }
 *
 *  4. Trả về JSON array
 */

// ─── Import ──────────────────────────────────────────────────────────────────

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { useDirectus } from '$lib/directus/directus';

// ─── Actions ─────────────────────────────────────────────────────────────────

export const GET: RequestHandler = async ({ request }) => {
	// ── Bước 1: Validate search query
	const { searchParams } = new URL(request.url);
	const search = searchParams.get('search');

	// Tối thiểu 3 ký tự để tránh search quá rộng và giảm tải
	if (!search || search.length < 3) {
		return json({ error: 'Query must be at least 3 characters.' }, { status: 400 });
	}

	const { getDirectus, readItems } = useDirectus();
	const directus = getDirectus();

	// ── Bước 2: Fetch pages + posts song song
	try {
		const [pages, posts] = await Promise.all([
			directus.request(
				readItems('pages', {
					filter: {
						_or: [{ title: { _contains: search } }, { permalink: { _contains: search } }]
					},
					fields: ['id', 'title', 'permalink']
				})
			),

			directus.request(
				readItems('posts', {
					// Chỉ tìm posts đã published — pages không cần filter status
					filter: {
						_and: [
							{ status: { _eq: 'published' } },
							{
								_or: [
									{ title: { _contains: search } },
									{ description: { _contains: search } },
									{ slug: { _contains: search } },
									{ content: { _contains: search } }
								]
							}
						]
					},
					fields: ['id', 'title', 'description', 'slug', 'content', 'status']
				})
			)
		]);

		// ── Bước 3: Chuẩn hóa kết quả về format chung
		const results = [
			...pages.map((page: any) => ({
				id: page.id,
				title: page.title,
				type: 'Page',
				link: `/${page.permalink.replace(/^\/+/, '')}`
			})),

			...posts.map((post: any) => ({
				id: post.id,
				title: post.title,
				description: post.description,
				type: 'Post',
				link: `/blog/${post.slug}`
			}))
		];

		return json(results);
	} catch (error) {
		console.error('Error fetching search results:', error);

		return json({ error: 'Failed to fetch search results.' }, { status: 500 });
	}
};
