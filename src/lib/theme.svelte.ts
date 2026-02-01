import { browser } from '$app/environment';

function createMode() {
	let current = $state<'light' | 'dark'>('light');

	if (browser) {
		const stored = localStorage.getItem('theme');
		if (stored === 'dark' || stored === 'light') {
			current = stored;
		} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			current = 'dark';
		}
		document.documentElement.classList.toggle('dark', current === 'dark');
	}

	return {
		get current() {
			return current;
		},
		set current(v: 'light' | 'dark') {
			current = v;
			if (browser) {
				localStorage.setItem('theme', v);
				document.documentElement.classList.toggle('dark', v === 'dark');
			}
		}
	};
}

export const mode = createMode();

export function toggleMode() {
	mode.current = mode.current === 'dark' ? 'light' : 'dark';
}
