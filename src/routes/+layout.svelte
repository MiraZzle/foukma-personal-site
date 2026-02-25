<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "WebSite",
		"name": "foukalma",
		"url": "https://www.foukalma.cz",
		"potentialAction": {
			"@type": "SearchAction",
			"target": "https://www.foukalma.cz/blog?q={search_term_string}",
			"query-input": "required name=search_term_string"
		}
	})}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "ItemList",
		"name": "Site Navigation",
		"itemListElement": [
			{ "@type": "SiteLinksSearchBox", "url": "https://www.foukalma.cz" },
			{ "@type": "ListItem", "position": 1, "name": "Blog", "url": "https://www.foukalma.cz/blog" },
			{ "@type": "ListItem", "position": 2, "name": "About", "url": "https://www.foukalma.cz/about" },
			{ "@type": "ListItem", "position": 3, "name": "Experience", "url": "https://www.foukalma.cz/experience" }
		]
	})}</script>`}
</svelte:head>

<div class="bg-background relative flex min-h-svh flex-col">
	<Header />
	<main class="flex flex-1 flex-col">
		{@render children()}
	</main>
	<Footer />
</div>
