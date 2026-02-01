<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import { Github, Linkedin } from '@lucide/svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="bg-background relative flex min-h-svh flex-col">
	<Header />
	<main class="flex flex-1 flex-col">
		{@render children()}
	</main>
	<footer class="py-6">
		<div class="mx-auto flex max-w-4xl flex-col items-center gap-3 px-6">
			<div class="flex gap-4">
				<a href="https://github.com/foukma" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground transition-colors">
					<Github class="h-5 w-5" />
				</a>
				<a href="https://linkedin.com/in/foukma" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground transition-colors">
					<Linkedin class="h-5 w-5" />
				</a>
			</div>
			<p class="text-muted-foreground text-sm">&copy; Matěj Foukal {new Date().getFullYear()}</p>
		</div>
	</footer>
</div>
