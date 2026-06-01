<script lang="ts">
	// -- SearchModal: command palette tìm kiếm nội dung — gọi API /api/search với debounce
	// Hỗ trợ phím tắt Ctrl+K / Cmd+K, hiển thị kết quả trong shadcn command dialog
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';

	import { Search } from '@lucide/svelte';
	import * as Command from '$lib/components/ui/command/index.js';

	import { debounce } from '$lib/utils';
	import Badge from './badge/badge.svelte';
	import { goto } from '$app/navigation';

	// $state vì đây là UI state nội bộ
	let open = $state(false);
	let search = $state('');
	let searched = $state(false);
	let loading = $state(false);
	let results = $state<SearchResult[]>([]);

	type SearchResult = {
		id: string;
		title: string;
		description: string;
		type: string;
		link: string;
	};

	// Phím tắt Ctrl+K / Cmd+K — toggle search dialog
	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = !open;
		}
	};

	// Reset state khi đóng dialog — tránh hiển thị kết quả cũ
	$effect(() => {
		if (!open) {
			searched = false;
			loading = false;
		}
	});

	// Fetch kết quả tìm kiếm từ API — yêu cầu tối thiểu 3 ký tự
	const fetchResults = async (search: string) => {
		if (search.length < 3 || !open) {
			results = [];
			return;
		}

		loading = true;

		try {
			const res = await fetch(`/api/search?search=${encodeURIComponent(search)}`);
			if (!res.ok) throw new Error('Failed to fetch results');
			const data: SearchResult[] = await res.json();
			results = data.filter((r) => r.link);
		} catch (error) {
			console.error('Error fetching search results:', error);
			results = [];
		} finally {
			loading = false;
		}
	};
	// Debounce 300ms để tránh gọi API quá nhiều khi gõ
	const debouncedFetchResults = debounce(fetchResults, 300);

	// $effect theo dõi search — tự động fetch khi search thay đổi
	$effect(() => {
		debouncedFetchResults(search);
	});

	// Chọn kết quả -> điều hướng và đóng dialog
	const handleSelect = (result: SearchResult) => {
		goto(result.link);
		open = false;
	};
</script>

<svelte:document onkeydown={handleKeydown} />

<div class="max-w-full sm:max-w-[540px]">
	<Button variant="ghost" size="icon" aria-label="Search" onclick={() => (open = true)}>
		<Search class="size-5" />
	</Button>

	<Command.Dialog bind:open shouldFilter={false}>
		<Command.Input
			placeholder="Type a command or search..."
			bind:value={search}
			class="m-2 p-4 text-base leading-normal focus:outline-none"
		/>
		<Command.List>
			{#if !loading && !searched}
				<Command.Empty>No results found.</Command.Empty>
			{/if}

			{#if loading}
				<Command.Empty class="py-2 text-center text-sm">Loading...</Command.Empty>
			{/if}

			{#if !loading && searched && results.length === 0}
				<Command.Empty class="py-2 text-center text-sm">No results found.</Command.Empty>
			{/if}

			{#if results.length > 0}
				<Command.Group heading="Search Results">
					{#each results as result}
						<Command.Item
							class="flex items-start gap-4 px-2 py-3"
							onSelect={() => handleSelect(result)}
						>
							<Badge variant="default">{result.type}</Badge>
							<div class="ml-2 w-full">
								<p class="text-base font-medium">{result.title}</p>
								<p class="mt-1 line-clamp-2 text-sm">{result.description}</p>
							</div>
						</Command.Item>
					{/each}
				</Command.Group>
			{/if}
		</Command.List>
	</Command.Dialog>
</div>
