<script lang="ts">
	import { Sun, Moon, Menu, X, Search, Cuboid } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { toggleMode, mode } from '$lib/theme.svelte';
	import SearchDialog from '$lib/components/SearchDialog.svelte';
	import { page } from '$app/state';

	let mobileOpen = $state(false);
	let searchOpen = $state(false);

	const links = [
		{ href: '/blog', label: 'Blog' },
		{ href: '/experience', label: 'Experience' },
		{ href: '/about', label: 'About' }
	];
</script>

<header class="bg-background/80 sticky top-0 z-50 w-full backdrop-blur" style="view-transition-name: site-header">
	<div class="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
		<a href="/" class="group text-foreground flex items-center gap-2 text-base tracking-tight">
			<Cuboid class="h-5 w-5 transition-transform duration-500 ease-out group-hover:rotate-180" />
			foukalma.
		</a>

		<nav class="hidden items-center gap-6 md:flex">
			{#each links as link}
				{@const active = page.url.pathname.startsWith(link.href)}
				<a
					href={link.href}
					aria-current={active ? 'page' : undefined}
					class="after:bg-foreground relative text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-1.5 after:h-px after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100 {active
						? 'text-foreground after:scale-x-100'
						: 'text-muted-foreground hover:text-foreground after:scale-x-0'}"
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
				{@const active = page.url.pathname.startsWith(link.href)}
				<a
					href={link.href}
					aria-current={active ? 'page' : undefined}
					class="hover:text-foreground text-sm font-medium transition-colors {active
						? 'text-foreground'
						: 'text-muted-foreground'}"
					onclick={() => (mobileOpen = false)}
				>
					{link.label}
				</a>
			{/each}
		</nav>
	{/if}
</header>

<SearchDialog bind:open={searchOpen} />
