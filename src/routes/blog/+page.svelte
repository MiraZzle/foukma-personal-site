<script lang="ts">
	import { searchPosts, allTags } from '$lib/posts';
	import { blogSearch } from '$lib/stores/blog-search.svelte';

	let selectedTags = $state<string[]>([]);

	let filtered = $derived(searchPosts(blogSearch.query, selectedTags));

	function toggleTag(tag: string) {
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter((t) => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
	}
</script>

<section class="mx-auto w-full max-w-3xl px-6 py-16">
	<h1 class="text-foreground text-3xl font-bold tracking-tight">Posts</h1>

	{#if allTags.length > 0}
		<div class="mt-6 flex flex-wrap gap-2">
			{#each allTags as tag}
				<button
					onclick={() => toggleTag(tag)}
					class="rounded-md px-2.5 py-1 text-xs font-medium transition-colors {selectedTags.includes(tag)
						? 'bg-primary text-primary-foreground'
						: 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}"
				>
					{tag}
				</button>
			{/each}
		</div>
	{/if}

	<div class="mt-6 flex flex-col divide-y divide-border">
		{#each filtered as post}
			<a
				href="/blog/{post.slug}"
				class="group flex items-center gap-4 py-3 transition-colors"
			>
				<time class="text-muted-foreground w-24 flex-shrink-0 text-xs tabular-nums">{post.date}</time>
				<h2 class="text-foreground group-hover:text-primary min-w-0 flex-1 truncate text-sm font-medium transition-colors">
					{post.title}
				</h2>
				{#if post.tags.length > 0}
					<div class="hidden flex-shrink-0 gap-1.5 sm:flex">
						{#each post.tags as tag}
							<span class="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs">{tag}</span>
						{/each}
					</div>
				{/if}
			</a>
		{:else}
			<p class="text-muted-foreground text-sm">No posts found.</p>
		{/each}
	</div>
</section>
