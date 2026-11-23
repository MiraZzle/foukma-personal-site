<script lang="ts">
	import { page } from '$app/state';
	import { SITE, absoluteUrl } from '$lib/site';

	let {
		title,
		description = SITE.description,
		type = 'website',
		image = SITE.image,
		publishedTime,
		tags = [],
		noindex = false
	}: {
		title: string;
		description?: string;
		type?: 'website' | 'article' | 'profile';
		image?: string;
		publishedTime?: string;
		tags?: string[];
		noindex?: boolean;
	} = $props();

	// Always the www origin, whatever host served the request.
	const canonical = $derived(absoluteUrl(page.url.pathname));
	const imageUrl = $derived(absoluteUrl(image));
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="author" content={SITE.author} />
	<link rel="canonical" href={canonical} />
	{#if noindex}
		<meta name="robots" content="noindex" />
	{/if}

	<meta property="og:site_name" content={SITE.name} />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:locale" content="en_US" />
	{#if type === 'article'}
		{#if publishedTime}
			<meta property="article:published_time" content={publishedTime} />
		{/if}
		<meta property="article:author" content={SITE.author} />
		{#each tags as tag}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
</svelte:head>
