<script lang="ts">
	// -- Nhóm button: render nhiều Button cạnh nhau trong container flex
	import { cn } from '$lib/utils';
	import Button, { type ButtonProps } from './Button.svelte';

	interface ButtonGroupProps {
		buttons: Array<ButtonProps>;
		[key: string]: any;
	}

	// Rest props cho phép truyền thêm class, style vào container
	let { buttons, ...props }: ButtonGroupProps = $props();

	// $derived vì class chỉ thay đổi khi props.class thay đổi
	const containerClasses = $derived(cn('flex gap-4', props.class));
</script>

<!-- Chỉ render khi có button — tránh div rỗng -->
{#if buttons && buttons.length > 0}
	<div class={containerClasses}>
		{#each buttons as button, i (i)}
			<Button {...button} />
		{/each}
	</div>
{/if}
