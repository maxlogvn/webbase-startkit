<script lang="ts">
	// -- Bộ định tuyến block: ánh xạ tên collection từ Directus sang component Svelte
	import Hero from '$lib/components/blocks/Hero.svelte';
	import RichText from '$lib/components/blocks/RichText.svelte';
	import Gallery from '$lib/components/blocks/Gallery.svelte';
	import Pricing from '$lib/components/blocks/Pricing.svelte';
	import Posts from '$lib/components/blocks/Posts.svelte';
	import Form from '$lib/components/blocks/Form.svelte';
	interface BaseBlockProps {
		block: {
			collection: string;
			item: any;
			id: string;
		};
	}

	// Nhận block object từ PageBuilder, collection là tên collection trong Directus
	let { block }: BaseBlockProps = $props();

	// Map tên collection -> component tương ứng
	// Phải đồng bộ với tên collection trong Directus schema
	const components = {
		block_hero: Hero,
		block_richtext: RichText,
		block_gallery: Gallery,
		block_pricing: Pricing,
		block_posts: Posts,
		block_form: Form
	} as const;

	// $derived vì component chỉ thay đổi khi collection thay đổi
	const Component = $derived(components[block.collection as keyof typeof components]);
</script>

{#if Component}
	<!-- Render đúng component dựa trên collection, truyền item.data làm prop -->
	<Component data={block.item} />
{:else}
	<!-- Fallback hiển thị tên collection nếu chưa có component tương ứng -->
	<div>
		<h1>Block not found {block.collection}</h1>
	</div>
{/if}
