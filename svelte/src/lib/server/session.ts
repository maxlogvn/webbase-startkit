// ─── Auth Session ──────────────────────────────────────────────────────────
// Quan ly session cookie: set, get, clear, refresh token

import type { Cookies } from '@sveltejs/kit';
import { PUBLIC_DIRECTUS_URL } from '$env/static/public';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface AuthUser {
	id: string;
	email: string | null;
	name: string;
	avatar: string | null;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const SESSION_COOKIE = 'auth_session';
const USER_COOKIE = 'auth_user';
const COOKIE_OPTIONS = {
	httpOnly: true,
	secure: true,
	sameSite: 'lax' as const,
	path: '/',
	maxAge: 60 * 60 * 24 * 30
};

// ─── Session Helpers ───────────────────────────────────────────────────────

/** Doc session tu cookie. Tra ve user + refreshToken neu co. */
export function getSession(cookies: Cookies): { user: AuthUser; refreshToken: string } | null {
	const session = cookies.get(SESSION_COOKIE);
	const user = cookies.get(USER_COOKIE);
	if (!session || !user) return null;
	try {
		return { user: JSON.parse(user), refreshToken: session };
	} catch {
		return null;
	}
}

/** Luu session vao cookie. */
export function setSession(cookies: Cookies, refreshToken: string, user: AuthUser): void {
	cookies.set(SESSION_COOKIE, refreshToken, COOKIE_OPTIONS);
	cookies.set(USER_COOKIE, JSON.stringify(user), COOKIE_OPTIONS);
}

/** Xoa session cookie. */
export function clearSession(cookies: Cookies): void {
	cookies.delete(SESSION_COOKIE, COOKIE_OPTIONS);
	cookies.delete(USER_COOKIE, COOKIE_OPTIONS);
}

// ─── Directus Auth API ─────────────────────────────────────────────────────

/** Refresh access token bang refresh token. Tra ve tokens moi. */
export async function refreshTokens(
	refreshToken: string
): Promise<{ accessToken: string; refreshToken: string } | null> {
	try {
		const res = await fetch(`${PUBLIC_DIRECTUS_URL}/auth/refresh`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refresh_token: refreshToken, mode: 'json' })
		});
		if (!res.ok) return null;
		const json = await res.json();
		return {
			accessToken: json.data.access_token,
			refreshToken: json.data.refresh_token
		};
	} catch (err) {
		console.error('[session] refreshTokens failed:', err);
		return null;
	}
}

/** Lay thong tin user tu access token. */
export async function fetchUserInfo(accessToken: string): Promise<AuthUser | null> {
	try {
		const res = await fetch(`${PUBLIC_DIRECTUS_URL}/users/me`, {
			headers: { Authorization: `Bearer ${accessToken}` }
		});
		if (!res.ok) return null;
		const json = await res.json();
		const u = json.data;
		return {
			id: u.id,
			email: u.email,
			name: u.first_name || u.email || 'User',
			avatar: u.avatar ? `${PUBLIC_DIRECTUS_URL}/assets/${u.avatar}` : null
		};
	} catch (err) {
		console.error('[session] fetchUserInfo failed:', err);
		return null;
	}
}
