<script lang="ts">
	// -- Block RichText: hiển thị nội dung văn bản có định dạng (HTML từ Directus WYSIWYG)
	// Hỗ trợ tagline, headline, và content với alignment linh hoạt
	import setAttr from '$lib/directus/visualEditing';
	import { cn } from '$lib/utils';
	import Headline from '../ui/Headline.svelte';
	import Tagline from '../ui/Tagline.svelte';
	import Text from '../ui/Text.svelte';

	interface RichTextProps {
		data: {
			id: string;
			headline?: string;
			content: string;
			alignment?: 'left' | 'center' | 'right';
			tagline?: string;
		};
		class?: string;
	}

	// Rest props cho phép truyền thêm class từ ngoài vào container
	let { data, class: className }: RichTextProps = $props();

	// $derived vì các field phụ thuộc data — mặc định alignment = 'left'
	const { headline, content, alignment = 'left', tagline, id } = $derived(data);
</script>

<div
	class={cn(
		'mx-auto max-w-[600px] space-y-6',
		// Alignment control: căn trái/mặc định, căn giữa, căn phải
		alignment === 'center' ? 'text-center' : alignment === 'right' ? 'text-right' : 'text-left',
		className
	)}
>
	{#if tagline}
		<Tagline
			{tagline}
			data-directus={setAttr({
				collection: 'block_richtext',
				item: id,
				fields: 'tagline',
				mode: 'popover'
			})}
		/>
	{/if}
	{#if headline}
		<Headline
			{headline}
			data-directus={setAttr({
				collection: 'block_richtext',
				item: id,
				fields: 'headline',
				mode: 'popover'
			})}
		/>
	{/if}
	{#if content}
		<!-- Text component render HTML từ Directus WYSIWYG — dùng drawer mode để edit dễ hơn -->
		<Text
			{content}
			data-directus={setAttr({
				collection: 'block_richtext',
				item: id,
				fields: 'content',
				mode: 'drawer'
			})}
		/>
	{/if}
</div>
