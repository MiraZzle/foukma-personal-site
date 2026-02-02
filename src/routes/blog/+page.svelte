<svelte:head><title>foukalma. | blog</title></svelte:head>

<script lang="ts">
	import { searchPosts, allTags } from '$lib/posts';
	import { blogSearch } from '$lib/stores/blog-search.svelte';
	import BlogPostPreview from '$lib/components/BlogPostPreview.svelte';

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
			<BlogPostPreview {post} />
		{:else}
			<p class="text-muted-foreground text-sm">No posts found.</p>
		{/each}
	</div>
</section>
