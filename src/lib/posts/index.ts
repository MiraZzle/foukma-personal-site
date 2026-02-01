export interface Post {
	slug: string;
	title: string;
	date: string;
	summary: string;
	tags: string[];
	readingTime: string;
}

const postModules = import.meta.glob<Post>('./*.json', { eager: true, import: 'default' });

export const posts: Post[] = Object.values(postModules).sort(
	(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

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
