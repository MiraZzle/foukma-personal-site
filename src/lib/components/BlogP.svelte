<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<p class="text-muted-foreground my-4 text-base leading-relaxed">
	{@render children()}
</p>
