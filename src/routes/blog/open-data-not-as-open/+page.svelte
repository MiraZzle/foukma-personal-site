<script lang="ts">
	import BlogPost from '$lib/components/BlogPost.svelte';
	import BlogP from '$lib/components/BlogP.svelte';
	import BlogH2 from '$lib/components/BlogH2.svelte';
	import meta from '$lib/posts/open-data-not-as-open.json';
</script>

<BlogPost {...meta}>
	<BlogP>
		This is the first post in a series about my diploma thesis and the topics around it.
	</BlogP>

	<BlogH2>What "open" is supposed to mean</BlogH2>

	<BlogP>Open means that the data is freely available for anyone to access, use, and share, without restrictions or barriers. That statement only applies to a certain extent when talking about data catalogs. The data is usually accessible but not easily findable nor usable when it comes to actual use cases. For the rest of this series we are going to restrict ourselves to Czech government data catalog.</BlogP>
</BlogPost>
