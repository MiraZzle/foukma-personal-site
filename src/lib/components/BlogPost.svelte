<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title, date, tags = [], readingTime, children }: { title: string; date: string; tags?: string[]; readingTime?: string; children: Snippet } = $props();
</script>

<section class="mx-auto w-full max-w-3xl px-6 py-16">
	<a href="/blog" class="text-muted-foreground hover:text-foreground mb-8 inline-block text-sm">&larr; Back to Blog</a>
	<div class="text-muted-foreground flex items-center gap-2 text-sm">
		<time>{date}</time>
		{#if readingTime}
			<span>&middot;</span>
			<span>{readingTime}</span>
		{/if}
	</div>
	<h1 class="text-foreground mt-2 text-3xl font-bold tracking-tight">{title}</h1>

	{#if tags.length > 0}
		<div class="mt-3 flex flex-wrap gap-2">
			{#each tags as tag}
				<span class="bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 text-xs">{tag}</span>
			{/each}
		</div>
	{/if}

	<article class="prose dark:prose-invert mt-8 max-w-none">
		{@render children()}
	</article>
</section>
