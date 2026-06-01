/**
 * Blog post — Hiển thị bài viết blog
 *
 * Luồng hoạt động:
 *
 *  1. Đọc query params: id, version, preview + slug từ route params
 *     └─ preview=true → inject token để xem draft
 *     └─ version != null → kiểm tra xem có phải draft không
 *
 *  2. Xác định postId
 *     ├─ Có id từ query param → dùng luôn
 *     └─ Có version nhưng không có id → tra slug để lấy id (404 nếu không tìm thấy)
 *
 *  3. Fetch post data
 *     ├─ Cả id và version → fetch version cụ thể
 *     └─ Không → fetch theo slug (có draft mode nếu cần)
 *
 *  4. Xử lý SEO: title, description, Open Graph tags, author
 *     └─ Không tìm thấy post → 404
 *
 *  5. Return post + SEO data
 */

// ─── Import ──────────────────────────────────────────────────────────────────

import { fetchPostBySlug, fetchPostByIdAndVersion, getPostIdBySlug } from '$lib/directus/fetchers';
import { PUBLIC_SITE_URL } from '$env/static/public';
import { getDirectusAssetURL } from '$lib/directus/directus-utils';
import type { PageServerLoad } from './$types';
import type { DirectusUser } from '$lib/types/directus-schema';
import { error } from '@sveltejs/kit';
import { DIRECTUS_SERVER_TOKEN } from '$env/static/private';

// ─── Load ────────────────────────────────────────────────────────────────────

export const load = (async (event) => {
	// ── Bước 1: Đọc query params và route params
	const id = event.url.searchParams.get('id') || '';
	let version = event.url.searchParams.get('version') || '' || undefined;
	const preview = event.url.searchParams.get('preview') === 'true';
	const token = preview ? DIRECTUS_SERVER_TOKEN : undefined;
	const slug = event.params.slug;

	// ── Bước 2: Live preview gửi version=main, nhưng fetch main version không cần version param
	version = version !== 'main' ? version : undefined;

	// ── Bước 3: Xác định post đang xem có phải draft không
	// Draft = có preview hoặc có version cụ thể (không phải "published")
	const isDraft = preview || (!!version && version !== 'published');

	// ── Bước 4: Xác định postId và fetch data
	try {
		let postId = id;

		// Nếu có version nhưng không có id, cần tra slug trước
		if (version && !postId) {
			const foundPostId = await getPostIdBySlug(slug, token);
			if (!foundPostId) {
				error(404, {
					message: 'Post Not found'
				});
			}
			postId = foundPostId;
		}

		let result;
		if (postId && version) {
			// Trường hợp: có id + version → fetch version cụ thể
			result = await fetchPostByIdAndVersion(postId, version, slug, token);
		} else {
			// Trường hợp: không có version → fetch bình thường (hoặc draft)
			result = await fetchPostBySlug(slug, { draft: isDraft, token });
		}

		const { post, relatedPosts } = result;

		// ── Bước 5: Kiểm tra post có tồn tại không
		if (!post) {
			error(404, {
				message: 'Post Not found'
			});
		}

		// ── Bước 6: Xử lý SEO data
		const ogImage = post.image ? getDirectusAssetURL(post.image) : null;
		const author =
			post.author && typeof post.author === 'object' ? (post.author as DirectusUser) : null;

		return {
			post,
			author,
			relatedPosts,
			title: post?.seo?.title ?? post.title ?? '',
			description: post?.seo?.meta_description ?? '',
			// Open Graph tags cho chia sẻ lên mạng xã hội
			openGraph: {
				title: post?.seo?.title ?? post.title ?? '',
				description: post?.seo?.meta_description ?? '',
				url: `${PUBLIC_SITE_URL}/blog/${slug}`,
				type: 'article',
				images: ogImage ? [{ url: ogImage }] : undefined
			}
		};
	} catch (error) {
		// Log lỗi trước khi throw để SvelteKit hiển thị trang error
		console.error('Error loading blog post:', error);
		throw error;
	}
}) satisfies PageServerLoad;
