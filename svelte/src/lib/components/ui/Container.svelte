<script lang="ts">
	// -- Container: wrapper có chiều rộng tối đa, hỗ trợ đổi semantic element qua prop `as`
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type SemanticElement =
		| 'div'
		| 'section'
		| 'main'
		| 'article'
		| 'aside'
		| 'nav'
		| 'header'
		| 'footer'
		| 'form';

	interface ContainerProps {
		class?: string;
		as?: SemanticElement;
		children: Snippet;
		role?: string;
	}

	// Dùng svelte:element để linh hoạt thay đổi tag — mặc định là div
	const { class: className, as: Component = 'div', children }: ContainerProps = $props();
</script>

<svelte:element this={Component} class={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-16', className)}
	>{@render children()}</svelte:element
>
