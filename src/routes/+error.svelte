<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import DuckField, { type Duck } from '$lib/components/DuckField.svelte';

	const missing = $derived(page.status === 404);
	const heading = $derived(missing ? 'This page has floated away' : 'Something went wrong');

	// One duck, in the middle of its box.
	const loneDuck = (width: number, height: number): Duck[] => [
		{ x: 0.5, y: height / 2, r: Math.min(84, width * 0.22), facing: 'right', seed: 0.31, hat: true }
	];
</script>

<svelte:head>
	<title>{missing ? 'Page not found' : 'Error'} | foukalma.</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
	<div class="relative h-56 w-full max-w-md" aria-hidden="true">
		<DuckField layout={loneDuck} top={0} />
	</div>
	<p class="text-muted-foreground mt-2 text-xs font-semibold tracking-[0.2em] uppercase">Error {page.status}</p>
	<h1 class="text-foreground mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h1>
	<p class="text-muted-foreground mt-4 max-w-md text-base leading-relaxed">
		{#if missing}
			The duck looked everywhere. Whatever was at this address has moved, or was never here.
		{:else}
			{page.error?.message ?? 'An unexpected error occurred.'}
		{/if}
	</p>
	<div class="mt-8 flex flex-wrap items-center justify-center gap-4">
		<Button href="/">Back home</Button>
		<Button href="/blog" variant="ghost">Read the blog</Button>
	</div>
</section>
