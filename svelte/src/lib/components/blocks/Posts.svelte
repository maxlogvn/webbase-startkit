<script lang="ts">
	// -- Block Posts: hiển thị danh sách blog post dạng grid với phân trang client-side
	// Fetch thêm posts từ Directus khi người dùng chuyển trang — không cần load lại trang
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { fetchPaginatedPosts, fetchTotalPostCount } from '$lib/directus/fetchers';
	import * as Pagination from '$lib/components/ui/pagination/index.js';

	import setAttr from '$lib/directus/visualEditing';
	import type { Post } from '$lib/types/directus-schema';
	import DirectusImage from '../shared/DirectusImage.svelte';
	import Headline from '../ui/Headline.svelte';
	import Tagline from '../ui/Tagline.svelte';
	import { scale } from 'svelte/transition';

	interface PostsProps {
		data: {
			tagline: string;
			headline?: string;
			posts: Post[];
			limit: number;
			id: string;
		};
	}

	// -- Props: $props() chụp snapshot lúc mount — posts từ Directus SSR
	let { data }: PostsProps = $props();
	let { tagline, headline, posts, limit, id } = $derived(data);
	// Lấy trang hiện tại từ URL search params, fallback về 1
	let initialPage = $state(Number(page.url.searchParams.get('page')) || 1);

	let currentPage = $state(initialPage);
	// $derived vì perPage phụ thuộc limit từ props
	let perPage = $derived(limit || 6);
	// $state vì paginatedPosts thay đổi qua fetch bất đồng bộ — không thể dùng $derived
	// svelte-ignore state_referenced_locally
	let paginatedPosts = $state<Post[]>(currentPage === 1 ? posts || [] : []);
	let totalPages = $state(0);
	let totalCount = $state(0);

	// Fetch tổng số post để tính số trang — chỉ chạy một lần khi mount
	const fetchTotalPages = async () => {
		try {
			totalCount = await fetchTotalPostCount();
			totalPages = Math.ceil(totalCount / perPage);
		} catch (error) {
			console.error('Error fetching total post count:', error);
		}
	};
	// $effect rỗng dependency = chạy một lần sau mount (componentDidMount)
	$effect(() => {
		fetchTotalPages();
	});

	// Fetch posts cho trang hiện tại — dùng posts SSR ở trang 1 để tránh fetch thừa
	const fetchPosts = async (currentPage: number) => {
		try {
			// Trang 1: dùng posts đã có từ server, không fetch lại
			if (currentPage === 1) {
				paginatedPosts = posts || [];
				return;
			}

			// Các trang sau: fetch từ Directus client-side
			paginatedPosts = await fetchPaginatedPosts(perPage, currentPage);
		} catch (error) {
			console.error('Error fetching paginated posts:', error);
			paginatedPosts = [];
		}
	};
	// $effect theo dõi currentPage — tự động fetch khi đổi trang
	$effect(() => {
		fetchPosts(currentPage);
	});

	// Xử lý khi người dùng click pagination — validate page trong khoảng hợp lệ
	const handlePageChange = (page: number) => {
		console.log('handlePageChange', page);
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
			fetchPosts(currentPage);
		}
	};
</script>

<div>
	<Tagline
		{tagline}
		data-directus={setAttr({
			collection: 'block_posts',
			item: id,
			fields: 'tagline',
			mode: 'popover'
		})}
	/>
	{#if headline}
		<Headline
			{headline}
			data-directus={setAttr({
				collection: 'block_posts',
				item: id,
				fields: 'headline',
				mode: 'popover'
			})}
		/>
	{/if}

	<div
		class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3"
		data-directus={setAttr({
			collection: 'block_posts',
			item: id,
			fields: ['collection', 'limit'],
			mode: 'popover'
		})}
	>
		{#each paginatedPosts as post (post.id)}
			<a
				in:scale={{ duration: 100 }}
				href={post.slug ? resolve('/blog/[slug]' as any, { slug: post.slug }) : '#'}
				class="group block overflow-hidden rounded-lg"
			>
				<div class="relative h-64 w-full overflow-hidden rounded-lg">
					{#if post.image}
						<DirectusImage
							uuid={post.image}
							alt={post.title}
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
							class="h-auto w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-110"
						/>
					{/if}
				</div>

				<div class="p-4">
					<h3 class="font-heading group-hover:text-accent text-xl transition-colors duration-300">
						{post.title}
					</h3>
					<p class="text-foreground mt-2 text-sm">{post.description}</p>
				</div>
			</a>
		{/each}
	</div>

	<!-- Pagination -->
	{#if totalPages > 1}
		<Pagination.Root count={totalCount} perPage={limit} onPageChange={handlePageChange}>
			{#snippet children({ pages, currentPage })}
				<Pagination.Content>
					<!-- <Pagination.Item>
						<Pagination.PrevButton />
					</Pagination.Item> -->
					{#each pages as page (page.key)}
						{#if page.type === 'ellipsis'}
							<Pagination.Item>
								<Pagination.Ellipsis />
							</Pagination.Item>
						{:else}
							<Pagination.Item>
								<Pagination.Link {page} isActive={currentPage === page.value}>
									{page.value}
								</Pagination.Link>
							</Pagination.Item>
						{/if}
					{/each}
					<!-- <Pagination.Item>
						<Pagination.NextButton />
					</Pagination.Item> -->
				</Pagination.Content>
			{/snippet}
		</Pagination.Root>
	{/if}
</div>
