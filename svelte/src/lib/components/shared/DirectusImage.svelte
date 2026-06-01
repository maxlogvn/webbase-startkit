<script lang="ts">
	// -- DirectusImage: component ảnh từ Directus assets — tự động tạo URL và tối ưu loading
	import { getDirectusAssetURL } from '$lib/directus/directus-utils';
	import { type DirectusFile } from '$lib/types/directus-schema';

	interface Props {
		uuid: string | DirectusFile;
		width?: number | string;
		height?: number | string;
		alt: string;
		class?: string;
		[key: string]: any;
	}

	// Rest props cho phép truyền fill, sizes, loading, decoding từ ngoài
	let { uuid, width, height, alt, class: className, ...props }: Props = $props();
	// $derived vì src phụ thuộc uuid — tự động cập nhật khi uuid thay đổi
	let src = $derived(getDirectusAssetURL(uuid));
</script>

<img
	{src}
	{alt}
	{width}
	{height}
	class={className}
	{...props.fill ? { style: 'object-fit: cover; width: 100%; height: 100%;' } : {}}
	{...props.sizes ? { sizes: props.sizes } : {}}
	loading={props.loading || 'lazy'}
	decoding={props.decoding || 'async'}
	{...props}
/>
