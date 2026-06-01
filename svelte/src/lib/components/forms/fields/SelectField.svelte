<script lang="ts">
	// -- SelectField: dropdown chọn một giá trị — dùng shadcn select
	import * as Select from '$lib/components/ui/select/index.js';

	interface SelectFieldProps {
		name: string;
		options: { value: string; text: string }[];
		placeholder?: string | null;
		form?: any;
	}

	const { name, options, placeholder, form }: SelectFieldProps = $props();

	// const vì superForm store snapshot lúc init
	let { form: formData } = form;

	// $derived vì activeLabel phụ thuộc $formData[name] — tự động cập nhật khi chọn giá trị
	let activeLabel = $derived(
		options.find((option) => option.value === $formData[name])?.text ||
			placeholder ||
			'Select an option'
	);
</script>

<!-- Bind two-way value vào $formData — hiển thị label hiện tại trên trigger -->
<Select.Root type="single" {name} bind:value={$formData[name]}>
	<Select.Trigger>
		{activeLabel}
	</Select.Trigger>
	<Select.Content class="bg-background">
		{#each options as option (option.value)}
			<Select.Item value={option.value}>
				{option.text}
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
