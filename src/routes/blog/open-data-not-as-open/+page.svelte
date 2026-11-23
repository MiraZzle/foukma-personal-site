<script lang="ts">
	import BlogPost from '$lib/components/BlogPost.svelte';
	import BlogP from '$lib/components/BlogP.svelte';
	import BlogH2 from '$lib/components/BlogH2.svelte';
	import meta from '$lib/posts/open-data-not-as-open.json';
</script>

<!--
	Placeholder. To publish: write the post, then in src/lib/posts/open-data-not-as-open.json
	remove "draft": true and update "date", "summary" and "readingTime".
-->
<BlogPost {...meta}>
	<BlogP>
		This is the first post in a series about my diploma thesis and the topics around it. It is still being written.
	</BlogP>

	<BlogH2>What "open" is supposed to mean</BlogH2>

	<BlogP>TODO</BlogP>

	<BlogH2>Where it falls short</BlogH2>

	<BlogP>TODO</BlogP>

	<BlogH2>What this has to do with my thesis</BlogH2>

	<BlogP>TODO</BlogP>
</BlogPost>
