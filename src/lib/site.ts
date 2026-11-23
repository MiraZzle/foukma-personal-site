export const SITE = {
	url: 'https://www.foukalma.cz',
	name: 'foukalma.',
	author: 'Matěj Foukal',
	description:
		'Matěj Foukal leads development teams and builds data systems. A blog about data engineering, open data, leading engineers, and career choices.',
	image: '/me.jpg',
	sameAs: ['https://github.com/MiraZzle', 'https://www.linkedin.com/in/matej-foukal/']
};

export function absoluteUrl(path: string): string {
	return new URL(path, SITE.url).href;
}
