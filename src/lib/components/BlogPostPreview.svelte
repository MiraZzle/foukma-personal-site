<script lang="ts">
	import type { Post } from '$lib/posts';

	let { post }: { post: Post } = $props();
</script>

<a
	href="/blog/{post.slug}"
	class="group -mx-3 flex items-center gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-secondary/50"
>
	<time datetime={post.date} class="text-muted-foreground w-24 flex-shrink-0 text-xs tabular-nums">{post.date}</time>
	<h2 class="text-foreground group-hover:text-primary min-w-0 flex-1 truncate text-sm font-medium transition-colors">
		{post.title}
	</h2>
	{#if post.draft}
		<span class="border-border text-muted-foreground flex-shrink-0 rounded-full border border-dashed px-2 py-0.5 text-xs">draft</span>
	{/if}
	{#if post.tags.length > 0}
		<div class="hidden flex-shrink-0 gap-1.5 sm:flex">
			{#each post.tags as tag}
				<span class="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs">{tag}</span>
			{/each}
		</div>
	{/if}
</a>
