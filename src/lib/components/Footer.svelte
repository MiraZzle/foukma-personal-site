<script lang="ts">
	import { Github, Linkedin } from '@lucide/svelte';
</script>

<footer class="py-6">
	<div class="mx-auto flex max-w-4xl flex-col items-center gap-3 px-6">
		<div class="flex gap-4">
			<a href="https://github.com/MiraZzle" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground transition-colors">
				<Github class="h-5 w-5" />
			</a>
			<a href="https://www.linkedin.com/in/matej-foukal/" target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground transition-colors">
				<Linkedin class="h-5 w-5" />
			</a>
		</div>
		<p class="text-muted-foreground text-sm">&copy; Matěj Foukal {new Date().getFullYear()}</p>
	</div>
</footer>
