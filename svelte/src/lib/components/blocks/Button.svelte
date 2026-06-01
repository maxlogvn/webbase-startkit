<script lang="ts">
	// -- Button đa năng: hỗ trợ icon, nhiều loại link, và submit form
	// Dùng shadcn Button làm nền tảng, thêm khả năng điều hướng nội bộ/ngoài
	import { Button as ShadcnButton, buttonVariants } from '../ui/button';
	import { resolve } from '$app/paths';
	import { Icon as Icontype, ArrowRight, Plus } from '@lucide/svelte';
	import { cn } from '../../utils';

	export interface ButtonProps {
		id: string;
		label?: string | null;
		variant?: string | null;
		url?: string | null;
		type?: 'page' | 'post' | 'url' | 'submit' | null;
		page?: { permalink: string | null };
		post?: { slug: string | null };
		size?: 'default' | 'sm' | 'lg' | 'icon';
		icon?: 'arrow' | 'plus';
		customIcon?: typeof Icontype;
		iconPosition?: 'left' | 'right';
		class?: string;
		onClick?: () => void;
		disabled?: boolean;
		block?: boolean;
	}

	// Destructure props với giá trị mặc định — giữ const vì $props() chụp snapshot lúc mount
	const {
		label,
		variant,
		url,
		type,
		page,
		post,
		size = 'default',
		icon,
		customIcon,
		iconPosition = 'left',
		class: className,
		onClick,
		disabled = false,
		block = false
	}: ButtonProps = $props();

	// Map tên icon string sang component Lucide
	const icons: Record<string, typeof Icontype> = {
		arrow: ArrowRight,
		plus: Plus
	};

	// $derived vì icon chỉ thay đổi khi customIcon/icon thay đổi
	const Icon = $derived(customIcon || (icon ? icons[icon] : null));

	// $derived.by vì có logic rẽ nhánh — tính href dựa trên type
	const href = $derived.by((): string | undefined => {
		if (type === 'page' && page?.permalink) return page.permalink;
		if (type === 'post' && post?.slug) return `/blog/${post.slug}`;
		return url || undefined;
	});

	// Gom class variant + custom + trạng thái disabled/block
	const buttonClasses = $derived.by(() =>
		cn(
			buttonVariants({ variant: variant as any, size }),
			className,
			disabled && 'opacity-50 cursor-not-allowed',
			block && 'w-full'
		)
	);
</script>

{#snippet content()}
	<!-- Snippet nội dung button: icon trái + label + icon phải -->
	<span class="flex items-center space-x-2">
		{#if icon && iconPosition === 'left' && Icon}
			<Icon class="size-4 shrink-0" />
		{/if}

		{#if label}
			<span>{label}</span>
		{/if}

		{#if icon && iconPosition === 'right' && Icon}
			<Icon class="size-4 shrink-0" />
		{/if}
	</span>
{/snippet}

<!-- Có href -> link nội bộ hoặc external; không có href -> button submit -->
{#if href}
	<!-- TODO CHECK IF ASCHILD WORKS -->
	<ShadcnButton variant={variant as any} {size} class={buttonClasses} {disabled} onclick={onClick}>
		{#if href.startsWith('/')}
			<!-- Link nội bộ: dùng resolve để chuẩn hóa đường dẫn -->
			<a href={resolve(href as any)}>{@render content()}</a>
		{:else}
			<!-- Link ngoài: mở tab mới với rel bảo mật -->
			<a {href} target="_blank" rel="external noopener noreferrer">
				{@render content()}
			</a>
		{/if}
	</ShadcnButton>
{:else}
	<!-- Submit button dùng trong Form block — type="submit" gửi form -->
	<ShadcnButton type="submit" variant={variant as any} {size} class={buttonClasses} {disabled}>
		{@render content()}
	</ShadcnButton>
{/if}
