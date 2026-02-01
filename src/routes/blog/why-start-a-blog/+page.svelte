<script lang="ts">
	import BlogPost from '$lib/components/BlogPost.svelte';
	import meta from '$lib/posts/why-start-a-blog.json';
</script>

<BlogPost title={meta.title} date={meta.date} tags={meta.tags} readingTime={meta.readingTime}>
	<p>Writing helps you think. It forces you to clarify all the details where there was only a vague sense of understanding. When you *actually* sit down to explain something, whether it is  a technical concept or a half-formed opinion, you discover how well you actually (don't) understand it.</p>
	<p>This blog is my space for that process. You can expect a variety of posts ranging from technical deep dives to my personal reflections.</p>	
	<p>If even one person finds something useful or thought-provoking here, then it will have been worth the effort.</p>
</BlogPost>
