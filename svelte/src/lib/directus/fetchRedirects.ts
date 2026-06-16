// ─── Import ──────────────────────────────────────────────────────────────────

import { PUBLIC_DIRECTUS_URL } from '$env/static/public';
import { createDirectus, readItems, rest } from '@directus/sdk';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SvelteRedirect {
	source: string;
	destination: string;
	permanent: boolean;
}

// ─── Fetcher ─────────────────────────────────────────────────────────────────

export async function fetchRedirects(): Promise<SvelteRedirect[]> {
	const directusUrl = PUBLIC_DIRECTUS_URL;
	if (!directusUrl) {
		// Không có URL thì không thể fetch — trả về mảng rỗng
		console.warn('Missing PUBLIC_DIRECTUS_URL!');
		return [];
	}

	try {
		// ── Bước 1: Tạo client Directus để fetch
		const directus = createDirectus(directusUrl).with(rest());

		// ── Bước 2: Fetch tất cả redirect rules từ Directus
		// limit: -1 có nghĩa là lấy tất cả (Directus mặc định giới hạn 100)
		const redirects = await directus.request(
			readItems('redirects', {
				filter: {
					url_from: { _nnull: true },
					url_to: { _nnull: true }
				},
				limit: -1
			})
		);

		// ── Bước 3: Xử lý và chuẩn hóa dữ liệu redirect
		const processedRedirects: SvelteRedirect[] = [];

		for (const redirect of redirects) {
			// Bỏ qua redirect không hợp lệ
			if (!redirect.url_from || !redirect.url_to) {
				continue;
			}

			// Bỏ qua self-redirect (source === destination) tránh redirect loop
			if (redirect.url_from === redirect.url_to) {
				continue;
			}

			// Response code mặc định là 301 nếu không được set
			let responseCode = redirect.response_code ? parseInt(redirect.response_code) : 301;

			// Chỉ chấp nhận 301 và 302, các giá trị khác fallback về 301
			if (responseCode !== 301 && responseCode !== 302) {
				responseCode = 301;
			}

			processedRedirects.push({
				source: redirect.url_from,
				destination: redirect.url_to,
				permanent: responseCode === 301
			});
		}

		console.info(`${redirects.length} redirects loaded`);

		// Log từng redirect để debug
		for (const redirect of redirects) {
			console.info(`${redirect.response_code} - From: ${redirect.url_from} To:${redirect.url_to}`);
		}

		return processedRedirects;
	} catch (error) {
		// Lỗi không critical — trả về mảng rỗng để server không crash
		console.error('Error loading redirects', error);
		return [];
	}
}
