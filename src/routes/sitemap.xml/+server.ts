import { posts } from '$lib/posts';
import { SITE } from '$lib/site';

const staticRoutes = ['/', '/blog', '/about', '/experience'];

export async function GET() {
	const published = posts.filter((post) => !post.draft);
	// The home page and the blog index change whenever a post is published.
	const latestPostDate = published[0]?.date;

	const urls: { loc: string; lastmod?: string }[] = [
		...staticRoutes.map((path) => ({
			loc: `${SITE.url}${path}`,
			lastmod: path === '/' || path === '/blog' ? latestPostDate : undefined
		})),
		...published.map((post) => ({ loc: `${SITE.url}/blog/${post.slug}`, lastmod: post.date }))
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ loc, lastmod }) => `  <url>
    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}
