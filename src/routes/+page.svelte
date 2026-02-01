<script lang="ts">
	import { Button } from '$lib/components/ui/button';
</script>

<section class="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
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
		<Button href="mailto:hello@foukma.dev" variant="ghost">
			Contact Me
		</Button>
	</div>
</section>
