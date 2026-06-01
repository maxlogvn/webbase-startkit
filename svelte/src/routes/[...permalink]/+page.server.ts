/**
 * CMS page — Hiển thị trang động dựa trên permalink
 *
 * Luồng hoạt động:
 *
 *  1. Đọc query params: id, version, preview
 *     └─ preview=true → inject DIRECTUS_SERVER_TOKEN để xem draft
 *     └─ version=main → bỏ qua (mặc định)
 *
 *  2. Xác định pageId
 *     ├─ Có id từ query param → dùng luôn
 *     └─ Có version nhưng không có id → tra slug từ Directus để lấy id
 *
 *  3. Fetch page data
 *     ├─ Có cả id và version → fetch theo id + version
 *     └─ Không → fetch theo permalink (hoặc preview nếu có)
 *
 *  4. Return data hoặc throw error
 */

// ─── Import ──────────────────────────────────────────────────────────────────

import { fetchPageData, fetchPageDataById, getPageIdByPermalink } from '$lib/directus/fetchers';
import type { PageServerLoad } from './$types';
import { DIRECTUS_SERVER_TOKEN } from '$env/static/private';

// ─── Load ────────────────────────────────────────────────────────────────────

export const load = (async (event) => {
	// ── Bước 1: Đọc query params
	const id = event.url.searchParams.get('id') || '';
	let version = event.url.searchParams.get('version') || undefined;
	const preview = event.url.searchParams.get('preview') === 'true';
	// Chỉ inject token khi preview — không gửi token cho request thông thường
	const token = preview ? DIRECTUS_SERVER_TOKEN : undefined;

	// ── Bước 2: Live preview gửi version=main, nhưng fetch main version không cần version param
	version = version !== 'main' ? version : undefined;

	// ── Bước 3: Xác định pageId và fetch data
	try {
		let pageId = id;

		// Nếu có version nhưng không có id, cần tra slug trước
		if (version && !pageId) {
			const foundPageId = await getPageIdByPermalink(event.url.pathname, token);
			pageId = foundPageId || '';
		}

		let data;
		if (pageId && version) {
			// Trường hợp: có id + version → fetch version cụ thể
			data = await fetchPageDataById(pageId, version, token);
		} else {
			// Trường hợp: không có version → fetch bình thường (hoặc preview)
			data = await fetchPageData(event.url.pathname, 1, token, preview);
		}

		return data;
	} catch (error) {
		// Log lỗi trước khi throw để SvelteKit hiển thị trang error
		console.error('Error loading page:', error);
		throw error;
	}
}) satisfies PageServerLoad;
