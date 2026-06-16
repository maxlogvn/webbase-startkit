/**
 * Form submit API — Nhận và lưu submission từ dynamic form
 *
 * Luồng hoạt động:
 *
 *  1. Kiểm tra DIRECTUS_SERVER_TOKEN tồn tại
 *     └─ Không có → 500
 *
 *  2. Parse FormData: formId + fields (JSON string)
 *     └─ Thiếu hoặc sai format → 400
 *
 *  3. Duyệt từng field, xử lý theo loại:
 *     ├─ File → upload lên Directus, lưu file ID
 *     └─ Text → lưu value trực tiếp
 *
 *  4. Tạo form_submissions record trong Directus
 *     └─ Lỗi → 500
 *
 *  5. Trả về { success: true }
 */

// ─── Import ──────────────────────────────────────────────────────────────────

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { useDirectus } from '$lib/directus/directus';
import { DIRECTUS_SERVER_TOKEN } from '$env/static/private';

// ─── Types ───────────────────────────────────────────────────────────────────

type FormField = { id: string; name: string; type: string };

// ─── Helpers ─────────────────────────────────────────────────────────────────

// ── Kiểm tra một field có đúng cấu trúc FormField không
function isFormField(f: unknown): f is FormField {
	return (
		typeof f === 'object' &&
		f !== null &&
		typeof (f as FormField).id === 'string' &&
		typeof (f as FormField).name === 'string' &&
		typeof (f as FormField).type === 'string'
	);
}

// ── Parse fields JSON string thành array FormField
// Trả về Response (lỗi) nếu parse thất bại
function parseFields(raw: string): FormField[] | Response {
	try {
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) {
			return json({ error: 'fields must be an array' }, { status: 400 });
		}
		if (!parsed.every(isFormField)) {
			return json({ error: 'Each field must have id, name, and type (strings)' }, { status: 400 });
		}
		return parsed;
	} catch {
		return json({ error: 'Invalid fields JSON' }, { status: 400 });
	}
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export const POST: RequestHandler = async ({ request, locals }) => {
	const { getDirectus, uploadFiles, createItem, withToken } = useDirectus();
	const directus = getDirectus();
	// Uu tien user token neu co, fallback ve SERVER_TOKEN
	const TOKEN = locals.token || DIRECTUS_SERVER_TOKEN;

	// ── Bước 1: Kiểm tra token — cần thiết để ghi vào Directus
	if (!TOKEN) {
		return json(
			{ error: 'DIRECTUS_SERVER_TOKEN is not defined. Check your .env file.' },
			{ status: 500 }
		);
	}

	try {
		// ── Bước 2: Parse FormData
		const formData = await request.formData();
		const formId = formData.get('formId');
		if (typeof formId !== 'string' || !formId.trim()) {
			return json({ error: 'Missing or invalid formId' }, { status: 400 });
		}

		const fieldsRaw = formData.get('fields');
		if (typeof fieldsRaw !== 'string') {
			return json({ error: 'Missing or invalid fields' }, { status: 400 });
		}
		const fieldsResult = parseFields(fieldsRaw);
		if (fieldsResult instanceof Response) return fieldsResult;
		const fields = fieldsResult;

		// ── Bước 3: Duyệt từng field để lấy value
		const submissionValues: { field: string; value?: string; file?: string }[] = [];

		for (const field of fields) {
			const value = formData.get(field.name);
			if (value === null || value === undefined) continue;

			if (value instanceof File && value.size > 0) {
				// ── File: upload lên Directus, lưu file ID thay vì value
				const uploadFormData = new FormData();
				uploadFormData.append('file', value);

				const uploadedFile = await directus.request(withToken(TOKEN, uploadFiles(uploadFormData)));
				if (uploadedFile && 'id' in uploadedFile) {
					submissionValues.push({ field: field.id, file: (uploadedFile as { id: string }).id });
				}
			} else if (typeof value === 'string') {
				// ── Text: lưu value trực tiếp
				submissionValues.push({ field: field.id, value });
			}
		}

		// ── Bước 4: Tạo submission record trong Directus
		await directus.request(
			withToken(
				TOKEN,
				createItem('form_submissions', { form: formId.trim(), values: submissionValues })
			)
		);

		return json({ success: true });
	} catch (error) {
		// Lỗi không xác định — log và trả về generic error
		console.error('Error submitting form:', error);
		return json({ error: 'Failed to submit form' }, { status: 500 });
	}
};
