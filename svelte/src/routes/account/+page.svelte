<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	let name = $state(data.user?.first_name || '');
	let email = $state(data.user?.email || '');
	let success = $state(false);

	function onSuccess() {
		success = true;
		setTimeout(() => (success = false), 3000);
	}
</script>

<div class="mx-auto max-w-md px-4 py-16">
	<h1 class="mb-8 text-center text-3xl font-bold">Tai khoan</h1>

	<div class="mb-6 flex justify-center">
		{#if data.user?.avatar}
			<img src={data.user.avatar} alt="Avatar" class="h-20 w-20 rounded-full object-cover" />
		{:else}
			<div
				class="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-2xl font-bold text-accent"
			>
				{(data.user?.first_name || 'U').charAt(0).toUpperCase()}
			</div>
		{/if}
	</div>

	<form method="POST" action="?/update" onsubmit={onSuccess} class="space-y-4">
		{#if success}
			<div class="rounded bg-green-50 p-3 text-sm text-green-600">Cap nhat thanh cong</div>
		{/if}

		<div>
			<label for="name" class="mb-1 block text-sm font-medium">Ho ten</label>
			<input
				id="name"
				type="text"
				name="name"
				bind:value={name}
				required
				class="w-full rounded border p-2"
			/>
		</div>

		<div>
			<label for="email" class="mb-1 block text-sm font-medium">Email</label>
			<input
				id="email"
				type="email"
				name="email"
				value={email}
				disabled
				class="w-full cursor-not-allowed rounded border bg-gray-100 p-2 text-gray-500"
			/>
			<p class="mt-1 text-xs text-gray-400">Email khong the thay doi</p>
		</div>

		<button type="submit" class="w-full rounded bg-accent px-4 py-2 text-white hover:opacity-90">
			Luu
		</button>
	</form>
</div>
