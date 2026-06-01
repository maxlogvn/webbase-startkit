// ─── Import ──────────────────────────────────────────────────────────────────

import { z } from 'zod';
import type { FormField } from '$lib/types/directus-schema';

// ─── Builder ─────────────────────────────────────────────────────────────────

// ── Xây dựng Zod schema động từ cấu hình form field của Directus
// Mỗi field type sẽ có schema validation tương ứng
export const buildZodSchema = (fields: FormField[]) => {
	const schema: Record<string, z.ZodTypeAny> = {};

	fields.forEach((field) => {
		let fieldSchema: z.ZodTypeAny;

		// ── Bước 1: Tạo schema cơ bản theo type của field
		switch (field.type) {
			case 'checkbox':
				fieldSchema = z.boolean().default(false);
				break;

			case 'checkbox_group':
				fieldSchema = z.array(z.string()).default([]);
				break;

			case 'radio':
				fieldSchema = z.string();
				break;

			case 'file':
				// File required → bắt buộc phải có file
				// File optional → có thể undefined
				if (field.required) {
					fieldSchema = z.instanceof(File, {
						message: `${field.label || field.name} is required`
					});
				} else {
					fieldSchema = z
						.instanceof(File, {
							message: `${field.label || field.name} must be a valid file if provided`
						})
						.or(z.undefined());
				}
				break;

			default:
				// Text, textarea, v.v. — mặc định là string
				fieldSchema = z.string();
				break;
		}

		// ── Bước 2: Áp dụng validation rules từ Directus (VD: "email|min:3|max:100")
		if (field.validation) {
			const rules = field.validation.split('|');
			rules.forEach((rule) => {
				const [ruleName, ruleValue] = rule.split(':');
				const normalizedRule = ruleName.toLowerCase();

				// Validation chỉ áp dụng cho string fields
				if (fieldSchema instanceof z.ZodString) {
					switch (normalizedRule) {
						case 'email':
							fieldSchema = fieldSchema.email(`${field.label || field.name} must be a valid email`);
							break;

						case 'url':
							fieldSchema = fieldSchema.url(`${field.label || field.name} must be a valid URL`);
							break;

						case 'min': {
							const min = parseInt(ruleValue, 10);
							fieldSchema = fieldSchema.min(
								min,
								`${field.label || field.name} must be at least ${min} characters`
							);
							break;
						}

						case 'max': {
							const max = parseInt(ruleValue, 10);
							fieldSchema = fieldSchema.max(
								max,
								`${field.label || field.name} must be at most ${max} characters`
							);
							break;
						}
						case 'length': {
							const length = parseInt(ruleValue, 10);
							fieldSchema = fieldSchema.length(
								length,
								`${field.label || field.name} must be exactly ${length} characters`
							);
							break;
						}

						default:
							console.warn(`Unknown validation rule: ${ruleName}`);
					}
				}
			});
		}

		// ── Bước 3: Xử lý required/optional
		if (field.required) {
			// String required → không cho phép empty string
			if (fieldSchema instanceof z.ZodString) {
				fieldSchema = fieldSchema.nonempty(`${field.label || field.name} is required`);
			}
		} else {
			// String optional → cho phép empty string hoặc undefined
			fieldSchema = fieldSchema.or(z.literal('')).or(z.undefined());
		}

		if (field.name) {
			schema[field.name] = fieldSchema;
		}
	});

	return z.object(schema);
};
