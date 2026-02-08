<script lang="ts">
	import BlogPost from '$lib/components/BlogPost.svelte';
	import BlogH2 from '$lib/components/BlogH2.svelte';
	import BlogP from '$lib/components/BlogP.svelte';
	import meta from '$lib/posts/great-engineers-need-boredom.json';
</script>

<BlogPost title={meta.title} date={meta.date} tags={meta.tags} readingTime={meta.readingTime}>

<BlogP>How many times a day do you just stop and think, completely on your own, in total silence?</BlogP>

<BlogP>I feel like I don't have enough time for anything. Not because I'm that busy, but because every possibly empty moment gets filled automatically. The second I feel like I might get stuck with just my own thoughts, I reach out and grab my headphones or start browsing through my notifications. At this point, it might not even be a conscious action. It's just my default.</BlogP>

<BlogP>(I actually just received a notification that totally disrupted my train of thought.)</BlogP>

<BlogH2>Why bring this up on a tech blog?</BlogH2>

<BlogP>Let's face it: most people nowadays code using some sort of copilot. Whether it's Github copilot, Claude, or something different, we're all guilty. While we're able to produce exponentially more code than ever before, we don't really need to focus as intensely as we had to back in the day. The mental work has been reduced to just reviewing and skimming, not creating, learning or coming up with something new.</BlogP>

<BlogP>This ties to the quick dopamine hits and lowered attention span of most programmers nowadays. However programmers are not the only ones who suffer from this, the entire population does. We've all become dopamine junkies at the cost of our attention spans and our best ideas. </BlogP>

<BlogP>I realize that my best ideas for solving complex problems don't usually come when I'm scrolling X or Instagram. They come in the shower, while on a hike, or when I am simply walking to the bus. When working on my bachelor's thesis, I struggled to create a flexible system for defining voting sessions. The idea I settled on actually came to me while I was on a hike. Yet, I keep suppressing those seemingly empty moments.</BlogP>

<BlogH2>So how do I solve this issue?</BlogH2>

<BlogP>Yeah, I could try downloading another productivity app that someone vibecoded over the weekend, hoping that this one will be different. Another clever workaround so I don't actually have to sit alone with my thoughts.</BlogP>

<BlogP>I don't have a solution yet. But I'm starting to wonder if the first step is just... noticing.</BlogP>
</BlogPost>
