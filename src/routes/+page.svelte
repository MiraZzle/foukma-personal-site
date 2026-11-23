<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import Seo from '$lib/components/Seo.svelte';
	import DuckField from '$lib/components/DuckField.svelte';
</script>

<Seo title="foukalma. | Matěj Foukal on leading teams, data and software" />

<div class="pointer-events-none absolute inset-x-0 top-0 h-[600px] overflow-hidden" aria-hidden="true">
	<div class="grid-fade absolute inset-0">
		<div class="grid-lines grid-drift absolute -inset-10"></div>
	</div>
</div>

<!-- The hero fills the page between header and footer; the ducks float behind its text. -->
<section class="relative isolate flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
	<div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
		<DuckField top={0} />
	</div>

	<h1 class="reveal text-foreground max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
		Welcome to the Contents of  <span class="font-[Playfair_Display] italic"> Matěj's </span> Mind
	</h1>
	<p class="reveal text-foreground mt-6 max-w-lg text-lg leading-relaxed" style="--reveal-delay: 80ms">
		Team lead, data engineer, and chaotic writer. I manage developers, build data systems, teach AI agents what data means, and write it all down.
	</p>
	<div class="reveal mt-10 flex flex-wrap items-center justify-center gap-4" style="--reveal-delay: 160ms">
		<Button href="/blog" class="group">
			Read the Blog
			<ArrowRight class="transition-transform duration-200 group-hover:translate-x-0.5" />
		</Button>
		<Button href="mailto:matej@get-nomox.com" variant="ghost">
			Contact Me
		</Button>
	</div>
</section>

<style>
	/* Fades the grid out towards the sides and the bottom. */
	.grid-fade {
		mask-image: radial-gradient(ellipse 70% 66% at 50% 0%, black 12%, transparent 74%);
		-webkit-mask-image: radial-gradient(ellipse 70% 66% at 50% 0%, black 12%, transparent 74%);
	}

	.grid-lines {
		--line: color-mix(in oklch, var(--muted-foreground) 36%, transparent);
		background-image:
			linear-gradient(to right, var(--line) 1px, transparent 1px),
			linear-gradient(to bottom, var(--line) 1px, transparent 1px);
		background-size: 40px 40px;
	}
</style>
