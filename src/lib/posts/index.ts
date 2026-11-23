export interface Post {
	slug: string;
	title: string;
	date: string;
	summary: string;
	tags: string[];
	readingTime: string;
	/** Drafts show up while running `npm run dev` and stay out of the built site's lists, sitemap and feed. */
	draft?: boolean;
}

const postModules = import.meta.glob<Post>('./*.json', { eager: true, import: 'default' });

export const posts: Post[] = Object.values(postModules)
	.filter((post) => !post.draft || import.meta.env.DEV)
	.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export function latestPosts(count: number, excludeSlug?: string): Post[] {
	return posts.filter((post) => post.slug !== excludeSlug).slice(0, count);
}

export function searchPosts(query: string, tagFilter: string[] = []): Post[] {
	const q = query.toLowerCase();
	return posts.filter((post) => {
		const matchesTags = tagFilter.length === 0 || tagFilter.every((t) => post.tags.includes(t));
		const matchesQuery =
			!q ||
			post.title.toLowerCase().includes(q) ||
			post.summary.toLowerCase().includes(q) ||
			post.tags.some((t) => t.toLowerCase().includes(q));
		return matchesTags && matchesQuery;
	});
}

export const allTags: string[] = [...new Set(posts.flatMap((p) => p.tags))].sort();
