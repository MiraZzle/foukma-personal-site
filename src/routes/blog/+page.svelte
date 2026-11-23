<script lang="ts">
	import { posts, searchPosts, allTags } from '$lib/posts';
	import { blogSearch } from '$lib/stores/blog-search.svelte';
	import BlogPostPreview from '$lib/components/BlogPostPreview.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import { SITE, absoluteUrl } from '$lib/site';

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

<Seo
	title="foukalma. | blog"
	description="All posts by Matěj Foukal: data engineering, open data, software, and thoughts on building a career in tech."
/>

<JsonLd
	data={{
		'@context': 'https://schema.org',
		'@type': 'Blog',
		'@id': `${absoluteUrl('/blog')}#blog`,
		name: `${SITE.name} blog`,
		url: absoluteUrl('/blog'),
		author: { '@id': `${SITE.url}/#person` },
		blogPost: posts
			.filter((post) => !post.draft)
			.map((post) => ({
				'@type': 'BlogPosting',
				headline: post.title,
				description: post.summary,
				datePublished: post.date,
				url: absoluteUrl(`/blog/${post.slug}`)
			}))
	}}
/>

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
