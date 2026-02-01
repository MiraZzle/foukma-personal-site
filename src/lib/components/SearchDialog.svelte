<script lang="ts">
	import { Search } from '@lucide/svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { blogSearch } from '$lib/stores/blog-search.svelte';
	import { searchPosts } from '$lib/posts';
	import { goto } from '$app/navigation';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	let results = $derived(blogSearch.query ? searchPosts(blogSearch.query) : []);

	function navigate(slug: string) {
		open = false;
		goto(`/blog/${slug}`);
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = !open;
		}
	}
</script>

<svelte:window {onkeydown} />

<Dialog.Root bind:open>
	<Dialog.Content class="top-[20%] translate-y-0 sm:max-w-lg">
		<Dialog.Header>
			<Dialog.Title>Search Posts</Dialog.Title>
		</Dialog.Header>
		<div class="flex flex-col gap-4">
			<div class="relative">
				<Search class="text-muted-foreground pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
				<input
					type="text"
					placeholder="Type to search..."
					bind:value={blogSearch.query}
					autofocus
					class="border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-md border py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2"
				/>
			</div>

			{#if blogSearch.query}
				<div class="flex max-h-64 flex-col gap-1 overflow-y-auto">
					{#each results as post}
						<button
							onclick={() => navigate(post.slug)}
							class="hover:bg-muted flex items-center gap-3 rounded-md px-3 py-2 text-left transition-colors"
						>
							<div class="min-w-0 flex-1">
								<p class="text-foreground truncate text-sm font-medium">{post.title}</p>
								
							</div>
							<time class="text-muted-foreground flex-shrink-0 text-xs">{post.date}</time>
						</button>
					{:else}
						<p class="text-muted-foreground py-4 text-center text-sm">No posts found.</p>
					{/each}
				</div>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>
