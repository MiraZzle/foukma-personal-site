<script lang="ts">
	import { Button } from '$lib/components/ui/button';
</script>

<svelte:head><title>foukalma.</title></svelte:head>


<div
	class="pointer-events-none absolute inset-x-0 top-0 h-[600px] overflow-hidden"
	aria-hidden="true"
>
	<div
		class="absolute inset-0"
		style="
			background-image:
				linear-gradient(to right, color-mix(in oklch, var(--muted-foreground) 24%, transparent) 1px, transparent 1px),
				linear-gradient(to bottom, color-mix(in oklch, var(--muted-foreground) 24%, transparent) 1px, transparent 1px);
			background-size: 40px 40px;
			mask-image: radial-gradient(ellipse 60% 60% at 50% 0%, black 0%, transparent 70%);
			-webkit-mask-image: radial-gradient(ellipse 60% 60% at 50% 0%, black 0%, transparent 70%);
		"
	></div>
</div>

<section class="relative flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
	<h1 class="text-foreground max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
		Welcome to the Contents of  <span class="font-[Playfair_Display] italic"> Matěj's </span> Mind
	</h1>
	<p class="text-foreground mt-6 max-w-lg text-lg leading-relaxed">
		Developer, thinker, and chaotic writer. I work with data, overthink career choices, and write it all down.
	</p>
	<div class="mt-10 flex flex-wrap items-center justify-center gap-4">
		<Button href="/blog">
			Read the Blog
		</Button>
		<Button href="mailto:matej@get-nomox.com" variant="ghost">
			Contact Me
		</Button>
	</div>
</section>
