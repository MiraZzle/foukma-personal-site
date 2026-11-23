<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { createDuckRenderer, type DuckPose } from '$lib/ducks/renderer';

	/*
	 * Easter egg: type "quack" anywhere on the site and rubber ducks rain down the page.
	 * The canvas and its WebGL context only exist while it is raining.
	 */

	const WORD = 'quack';
	const MAX_DUCKS = 24;

	type Falling = DuckPose & { vx: number; vy: number; spin: number; wobble: number; phase: number };

	let canvas: HTMLCanvasElement | undefined = $state();
	let raining = $state(false);

	onMount(() => {
		let typed = '';
		let stop: (() => void) | undefined;

		async function rain() {
			if (raining || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
			raining = true;
			await tick();
			// A lower pixel ratio than the hero's: this canvas covers the whole window.
			const renderer = canvas ? createDuckRenderer(canvas, MAX_DUCKS, 1.5) : null;
			if (!renderer) {
				raining = false;
				return;
			}

			const { width, height } = renderer.resize();
			const december = new Date().getMonth() === 11;
			const count = Math.max(12, Math.min(MAX_DUCKS, Math.round(width / 50)));
			const ducks: Falling[] = Array.from({ length: count }, () => {
				const r = 22 + Math.random() * 26;
				const shades = Math.random() < 0.35;
				return {
					x: Math.random() * width,
					// Staggered above the top edge, so they arrive over a couple of seconds.
					y: -r - Math.random() * height * 0.9,
					r,
					turn: Math.random() * Math.PI * 2,
					nod: 0.3,
					rock: (Math.random() - 0.5) * 0.6,
					lean: 0,
					lookTurn: 0,
					lookNod: 0,
					shades,
					hat: december && !shades && Math.random() < 0.4,
					vx: (Math.random() - 0.5) * 140,
					vy: 80 + Math.random() * 220,
					spin: (Math.random() < 0.5 ? -1 : 1) * (1.2 + Math.random() * 2.3),
					wobble: 2 + Math.random() * 3,
					phase: Math.random() * Math.PI * 2
				};
			});

			let frame = 0;
			let last = performance.now();
			let elapsed = 0;

			function finish() {
				cancelAnimationFrame(frame);
				renderer!.destroy();
				stop = undefined;
				raining = false;
			}

			function step(now: number) {
				const dt = Math.min((now - last) / 1000, 0.033);
				last = now;
				elapsed += dt;

				let falling = 0;
				for (const duck of ducks) {
					duck.vy = Math.min(duck.vy + 900 * dt, 1400);
					duck.x += duck.vx * dt;
					duck.y += duck.vy * dt;
					duck.turn += duck.spin * dt;
					duck.lean = 0.35 * Math.sin(elapsed * duck.wobble + duck.phase);
					if (duck.y - duck.r < height) falling++;
				}
				renderer!.draw(ducks, 0);

				if (falling === 0 || elapsed > 10) finish();
				else frame = requestAnimationFrame(step);
			}

			stop = finish;
			frame = requestAnimationFrame(step);
		}

		function onKeyDown(event: KeyboardEvent) {
			if (event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1) return;
			typed = (typed + event.key.toLowerCase()).slice(-WORD.length);
			if (typed === WORD) {
				typed = '';
				rain();
			}
		}

		window.addEventListener('keydown', onKeyDown);
		return () => {
			window.removeEventListener('keydown', onKeyDown);
			stop?.();
		};
	});
</script>

{#if raining}
	<canvas bind:this={canvas} class="pointer-events-none fixed inset-0 z-[70] h-full w-full" aria-hidden="true"
	></canvas>
{/if}
