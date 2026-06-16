<script lang="ts">
	import { resolve } from '$app/paths';
	import AuthButtons from '$lib/components/auth/AuthButtons.svelte';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);
</script>

<div class="mx-auto max-w-md px-4 py-16">
	<h1 class="mb-8 text-center text-3xl font-bold">Dang nhap</h1>

	<form method="POST" action="?/login" onsubmit={() => (loading = true)} class="space-y-4">
		{#if error}
			<div class="rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>
		{/if}

		<div>
			<label for="email" class="mb-1 block text-sm font-medium">Email</label>
			<input
				id="email"
				type="email"
				name="email"
				bind:value={email}
				required
				class="w-full rounded border p-2"
				placeholder="email@example.com"
			/>
		</div>

		<div>
			<label for="password" class="mb-1 block text-sm font-medium">Mat khau</label>
			<input
				id="password"
				type="password"
				name="password"
				bind:value={password}
				required
				class="w-full rounded border p-2"
				placeholder="••••••••"
			/>
		</div>

		<button
			type="submit"
			disabled={loading}
			class="w-full rounded bg-accent px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
		>
			{loading ? 'Dang xu ly...' : 'Dang nhap'}
		</button>
	</form>

	<div class="my-6 flex items-center gap-4 text-sm text-gray-500">
		<span class="flex-1 border-t"></span>
		<span>Hoac</span>
		<span class="flex-1 border-t"></span>
	</div>

	<AuthButtons
		providers={data.providers}
		directusAuthUrl={data.directusAuthUrl}
		redirectUrl={data.redirectUrl}
	/>

	<p class="mt-6 text-center text-sm text-gray-500">
		Chua co tai khoan?
		<a href={resolve('/auth/register')} class="text-accent hover:underline">Dang ky</a>
	</p>
</div>
