import type { Action } from 'svelte/action';

/**
 * Pair with class="reveal" (see layout.css).
 *
 * The class alone plays the entrance animation on load, so the page works without JS
 * and nothing is hidden from crawlers. This action only holds back elements that start
 * below the fold, and releases them when they scroll into view.
 */
export const reveal: Action<HTMLElement> = (node) => {
	if (typeof IntersectionObserver === 'undefined') return;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	if (node.getBoundingClientRect().top <= window.innerHeight) return;

	node.classList.add('reveal-wait');
	// Stagger delays are for groups that enter together on load, not for scrolling.
	node.style.setProperty('--reveal-delay', '0ms');

	const observer = new IntersectionObserver(
		(entries) => {
			if (entries.some((entry) => entry.isIntersecting)) {
				node.classList.remove('reveal-wait');
				observer.disconnect();
			}
		},
		{ rootMargin: '0px 0px -8% 0px' }
	);
	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
};
