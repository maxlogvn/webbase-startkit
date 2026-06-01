<script lang="ts">
	// -- DynamicForm: render fields động từ Directus với validation qua Zod + superforms
	import setAttr from '$lib/directus/visualEditing';
	import type { FormField as FormFieldType } from '$lib/types/directus-schema';
	import { buildZodSchema } from '$lib/zodSchemaBuilder';
	import Button from '../blocks/Button.svelte';
	import Field from './FormField.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	interface DynamicFormProps {
		fields: FormFieldType[];
		onSubmit: (data: Record<string, any>) => void;
		submitLabel: string;
		id: string;
	}

	// $props() snapshot — fields từ Directus, không thay đổi reactive
	const { fields, onSubmit, submitLabel, id }: DynamicFormProps = $props();

	// $derived vì sortedFields phụ thuộc fields — sắp xếp theo sort order từ Directus
	const sortedFields = $derived([...fields].sort((a, b) => (a.sort || 0) - (b.sort || 0)));
	// buildZodSchema xây dựng schema validation động — chạy một lần vì fields không đổi
	const formSchema = buildZodSchema(fields);

	// Khởi tạo giá trị mặc định cho từng field dựa trên type
	const defaultValues = fields.reduce<Record<string, any>>((defaults, field) => {
		if (!field.name) return defaults;
		switch (field.type) {
			case 'checkbox':
				defaults[field.name] = false;
				break;
			case 'checkbox_group':
				defaults[field.name] = [];
				break;
			case 'radio':
				defaults[field.name] = '';
				break;
			default:
				defaults[field.name] = '';
				break;
		}

		return defaults;
	}, {});

	// superForm chụp snapshot defaultValues lúc init — KHÔNG thể dùng $derived
	const form = superForm(defaultValues, {
		validators: zodClient(formSchema),
		SPA: true
	});

	// $derived lấy validateForm và enhance từ form object
	const { validateForm, enhance } = $derived(form);

	// Submit handler: validate form, nếu valid thì gọi onSubmit callback
	const onsubmit = async (e: Event) => {
		e.preventDefault();
		const result = await validateForm();
		if (result.valid) {
			onSubmit(result.data);
		}
	};
</script>

<form
	class="flex flex-wrap gap-4"
	method="POST"
	use:enhance
	{onsubmit}
	data-directus={setAttr({
		collection: 'forms',
		item: id,
		fields: 'fields',
		mode: 'popover'
	})}
>
	{#each sortedFields as field (field.id)}
		<Field {field} {form} />
	{/each}

	<div class="w-full">
		<div
			data-directus={setAttr({
				collection: 'forms',
				item: id,
				fields: 'submit_label',
				mode: 'popover'
			})}
		>
			<Button
				type="submit"
				icon="arrow"
				label={submitLabel}
				iconPosition="right"
				id={`submit-${submitLabel.replace(/\s+/g, '-').toLowerCase()}`}
			></Button>
		</div>
	</div>

	<!-- Form debugger tạm ẩn — có thể bật lại khi cần debug validation -->
	<!-- {#if dev}
		<div class="flex w-full flex-col gap-2 rounded-xl bg-red-200 p-2">
			<p class="text-center text-red-500">Form Debugger. This is not displayed in production</p>
			{#await superValidate($formData, zod(formSchema)) then r}
				<SuperDebug data={r} />
			{/await}
		</div>
	{/if} -->
</form>
