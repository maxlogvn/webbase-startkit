/**
 * Register page — Dang ky tai khoan moi
 *
 * Flow:
 *  1. POST /auth/register -> Directus
 *  2. POST /auth/login -> Directus (login ngay sau register)
 *  3. Tao session cookie, redirect ve /
 */

// ─── Import ──────────────────────────────────────────────────────────────────

import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { setSession, fetchUserInfo } from '$lib/server/session';
import { PUBLIC_DIRECTUS_URL } from '$env/static/public';

// ─── Actions ─────────────────────────────────────────────────────────────────

export const actions: Actions = {
	register: async ({ request, cookies }) => {
		const form = await request.formData();
		const email = form.get('email')?.toString();
		const password = form.get('password')?.toString();
		const name = form.get('name')?.toString();

		if (!email || !password || !name) {
			return fail(400, { error: 'Vui long dien day du thong tin' });
		}

		if (password.length < 8) {
			return fail(400, { error: 'Mat khau phai co it nhat 8 ky tu' });
		}

		try {
			const res = await fetch(`${PUBLIC_DIRECTUS_URL}/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password, first_name: name })
			});

			if (!res.ok) {
				const err = await res.json();
				return fail(400, {
					error: err.errors?.[0]?.message || 'Dang ky that bai'
				});
			}

			// Login ngay sau khi register de tao session
			const loginRes = await fetch(`${PUBLIC_DIRECTUS_URL}/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password, mode: 'json' })
			});

			if (loginRes.ok) {
				const json = await loginRes.json();
				const user = await fetchUserInfo(json.data.access_token);
				if (user) {
					setSession(cookies, json.data.refresh_token, user);
				}
			}
		} catch (err) {
			console.error('[register] error:', err);
			return fail(500, { error: 'Loi server, vui long thu lai' });
		}

		redirect(303, '/');
	}
};
