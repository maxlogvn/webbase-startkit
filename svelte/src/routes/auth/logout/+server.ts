/**
 * Logout — Xoa session cookie + logout khoi Directus
 *
 * Flow:
 *  1. POST /auth/logout -> Directus (invalidates refresh token)
 *  2. Xoa session cookie
 *  3. Redirect ve /
 */

// ─── Import ──────────────────────────────────────────────────────────────────

import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { clearSession, getSession } from '$lib/server/session';
import { PUBLIC_DIRECTUS_URL } from '$env/static/public';

// ─── GET ─────────────────────────────────────────────────────────────────────

export const GET: RequestHandler = async ({ cookies }) => {
	const session = getSession(cookies);

	if (session?.refreshToken) {
		try {
			await fetch(`${PUBLIC_DIRECTUS_URL}/auth/logout`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					refresh_token: session.refreshToken,
					mode: 'json'
				})
			});
		} catch (err) {
			console.error('[logout] Directus logout failed:', err);
		}
	}

	clearSession(cookies);
	redirect(303, '/');
};
