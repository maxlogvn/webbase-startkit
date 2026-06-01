<script lang="ts">
	// -- FormBuilder: quản lý vòng đời form — display, submit, xử lý kết quả (redirect/message)
	import type { FormField } from '$lib/types/directus-schema';
	import { cn } from '$lib/utils';
	import { CheckCircle } from '@lucide/svelte';
	import DynamicForm from './DynamicForm.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	interface FormBuilderProps {
		class?: string;
		form: {
			id: string;
			on_success?: 'redirect' | 'message' | null;
			sort?: number | null;
			submit_label?: string;
			success_message?: string | null;
			title?: string | null;
			success_redirect_url?: string | null;
			is_active?: boolean | null;
			fields: FormField[];
		};
	}

	// $props() snapshot — form config từ Directus
	const { form, class: className }: FormBuilderProps = $props();

	// $state vì đây là UI state nội bộ — thay đổi khi submit thành công hoặc lỗi
	let isSubmitted = $state(false);
	let error = $state<string | null>(null);

	// Submit form lên API endpoint — tự động xử lý redirect hoặc hiển thị message
	const handleSubmit = async (data: Record<string, any>) => {
		try {
			// Xây dựng payload gửi lên server: formId + field definitions + values
			const fieldsWithNames = form.fields.map((field) => ({
				id: field.id,
				name: field.name || '',
				type: field.type || ''
			}));

			const formData = new FormData();
			formData.append('formId', form.id);
			formData.append('fields', JSON.stringify(fieldsWithNames));
			for (const field of fieldsWithNames) {
				const value = data[field.name];
				if (value !== undefined && value !== null) {
					formData.append(field.name, value);
				}
			}

			// Gửi request — Form submit endpoint xử lý upload file và lưu submission
			const response = await fetch('/api/forms/submit', { method: 'POST', body: formData });
			if (!response.ok) throw new Error('Form submission failed');

			// Xử lý sau submit dựa trên cấu hình on_success trong Directus
			if (form.on_success === 'redirect' && form.success_redirect_url) {
				// Redirect nội bộ dùng SPA navigation, external dùng window.location
				if (form.success_redirect_url.startsWith('/')) {
					goto(resolve(form.success_redirect_url as any));
				} else {
					window.location.href = form.success_redirect_url; // TODO check if internal or external
				}
			} else {
				// Mặc định: hiển thị success message
				isSubmitted = true;
			}
		} catch (err) {
			console.error('Error submitting form:', err);
			error = 'Failed to submit the form. Please try again later.';
		}
	};
</script>

<!-- Chỉ render form khi is_active = true — kiểm soát từ Directus -->
{#if form.is_active}
	{#if isSubmitted}
		<!-- State thành công: ẩn form, hiển thị message -->
		<div class="flex flex-col items-center justify-center space-y-4 p-6 text-center">
			<CheckCircle class="size-12 text-green-500" />
			<p class="text-gray-600">
				{form.success_message || 'Your form has been submitted successfully.'}
			</p>
		</div>
	{:else}
		<div class={cn('border-input space-y-6 rounded-lg border p-8', className)}>
			{#if error}
				<!-- Error banner hiển thị khi submit thất bại -->
				<div class="rounded-md bg-red-100 p-4 text-red-500">
					<strong>Error:</strong>
					{error}
				</div>
			{/if}
			<DynamicForm
				fields={form.fields}
				onSubmit={handleSubmit}
				submitLabel={form.submit_label || 'Submit'}
				id={form.id}
			/>
		</div>
	{/if}
{/if}
