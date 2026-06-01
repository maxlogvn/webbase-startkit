// ─── Import ──────────────────────────────────────────────────────────────────

import {
	createDirectus,
	readItems,
	readItem,
	readSingleton,
	rest,
	readUser,
	createItem,
	uploadFiles,
	withToken
} from '@directus/sdk';
import Queue from 'p-queue';
import type { Schema } from '../types/directus-schema';
import { PUBLIC_DIRECTUS_URL } from '$env/static/public';
import { getRequestEvent } from '$app/server';
import { browser } from '$app/environment';

// ─── Helpers: Fetch function ─────────────────────────────────────────────────

// ── Lấy fetch function phù hợp với môi trường
// Server: dùng fetch từ request event để đảm bảo context
// Browser: dùng globalThis.fetch
const getFetchFn = () => {
	try {
		if (!browser) return getRequestEvent().fetch;
		return globalThis.fetch;
	} catch {
		return globalThis.fetch;
	}
};

// ── Retry khi gặp HTTP 429 (Too Many Requests)
// Tối đa 3 lần retry, mỗi lần cách 500ms
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const fetchRetry = async (count: number, ...args: any[]) => {
	const fetch = getFetchFn();
	const response = await fetch(...(args as Parameters<typeof fetch>));

	// Chỉ retry khi gặp 429 và chưa qua 3 lần
	if (count > 2 || response.status !== 429) return response;

	console.warn(`[429] Too Many Requests (Attempt ${count + 1})`);

	await sleep(500);

	return fetchRetry(count + 1, ...args);
};

// ─── Queue: Rate limiting ────────────────────────────────────────────────────

// Giới hạn 10 request / 500ms để tránh quá tải Directus
const queue = new Queue({ intervalCap: 10, interval: 500, carryoverConcurrencyCount: true });

// ─── Constants ───────────────────────────────────────────────────────────────

const directusUrl = PUBLIC_DIRECTUS_URL;

// ─── Client ──────────────────────────────────────────────────────────────────

const getDirectus = () => {
	// Tạo Directus client với fetch function có queue + retry
	const directus = createDirectus<Schema>(directusUrl, {
		globals: {
			fetch: (...args) => queue.add(() => fetchRetry(0, ...args))
		}
	}).with(rest());

	return directus;
};

// ─── Exports ─────────────────────────────────────────────────────────────────

export const useDirectus = () => ({
	// directus: directus as RestClient<Schema>,
	getDirectus: getDirectus,
	readItems,
	readItem,
	readSingleton,
	readUser,
	createItem,
	uploadFiles,
	withToken
});
