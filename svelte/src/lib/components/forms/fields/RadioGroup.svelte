<script lang="ts">
	// -- RadioGroup field: chọn một trong nhiều option — dùng shadcn radio-group
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';

	interface RadioGroupFieldProps {
		name: string;
		options: { value: string; text: string }[];
		form?: any;
	}

	const { name, options, form }: RadioGroupFieldProps = $props();

	// $derived vì formData phụ thuộc form — lấy store từ superForm
	let { form: formData } = $derived(form);
</script>

<!-- Bind trực tiếp value vào $formData — two-way binding với radio-group root -->
<RadioGroup.Root bind:value={$formData[name]}>
	{#each options as option (option.value)}
		<div class="flex items-center gap-x-2">
			<RadioGroup.Item id={`${name}-${option.value}`} value={option.value} />
			<label for={`${name}-${option.value}`} class="text-sm">
				{option.text}
			</label>
		</div>
	{/each}
</RadioGroup.Root>
