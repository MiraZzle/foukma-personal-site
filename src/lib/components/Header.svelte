<script lang="ts">
	import { Sun, Moon, Menu, X, Search, Cuboid } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { toggleMode, mode } from '$lib/theme.svelte';
	import SearchDialog from '$lib/components/SearchDialog.svelte';

	let mobileOpen = $state(false);
	let searchOpen = $state(false);

	const links = [
		{ href: '/blog', label: 'Blog' },
		{ href: '/experience', label: 'Experience' },
		{ href: '/about', label: 'About Me' }
	];
</script>

<header class="bg-background/80 sticky top-0 z-50 w-full backdrop-blur">
	<div class="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
		<a href="/" class="text-foreground flex items-center gap-2 text-base tracking-tight">
			<Cuboid class="h-5 w-5" />
			foukalma.
		</a>

		<nav class="hidden items-center gap-6 md:flex">
			{#each links as link}
				<a
					href={link.href}
					class="text-foreground hover:text-primary text-sm font-medium transition-colors"
				>
					{link.label}
				</a>
			{/each}
			<Button variant="ghost" size="icon" onclick={() => (searchOpen = true)}>
				<Search class="h-4 w-4" />
			</Button>
			<Button variant="ghost" size="icon" onclick={toggleMode}>
				{#if mode.current === 'dark'}
					<Sun class="h-5 w-5" />
				{:else}
					<Moon class="h-5 w-5" />
				{/if}
			</Button>
		</nav>

		<div class="flex items-center gap-2 md:hidden">
			<Button variant="ghost" size="icon" onclick={() => (searchOpen = true)}>
				<Search class="h-4 w-4" />
			</Button>
			<Button variant="ghost" size="icon" onclick={toggleMode}>
				{#if mode.current === 'dark'}
					<Sun class="h-5 w-5" />
				{:else}
					<Moon class="h-5 w-5" />
				{/if}
			</Button>
			<Button variant="ghost" size="icon" onclick={() => (mobileOpen = !mobileOpen)}>
				{#if mobileOpen}
					<X class="h-5 w-5" />
				{:else}
					<Menu class="h-5 w-5" />
				{/if}
			</Button>
		</div>
	</div>

	{#if mobileOpen}
		<nav class="flex flex-col gap-2 px-6 py-4 md:hidden">
			{#each links as link}
				<a
					href={link.href}
					class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
					onclick={() => (mobileOpen = false)}
				>
					{link.label}
				</a>
			{/each}
		</nav>
	{/if}
</header>

<SearchDialog bind:open={searchOpen} />
