<script lang="ts">
	import BlogPost from '$lib/components/BlogPost.svelte';
	import BlogP from '$lib/components/BlogP.svelte';
	import BlogH2 from '$lib/components/BlogH2.svelte';
	import meta from '$lib/posts/becoming-a-yes-man.json';
</script>

<BlogPost title={meta.title} date={meta.date} tags={meta.tags} readingTime={meta.readingTime}>
	<img
		src="https://news.simplybook.me/wp-content/uploads/2017/12/jim_carrey_in_yes_man-HD.jpg"
		alt="Jim Carrey in Yes Man"
		class="mb-8 w-full rounded-lg object-cover"
	/>

	<BlogP>Do you know the movie <em>Yes Man</em>?</BlogP>

	<BlogP>It's about a guy who decides to say "yes" to every opportunity that comes his way. At first, it's chaotic and a bit reckless but over time, it opens doors he never even knew existed. New people. New skills. A completely different life.</BlogP>

	<BlogP>About a year ago, I realized I needed something like that.</BlogP>

	<BlogP>I felt stuck in a strange place - both overwhelmed and underwhelmed at the same time. I had ambition, ideas, and energy, but I wasn't really moving forward. I was overthinking everything, questioning whether I was "ready," and subconsciously saying no to opportunities before they even had a chance to challenge me.</BlogP>

	<BlogP>Then came a simple moment: I said yes to an Oracle internship.</BlogP>

	<BlogP>It wasn't some perfectly calculated decision. In fact, I wasn't even sure I was good enough. But that one "yes" turned out to be a starting point.</BlogP>

	<BlogH2>Thinking in Graphs</BlogH2>

	<BlogP>If you're into computer science like me, here's how I started thinking about it:</BlogP>

	<BlogP>Life is a graph.</BlogP>

	<BlogP>Most people stay in a very small part of it - the nodesthey already know. But the only way to explore the graph is to start traversing it.</BlogP>

	<BlogP>Saying "yes" is like running BFS (Breadth-First Search). You explore widely. You expose yourself to new nodes, new directions and new possibilities.</BlogP>

	<BlogP>Then, when you find something interesting - something that clicks - you switch to DFS (Depth-First Search). You go deeper. You commit. You build something meaningful.</BlogP>

	<BlogP>But none of that happens if you never take the first step.</BlogP>

	<BlogH2>The First Yes Is the Hardest</BlogH2>

	<BlogP>I was scared.</BlogP>

	<BlogP>I didn't think I had enough skills. I thought other people were more prepared, more talented, more "deserving." At the same time, I had this constant feeling that I could do more - but I wasn't acting on it.</BlogP>

	<BlogP>That’s the worst combination: having ambition, but not acting on it.</BlogP>

	<BlogP>Saying yes broke that pattern for me.</BlogP>

	<BlogP>Not because it made me confident overnight (damn I wish) but because it forced me into situations where I had to grow.</BlogP>

	<BlogH2>What Changed for Me</BlogH2>

	<BlogP>After that first yes, things started compounding.</BlogP>

	<BlogP>I said yes to:</BlogP>

	<ul class="text-muted-foreground my-4 list-disc pl-6 text-base leading-relaxed">
		<li>a random hackathon that opened up a new chapter in my life</li>
		<li>meeting new people I would normally avoid</li>
		<li>taking part in an angel investing club</li>
		<li>pitching ideas in front of VC funds</li>
		<li>projects that felt slightly out of reach</li>
    <li>joining the University of Passau</li>
	</ul>

	<BlogP>Each time, I felt that same hesitation. That same voice saying, "You're not ready."</BlogP>

	<BlogP>But I said yes anyway.</BlogP>

	<BlogP>Not every experience was amazing. Some were awkward. Some didn't lead anywhere. Some were even painful. But even those expanded my graph.</BlogP>

	<BlogH2>Growth Through Yes</BlogH2>

	<BlogP>This post really isn't about blindly saying yes to everything.</BlogP>

	<BlogP>It's actually about breaking the habit of saying no out of fear.</BlogP>

	<BlogP>Most opportunities don’t look life-changing. In fact, most of them aren’t. They look really inconvenient, uncertain, or uncomfortable.</BlogP>

	<BlogP>But that's exactly my point.</BlogP>

	<BlogP>Growth doesn't come from optimizing the known. It comes from exploring the unknown and using our past experiences as a foundation.</BlogP>


	<img
		src="https://towardsdatascience.com/wp-content/uploads/2020/03/19X9zPbaEsEQrTqm3_Yv_bA.png"
		alt="Chaining of Bayes' rule for updating probabilities as the data comes in"
		class="my-8 w-full rounded-lg"
	/>

	<BlogH2>So What Am I Trying to Say?</BlogH2>

  <BlogP>Say yes way more often than feels comfortable. Put yourself in rooms where you're not the smartest person.</BlogP>

  <BlogP>You don't need a perfect plan to start. You won’t have one.</BlogP>

  <BlogP>Become your own Yes Man. Even just for a week.</BlogP>

  <BlogP>It might change everything.</BlogP>

</BlogPost>
