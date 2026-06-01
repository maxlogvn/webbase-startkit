<script lang="ts">
	// -- Error page: hiển thị mã lỗi và message — SvelteKit tự động render khi có error()
	import { page } from '$app/state';
</script>

<div class="flex flex-col items-center justify-center">
	<h1>{page.status}</h1>
	<p>{page.error?.message}</p>
</div>
