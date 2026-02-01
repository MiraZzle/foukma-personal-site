<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';

	const categories = [
		{
			name: 'Languages & Frameworks',
			items: ['TypeScript', 'Svelte / SvelteKit', 'React', 'Node.js']
		},
		{
			name: 'Tools',
			items: ['VS Code', 'Git', 'Docker', 'Figma']
		},
		{
			name: 'Infrastructure',
			items: ['Vercel', 'GitHub Actions', 'PostgreSQL', 'Redis']
		}
	];
</script>

<section class="mx-auto w-full max-w-3xl px-6 py-16">
	<h1 class="text-foreground text-3xl font-bold tracking-tight">My Tech</h1>
	<p class="text-muted-foreground mt-2 text-base">The stack and tools I reach for most often.</p>

	<div class="mt-10 flex flex-col gap-8">
		{#each categories as cat, i}
			{#if i > 0}
				<Separator />
			{/if}
			<div>
				<h2 class="text-foreground text-lg font-semibold">{cat.name}</h2>
				<ul class="text-muted-foreground mt-3 flex flex-wrap gap-2">
					{#each cat.items as item}
						<li class="bg-secondary text-secondary-foreground rounded-md px-3 py-1 text-sm">{item}</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</section>
