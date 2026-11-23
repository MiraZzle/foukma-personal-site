<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import Seo from '$lib/components/Seo.svelte';
	import CompanyLogo from '$lib/components/CompanyLogo.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { work, education, type Entry } from '$lib/experience';
</script>

<Seo
	title="foukalma. | work"
	description="Work and education: leading a development team at Second Foundation, co-founder of Nomox, previously Oracle Cloud Infrastructure. Charles University (Matfyz)."
	type="profile"
/>

{#snippet timeline(entries: Entry[])}
	<ol class="mt-6 flex flex-col gap-10">
		{#each entries as entry, i}
			<li
				use:reveal
				style="--reveal-delay: {Math.min(i, 4) * 70}ms"
				class="reveal before:bg-border relative pl-14 before:absolute before:top-12 before:-bottom-8 before:left-5 before:w-px last:before:hidden"
			>
				<CompanyLogo name={entry.company} src={entry.logo} fit={entry.logoFit} class="absolute top-0 left-0" />
				<p class="text-muted-foreground text-xs tracking-wide uppercase">{entry.period}</p>
				<h3 class="text-foreground mt-1 text-base font-medium">{entry.role}</h3>
				<p class="text-foreground/80 mt-0.5 text-sm">
					{#if entry.url}
						<a
							href={entry.url}
							target="_blank"
							rel="noopener noreferrer"
							class="hover:text-foreground underline-offset-4 hover:underline"
						>
							{entry.org}
						</a>
					{:else}
						{entry.org}
					{/if}
				</p>
				{#if entry.highlights?.length}
					<ul class="mt-2.5 flex flex-wrap gap-1.5">
						{#each entry.highlights as highlight}
							<li class="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs">{highlight}</li>
						{/each}
					</ul>
				{/if}
				<p class="text-muted-foreground mt-3 text-sm leading-relaxed">{entry.description}</p>
			</li>
		{/each}
	</ol>
{/snippet}

<section class="mx-auto w-full max-w-3xl px-6 py-16">
	<h1 class="reveal text-foreground text-3xl font-bold tracking-tight">Experience</h1>
	<p class="reveal text-muted-foreground mt-4 max-w-2xl text-base leading-relaxed" style="--reveal-delay: 60ms">
		I manage a development team at Second Foundation. Before that I led five engineers at Nomox, a startup
		that grew out of a hackathon, and built cloud services at Oracle.
	</p>

	<h2 class="text-foreground mt-10 text-xl font-semibold">Work</h2>
	{@render timeline(work)}

	<Separator class="my-10" />

	<h2 class="text-foreground text-xl font-semibold">Education</h2>
	{@render timeline(education)}
</section>
