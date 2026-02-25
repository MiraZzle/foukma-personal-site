import { posts } from '$lib/posts';

const SITE = 'https://www.foukalma.cz';

const staticRoutes = ['/', '/blog', '/about', '/experience'];

export async function GET() {
	const urls = [
		...staticRoutes.map((path) => ({ loc: `${SITE}${path}` })),
		...posts.map((post) => ({ loc: `${SITE}/blog/${post.slug}`, lastmod: post.date }))
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
