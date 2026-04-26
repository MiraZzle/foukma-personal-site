<script lang="ts">
	let { sections }: { sections: { id: string; label: string }[] } = $props();
</script>

<nav class="sticky top-20">
	<p class="text-muted-foreground mb-3 text-xs font-semibold uppercase tracking-wider">On this page</p>
	<ul class="space-y-1 border-l border-border">
		{#each sections as section}
			<li>
				<a
					href="#{section.id}"
					class="text-muted-foreground hover:text-foreground block py-1 pl-3 text-sm transition-colors"
				>
					{section.label}
				</a>
			</li>
		{/each}
	</ul>
</nav>
