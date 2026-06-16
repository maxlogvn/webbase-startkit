/**
 * Root layout — Load dữ liệu dùng chung cho toàn bộ site
 *
 * Luồng hoạt động:
 *
 *  1. Kiểm tra query param visual-editing
 *     └─ `?visual-editing=true` và PUB_ENABLE_VISUAL_EDITING != 'false' → bật VE
 *     └─ Ngược lại → tắt VE
 *
 *  2. Fetch site data: globals, header navigation, footer navigation
 *
 *  3. Trả về layout data cho toàn bộ route
 */

// ─── Import ──────────────────────────────────────────────────────────────────

import { fetchSiteData } from '$lib/directus/fetchers';
import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/public';

// ─── Load ────────────────────────────────────────────────────────────────────

export const load = (async (event) => {
	// ── Bước 1: Kiểm tra Visual Editing có được bật không
	// Mặc định bật (true), tắt bằng cách set PUB_ENABLE_VISUAL_EDITING=false
	const visualEditingEnabled =
		event.url.searchParams.get('visual-editing') === 'true' &&
		env.PUBLIC_ENABLE_VISUAL_EDITING !== 'false';

	// ── Bước 2: Fetch globals + navigation từ Directus
	const { globals, headerNavigation, footerNavigation } = await fetchSiteData();

	// ── Bước 3: Lấy accent color từ globals, fallback về màu mặc định
	const accentColor = globals?.accent_color || '#6644ff';

	return {
		globals,
		headerNavigation,
		footerNavigation,
		accentColor,
		visualEditingEnabled,
		user: event.locals.user
	};
}) satisfies LayoutServerLoad;
