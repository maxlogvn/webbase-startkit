/**
 * OAuth callback — Nhan tokens tu Directus, tao session
 *
 * Flow:
 *  1. Directus redirect ve day voi access_token + refresh_token
 *  2. Fetch user info
 *  3. Tao session cookie
 *  4. Redirect ve trang chu (hoac ?redirect=...)
 */

// ─── Import ──────────────────────────────────────────────────────────────────

import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { setSession, fetchUserInfo } from '$lib/server/session';

// ─── GET ─────────────────────────────────────────────────────────────────────

export const GET: RequestHandler = async ({ url, cookies }) => {
	const accessToken = url.searchParams.get('access_token');
	const refreshToken = url.searchParams.get('refresh_token');
	const errorParam = url.searchParams.get('error');

	if (errorParam || !accessToken || !refreshToken) {
		redirect(303, `/auth/login?error=${errorParam || 'auth_failed'}`);
	}

	const user = await fetchUserInfo(accessToken);
	if (!user) {
		redirect(303, '/auth/login?error=user_fetch_failed');
	}

	setSession(cookies, refreshToken, user);

	const redirectTo = url.searchParams.get('redirect') || '/';
	redirect(303, redirectTo);
};
