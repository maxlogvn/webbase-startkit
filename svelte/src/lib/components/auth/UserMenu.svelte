<script lang="ts">
	import { fly } from 'svelte/transition';
	import { resolve } from '$app/paths';
	import type { AuthUser } from '$lib/server/session';

	let {
		user = null
	}: {
		user: AuthUser | null;
	} = $props();

	let open = $state(false);

	function toggle() {
		open = !open;
	}

	function close() {
		open = false;
	}
</script>

{#if user}
	<div class="relative">
		<button
			type="button"
			onclick={toggle}
			class="flex items-center gap-2 rounded-lg p-1 hover:bg-gray-100"
			aria-label="Menu nguoi dung"
		>
			{#if user.avatar}
				<img src={user.avatar} alt="" class="h-8 w-8 rounded-full object-cover" />
			{:else}
				<div
					class="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent"
				>
					{user.name.charAt(0).toUpperCase()}
				</div>
			{/if}
			<span class="hidden text-sm font-medium md:inline">{user.name}</span>
		</button>

		{#if open}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="fixed inset-0 z-40"
				onclick={close}
				onkeydown={(e) => e.key === 'Escape' && close()}
			></div>
			<div
				class="absolute right-0 z-50 mt-2 w-48 rounded-lg border bg-white shadow-lg"
				transition:fly={{ y: -8, duration: 150 }}
			>
				<a
					href={resolve('/account')}
					class="block px-4 py-2 text-sm hover:bg-gray-50"
					onclick={close}
				>
					Tai khoan
				</a>
				<hr class="my-1" />
				<a
					href={resolve('/auth/logout')}
					class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
					onclick={close}
				>
					Dang xuat
				</a>
			</div>
		{/if}
	</div>
{/if}
