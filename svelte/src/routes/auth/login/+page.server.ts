/**
 * Login page — Load enabled providers + xu ly email/password login
 *
 * Flow:
 *  1. Neu da login, redirect ve /
 *  2. Load danh sach auth_providers enabled
 *  3. POST /auth/login -> Directus, lay tokens
 *  4. Tao session cookie, redirect
 */

// ─── Import ──────────────────────────────────────────────────────────────────

import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { fetchAuthProviders } from '$lib/directus/fetchers';
import { setSession, fetchUserInfo } from '$lib/server/session';
import { PUBLIC_DIRECTUS_URL } from '$env/static/public';

// ─── Load ────────────────────────────────────────────────────────────────────

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user) redirect(303, '/');

	const providers = await fetchAuthProviders();
	const directusAuthUrl = `${PUBLIC_DIRECTUS_URL}/auth`;
	const redirectUrl = `${url.origin}/auth/callback`;

	return {
		providers: providers ?? [],
		directusAuthUrl,
		redirectUrl
	};
};

// ─── Actions ─────────────────────────────────────────────────────────────────

export const actions: Actions = {
	login: async ({ request, cookies, url }) => {
		const form = await request.formData();
		const email = form.get('email')?.toString();
		const password = form.get('password')?.toString();

		if (!email || !password) {
			return fail(400, { error: 'Vui long nhap email va mat khau' });
		}

		try {
			const res = await fetch(`${PUBLIC_DIRECTUS_URL}/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password, mode: 'json' })
			});

			if (!res.ok) {
				const err = await res.json();
				return fail(401, {
					error: err.errors?.[0]?.message || 'Dang nhap that bai'
				});
			}

			const json = await res.json();
			const accessToken = json.data.access_token;
			const refreshToken = json.data.refresh_token;

			const user = await fetchUserInfo(accessToken);
			if (!user) {
				return fail(500, { error: 'Khong the lay thong tin nguoi dung' });
			}

			setSession(cookies, refreshToken, user);
		} catch (err) {
			console.error('[login] error:', err);
			return fail(500, { error: 'Loi server, vui long thu lai' });
		}

		const redirectTo = url.searchParams.get('redirect') || '/';
		redirect(303, redirectTo);
	}
};
