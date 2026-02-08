<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<h2 class="text-foreground mt-10 mb-4 text-2xl font-semibold tracking-tight">
	{@render children()}
</h2>
