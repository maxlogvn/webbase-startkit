<script lang="ts">
	import { resolve } from '$app/paths';

	let {
		message = 'Vui long dang nhap de tiep tuc'
	}: {
		message?: string;
	} = $props();
</script>

<div class="rounded-lg border bg-gray-50 p-8 text-center">
	<p class="mb-4 text-gray-600">{message}</p>
	<a
		href={resolve('/auth/login')}
		class="inline-block rounded bg-accent px-6 py-2 text-white hover:opacity-90"
	>
		Dang nhap
	</a>
</div>
