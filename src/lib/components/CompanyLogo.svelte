<script lang="ts">
	let {
		name,
		src,
		fit = 'cover',
		class: className = ''
	}: {
		name: string;
		src?: string;
		/** "cover": app-icon style image that fills the tile. "contain": transparent mark on a white tile. */
		fit?: 'cover' | 'contain';
		class?: string;
	} = $props();

	// Shown until a logo file is set: "Second Foundation" -> "SF".
	const initials = $derived(
		name
			.split(/\s+/)
			.map((word) => word.replace(/[^\p{L}\p{N}]/gu, '')[0] ?? '')
			.join('')
			.slice(0, 2)
			.toUpperCase()
	);
</script>

<span
	class="border-border flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border {src &&
	fit === 'contain'
		? 'bg-white'
		: 'bg-card'} {className}"
	aria-hidden="true"
>
	{#if src}
		<img
			{src}
			alt=""
			width="40"
			height="40"
			loading="lazy"
			class="h-full w-full {fit === 'contain' ? 'object-contain p-1' : 'object-cover'}"
		/>
	{:else}
		<span class="text-muted-foreground text-xs font-semibold tracking-tight">{initials}</span>
	{/if}
</span>
