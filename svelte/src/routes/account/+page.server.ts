/**
 * Account page — Xem va cap nhat thong tin ca nhan
 *
 * Flow:
 *  1. Kiem tra auth — neu chua login, redirect ve /auth/login
 *  2. Load user info tu Directus
 *  3. POST cap nhat profile
 */

// ─── Import ──────────────────────────────────────────────────────────────────

import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { fetchCurrentUser, updateCurrentUser } from '$lib/directus/fetchers';
import { fetchUserInfo, setSession, getSession } from '$lib/server/session';

// ─── Load ────────────────────────────────────────────────────────────────────

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		redirect(303, `/auth/login?redirect=${url.pathname}`);
	}

	const user = await fetchCurrentUser(locals.token!);
	return { user };
};

// ─── Actions ─────────────────────────────────────────────────────────────────

export const actions: Actions = {
	update: async ({ request, locals, cookies }) => {
		if (!locals.user) return fail(401, { error: 'Unauthorized' });

		const form = await request.formData();
		const name = form.get('name')?.toString();

		if (!name) return fail(400, { error: 'Ten khong duoc de trong' });

		try {
			await updateCurrentUser(locals.token!, { first_name: name });

			// Refresh session user info
			const session = getSession(cookies);
			if (session) {
				const freshUser = await fetchUserInfo(locals.token!);
				if (freshUser) {
					setSession(cookies, session.refreshToken, freshUser);
					locals.user = freshUser;
				}
			}
		} catch (err) {
			console.error('[account] update failed:', err);
			return fail(500, { error: 'Cap nhat that bai' });
		}

		return { success: true };
	}
};
