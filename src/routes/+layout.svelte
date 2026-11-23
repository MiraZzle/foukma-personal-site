<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import DuckRain from '$lib/components/DuckRain.svelte';
	import { SITE, absoluteUrl } from '$lib/site';
	import { work } from '$lib/experience';
	import { onNavigate } from '$app/navigation';

	let { children } = $props();

	const personId = `${SITE.url}/#person`;
	const currentRoles = work.filter((entry) => entry.current);

	// Cross-fade between pages where the browser supports view transitions.
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="alternate" type="application/rss+xml" title="{SITE.name} blog" href="/rss.xml" />
</svelte:head>

<JsonLd
	data={{
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': `${SITE.url}/#website`,
				name: SITE.name,
				url: SITE.url,
				description: SITE.description,
				inLanguage: 'en',
				publisher: { '@id': personId }
			},
			{
				'@type': 'Person',
				'@id': personId,
				name: SITE.author,
				url: absoluteUrl('/about'),
				image: absoluteUrl(SITE.image),
				jobTitle: currentRoles[0]?.role,
				worksFor: currentRoles.map((entry) => ({
					'@type': 'Organization',
					name: entry.company,
					url: entry.url
				})),
				alumniOf: {
					'@type': 'CollegeOrUniversity',
					name: 'Charles University',
					url: 'https://cuni.cz/'
				},
				knowsAbout: ['Engineering management', 'Data engineering', 'Open data', 'Distributed systems'],
				sameAs: SITE.sameAs
			}
		]
	}}
/>

<div class="bg-background relative flex min-h-svh flex-col">
	<Header />
	<main class="flex flex-1 flex-col">
		{@render children()}
	</main>
	<Footer />
</div>

<DuckRain />
