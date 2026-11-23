<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import Seo from '$lib/components/Seo.svelte';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import BlogPostPreview from '$lib/components/BlogPostPreview.svelte';
	import { latestPosts } from '$lib/posts';
	import { SITE, absoluteUrl } from '$lib/site';

	let {
		title,
		date,
		slug,
		summary,
		tags = [],
		readingTime,
		draft = false,
		children
	}: {
		title: string;
		date: string;
		slug?: string;
		summary?: string;
		tags?: string[];
		readingTime?: string;
		draft?: boolean;
		children: Snippet;
	} = $props();

	const url = $derived(absoluteUrl(page.url.pathname));
	const morePosts = $derived(latestPosts(3, slug));
</script>

<Seo
	title="{title} | foukalma."
	description={summary}
	type="article"
	publishedTime={date}
	{tags}
	noindex={draft}
/>

{#if !draft}
	<JsonLd
		data={{
			'@context': 'https://schema.org',
			'@type': 'BlogPosting',
			headline: title,
			description: summary,
			datePublished: date,
			dateModified: date,
			url,
			mainEntityOfPage: url,
			image: absoluteUrl(SITE.image),
			keywords: tags.join(', '),
			inLanguage: 'en',
			author: { '@type': 'Person', '@id': `${SITE.url}/#person`, name: SITE.author, url: absoluteUrl('/about') },
			publisher: { '@id': `${SITE.url}/#person` }
		}}
	/>
{/if}

<div class="reading-progress" aria-hidden="true"></div>

<section class="mx-auto w-full max-w-3xl px-6 py-16">
	<a href="/blog" class="text-muted-foreground hover:text-foreground mb-8 inline-block text-sm">&larr; Back to Blog</a>

	{#if draft}
		<p class="border-border text-muted-foreground mb-6 rounded-lg border border-dashed px-4 py-3 text-sm">
			Draft. This post is still being written, so it is hidden from the blog list, the sitemap and search engines.
		</p>
	{/if}

	<div class="text-muted-foreground flex items-center gap-2 text-sm">
		<time datetime={date}>{date}</time>
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

	{#if morePosts.length > 0}
		<aside class="border-border mt-16 border-t pt-8" aria-labelledby="more-posts">
			<h2 id="more-posts" class="text-foreground text-sm font-semibold uppercase tracking-wider">Keep reading</h2>
			<div class="divide-border mt-3 flex flex-col divide-y">
				{#each morePosts as post (post.slug)}
					<BlogPostPreview {post} />
				{/each}
			</div>
		</aside>
	{/if}
</section>

<style>
	/* Reading progress bar, driven by scroll position in CSS. Browsers without scroll timelines never show it. */
	.reading-progress {
		position: fixed;
		inset: 0 0 auto 0;
		z-index: 60;
		display: none;
		height: 2px;
		background: var(--foreground);
		transform-origin: 0 50%;
		scale: 0 1;
	}

	@supports (animation-timeline: scroll()) {
		.reading-progress {
			display: block;
			animation: reading-progress linear both;
			animation-timeline: scroll(root block);
		}
	}

	@keyframes reading-progress {
		to {
			scale: 1 1;
		}
	}
</style>
