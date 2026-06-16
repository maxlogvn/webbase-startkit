/**
 * Hook server — Xử lý redirect
 *
 * Luồng hoạt động:
 *
 *  1. Khởi tạo: load danh sách redirect từ Directus vào memory
 *     └─ Thành công → redirectRules được fill
 *     └─ Thất bại → log lỗi, tiếp tục không redirect
 *
 *  2. Mỗi request: kiểm tra URL có khớp redirect không
 *     └─ Có redirect → throw 301 (permanent) hoặc 302 (tạm thời)
 *     └─ Không có → resolve bình thường
 */

// ─── Import ──────────────────────────────────────────────────────────────────

import type { Handle } from '@sveltejs/kit';
import { redirect as svelteRedirect } from '@sveltejs/kit';
import type { SvelteRedirect } from '$lib/directus/fetchRedirects';
import { fetchRedirects } from '$lib/directus/fetchRedirects';
import {
	getSession,
	refreshTokens,
	fetchUserInfo,
	setSession,
	clearSession
} from '$lib/server/session';

// ─── Constants ───────────────────────────────────────────────────────────────

let redirectRules: SvelteRedirect[] = [];

// ── Load redirect rules khi server khởi động
// Dùng IIFE async để không block startup, nhưng vẫn đảm bảo redirectRules sẵn sàng trước request đầu tiên
const redirectsLoaded: Promise<void> = (async () => {
	try {
		redirectRules = await fetchRedirects();
		console.info(`[hooks] Loaded ${redirectRules.length} redirects`);
	} catch (error: unknown) {
		// Redirect không phải là critical — nếu lỗi thì vẫn cho request đi qua
		console.error('[hooks] Failed to load redirects:', error);
	}
})();

// ─── Handle ──────────────────────────────────────────────────────────────────

export const handle: Handle = async ({ event, resolve }) => {
	// ── Bước 1: Đợi redirect rules load xong
	await redirectsLoaded;

	// ── Bước 2: Chuẩn hóa đường dẫn — xóa trailing slash, giữ "/" cho root
	const incomingPath = event.url.pathname.replace(/\/$/, '') || '/';

	// ── Bước 3: Tìm redirect match
	const match = redirectRules.find((r) => {
		const sourcePath = r.source.replace(/\/$/, '') || '/';
		return sourcePath === incomingPath;
	});

	// ── Bước 4: Nếu match, throw redirect (SvelteKit handle redirect bằng throw)
	if (match) {
		throw svelteRedirect(match.permanent ? 301 : 302, match.destination);
	}

	// ── Bước 5: Xử lý session — đọc cookie, refresh token nếu cần
	const session = getSession(event.cookies);
	if (session) {
		const refreshed = await refreshTokens(session.refreshToken);
		if (refreshed) {
			const freshUser = await fetchUserInfo(refreshed.accessToken);
			if (freshUser) {
				setSession(event.cookies, refreshed.refreshToken, freshUser);
				event.locals.user = freshUser;
			} else {
				// Giữ user cũ nếu fetch user info thất bại
				event.locals.user = session.user;
			}
			event.locals.token = refreshed.accessToken;
		} else {
			// Refresh failed — clear session
			clearSession(event.cookies);
			event.locals.user = null;
			event.locals.token = null;
		}
	} else {
		event.locals.user = null;
		event.locals.token = null;
	}

	// ── Bước 6: Không match redirect, tiếp tục xử lý bình thường
	return resolve(event);
};
