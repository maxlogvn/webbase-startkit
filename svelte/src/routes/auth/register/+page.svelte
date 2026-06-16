<script lang="ts">
	import { resolve } from '$app/paths';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);
</script>

<div class="mx-auto max-w-md px-4 py-16">
	<h1 class="mb-8 text-center text-3xl font-bold">Dang ky</h1>

	<form method="POST" action="?/register" onsubmit={() => (loading = true)} class="space-y-4">
		{#if error}
			<div class="rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>
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
				placeholder="Nguyen Van A"
			/>
		</div>

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
				minlength={8}
				class="w-full rounded border p-2"
				placeholder="8+ ky tu"
			/>
		</div>

		<button
			type="submit"
			disabled={loading}
			class="w-full rounded bg-accent px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
		>
			{loading ? 'Dang xu ly...' : 'Dang ky'}
		</button>
	</form>

	<p class="mt-6 text-center text-sm text-gray-500">
		Da co tai khoan?
		<a href={resolve('/auth/login')} class="text-accent hover:underline">Dang nhap</a>
	</p>
</div>
