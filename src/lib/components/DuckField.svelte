<script lang="ts" module>
	export type Duck = {
		/** Position across the field, 0 to 1. */
		x: number;
		/** Pixels from the top. */
		y: number;
		/** Radius in pixels. */
		r: number;
		facing: 'left' | 'right';
		/** Any number; gives each duck its own rhythm. */
		seed: number;
		/** Wears sunglasses: on the eyes in light mode, pushed up on the head in dark mode. */
		shades?: boolean;
		/** Wears the Santa hat through December. */
		hat?: boolean;
	};

	// The hero's ducks stay clear of the text, which is centred in the field: beside it on wide
	// screens, and in the padding above and below it on narrow ones.
	function heroLayout(width: number, height: number): Duck[] {
		if (width < 640) {
			return [
				{ x: 0.14, y: 52, r: 26, facing: 'right', seed: 0.13, hat: true },
				{ x: 0.87, y: 46, r: 21, facing: 'left', seed: 0.57 },
				{ x: 0.82, y: height - 48, r: 30, facing: 'left', seed: 0.81, shades: true }
			];
		}
		if (width < 1024) {
			return [
				{ x: 0.09, y: 54, r: 32, facing: 'right', seed: 0.13, shades: true },
				{ x: 0.91, y: 50, r: 28, facing: 'left', seed: 0.57 },
				{ x: 0.11, y: height - 54, r: 32, facing: 'right', seed: 0.35, hat: true },
				{ x: 0.89, y: height - 58, r: 40, facing: 'left', seed: 0.81, shades: true }
			];
		}
		return [
			{ x: 0.13, y: height * 0.36, r: 60, facing: 'right', seed: 0.13, hat: true },
			{ x: 0.87, y: height * 0.28, r: 48, facing: 'left', seed: 0.57, shades: true },
			{ x: 0.19, y: height * 0.72, r: 38, facing: 'right', seed: 0.35 },
			{ x: 0.8, y: height * 0.66, r: 64, facing: 'left', seed: 0.81, shades: true },
			{ x: 0.66, y: Math.max(40, height * 0.1), r: 23, facing: 'left', seed: 0.47 }
		];
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { createDuckRenderer, type DuckPose } from '$lib/ducks/renderer';
	import { mode } from '$lib/theme.svelte';

	/*
	 * A field of floating rubber ducks that fills its parent (which needs a size and `position: relative`).
	 *
	 * The ducks can be played with:
	 *  - a fast mouse knocks them away, and they bounce off each other and the edges;
	 *  - press and drag picks one up, and letting go throws it; a click or tap gives it a shove;
	 *  - they turn their heads towards the mouse when it is near;
	 *  - the ones with sunglasses wear them in light mode and push them up in dark mode;
	 *  - one wears a Santa hat through December (add ?santa to the address to see it any time).
	 *
	 * Left alone, each duck drifts back to its place. Drawing is in $lib/ducks/renderer.ts.
	 */

	let {
		layout = heroLayout,
		top = 0
	}: {
		/** Where the ducks live, for a field of the given size. */
		layout?: (width: number, height: number) => Duck[];
		/** Ducks stay below this many pixels from the top, e.g. to clear a header that overlaps the field. */
		top?: number;
	} = $props();

	const MAX_DUCKS = 6;
	const TAU = Math.PI * 2;
	/** A mouse has to be closing in at least this fast (px/s) to knock a duck. Slower, and you can pick it up. */
	const KNOCK_SPEED = 280;
	/** Elements that keep their own clicks, even with a duck behind them. */
	const INTERACTIVE = 'a, button, input, textarea, select, label, summary, [role="button"], [contenteditable="true"]';

	/** A duck in motion. Positions are CSS pixels inside the canvas. */
	type Body = {
		duck: Duck;
		homeX: number;
		homeY: number;
		/** Offset from home and its velocity, from being bumped or thrown. */
		ox: number;
		oy: number;
		vx: number;
		vy: number;
		/** Extra spin about the vertical axis, and sideways lean. */
		spin: number;
		spinV: number;
		lean: number;
		leanV: number;
		/** How far the head is turned towards the pointer. */
		lookTurn: number;
		lookNod: number;
		/** Idle float, and where the duck was last drawn with it. */
		bobX: number;
		bobY: number;
		cx: number;
		cy: number;
	};

	/** A duck being held. Its velocity is the pointer's, which becomes the throw. */
	type Grab = {
		body: Body;
		pointerId: number;
		/** From the pointer to the duck's centre. */
		dx: number;
		dy: number;
		startX: number;
		startY: number;
		moved: boolean;
		x: number;
		y: number;
		vx: number;
		vy: number;
		time: number;
	};

	const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value));

	let canvas: HTMLCanvasElement | undefined = $state();
	let ready = $state(false);
	/** Redraws a still frame; only needed when the animation is not running. */
	let redraw: (() => void) | undefined;

	$effect(() => {
		// The theme decides where the sunglasses sit.
		void mode.current;
		redraw?.();
	});

	onMount(() => {
		if (!canvas) return;
		const el = canvas;
		const renderer = createDuckRenderer(el, MAX_DUCKS);
		if (!renderer) return;

		const santa = new Date().getMonth() === 11 || new URLSearchParams(location.search).has('santa');
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

		let bodies: Body[] = [];
		let width = 0;
		let height = 0;

		function arrange() {
			({ width, height } = renderer!.resize());
			const ducks = layout(width, height).slice(0, MAX_DUCKS);
			bodies = ducks.map((duck, i) => {
				const previous = bodies.length === ducks.length ? bodies[i] : undefined;
				const homeX = duck.x * width;
				return {
					ox: 0,
					oy: 0,
					vx: 0,
					vy: 0,
					spin: 0,
					spinV: 0,
					lean: 0,
					leanV: 0,
					lookTurn: 0,
					lookNod: 0,
					bobX: 0,
					bobY: 0,
					...previous,
					duck,
					homeX,
					homeY: duck.y,
					cx: homeX,
					cy: duck.y
				};
			});
		}

		let elapsed = 0;
		let last = 0;
		let frame = 0;
		let onScreen = true;
		let grab: Grab | null = null;
		/** Where the mouse is, for the ducks to look at. */
		let mouse = { x: 0, y: 0, time: 0, present: false };
		/** 0 with sunglasses on the eyes, 1 with them pushed up. */
		let lift = mode.current === 'dark' ? 1 : 0;

		/** Moves the ducks: springs back home, spin and lean settle, ducks and walls bounce. */
		function step(dt: number) {
			for (const b of bodies) {
				if (grab?.body === b) {
					// Held: it follows the pointer and leans into the movement.
					if (performance.now() - grab.time > 80) {
						grab.vx *= 0.8;
						grab.vy *= 0.8;
					}
					b.lean += (clamp(-grab.vx * 0.0006, -0.6, 0.6) - b.lean) * Math.min(dt * 10, 1);
					b.leanV = 0;
					continue;
				}

				b.vx += (-5 * b.ox - 1.8 * b.vx) * dt;
				b.vy += (-5 * b.oy - 1.8 * b.vy) * dt;
				b.ox += b.vx * dt;
				b.oy += b.vy * dt;

				// Spin winds down to the nearest full turn, so the duck ends up facing its usual way.
				const rest = Math.round(b.spin / TAU) * TAU;
				b.spinV += (-3 * (b.spin - rest) - 1.4 * b.spinV) * dt;
				b.spin += b.spinV * dt;
				b.leanV += (-22 * b.lean - 3 * b.leanV) * dt;
				b.lean += b.leanV * dt;

				// Keep inside the field.
				const margin = b.duck.r * 0.75;
				const x = b.homeX + b.ox;
				const y = b.homeY + b.oy;
				if (x < margin && b.vx < 0) b.vx *= -0.6;
				if (x > width - margin && b.vx > 0) b.vx *= -0.6;
				if (y < top + margin && b.vy < 0) b.vy *= -0.6;
				if (y > height - margin && b.vy > 0) b.vy *= -0.6;
			}

			// Ducks knock each other away. A held duck does not give way.
			for (let i = 0; i < bodies.length; i++) {
				for (let j = i + 1; j < bodies.length; j++) {
					const a = bodies[i];
					const b = bodies[j];
					const dx = b.homeX + b.ox - (a.homeX + a.ox);
					const dy = b.homeY + b.oy - (a.homeY + a.oy);
					const distance = Math.hypot(dx, dy);
					const reach = (a.duck.r + b.duck.r) * 0.78;
					if (distance >= reach || distance < 0.001) continue;

					const nx = dx / distance;
					const ny = dy / distance;
					const heldA = grab?.body === a;
					const heldB = grab?.body === b;
					const massA = a.duck.r * a.duck.r;
					const massB = b.duck.r * b.duck.r;
					const shareA = heldA ? 0 : heldB ? 1 : massB / (massA + massB);
					const shareB = 1 - shareA;

					const overlap = reach - distance;
					a.ox -= nx * overlap * shareA;
					a.oy -= ny * overlap * shareA;
					b.ox += nx * overlap * shareB;
					b.oy += ny * overlap * shareB;

					const avx = heldA ? grab!.vx : a.vx;
					const avy = heldA ? grab!.vy : a.vy;
					const bvx = heldB ? grab!.vx : b.vx;
					const bvy = heldB ? grab!.vy : b.vy;
					const closing = (avx - bvx) * nx + (avy - bvy) * ny;
					if (closing <= 0) continue;
					const impulse = closing * 1.8;
					if (!heldA) {
						a.vx -= nx * impulse * shareA;
						a.vy -= ny * impulse * shareA;
						a.spinV -= impulse * shareA * 0.01;
					}
					if (!heldB) {
						b.vx += nx * impulse * shareB;
						b.vy += ny * impulse * shareB;
						b.spinV += impulse * shareB * 0.01;
					}
				}
			}
		}

		/** Speeds a duck up along (nx, ny), with a spin and a lean to match. */
		function kick(b: Body, nx: number, ny: number, amount: number) {
			b.vx += nx * amount;
			b.vy += ny * amount;
			b.spinV = clamp(b.spinV + (nx >= 0 ? 1 : -1) * amount * 0.012, -14, 14);
			b.leanV -= nx * amount * 0.005;
		}

		/** The duck under a point, if any. */
		function duckAt(x: number, y: number) {
			let found: Body | undefined;
			let nearest = Infinity;
			for (const b of bodies) {
				const distance = Math.hypot(b.cx - x, b.cy - y);
				if (distance <= b.duck.r * 0.8 && distance < nearest) {
					found = b;
					nearest = distance;
				}
			}
			return found;
		}

		/**
		 * How far a duck should turn its head to face the mouse. `turn`, `nod` and `rock` are the
		 * body's current angles. Returns [turn, nod] for the head, both 0 when the mouse is far away.
		 */
		function gaze(b: Body, turn: number, nod: number, rock: number): [number, number] {
			if (!mouse.present || grab) return [0, 0];
			const dx = mouse.x - b.cx;
			const dy = mouse.y - b.cy;
			const range = 240 + b.duck.r * 2;
			const near = clamp((range - Math.hypot(dx, dy)) / (range * 0.5), 0, 1);
			if (near <= 0) return [0, 0];

			// The mouse floats in front of the page, so a duck right under it looks out at the visitor.
			let x = dx;
			let y = -dy;
			let z = b.duck.r * 1.6;
			// From the screen into the duck's own space: undo lean, nod, turn and rock, in that order.
			[x, y] = [x * Math.cos(b.lean) + y * Math.sin(b.lean), y * Math.cos(b.lean) - x * Math.sin(b.lean)];
			[y, z] = [y * Math.cos(nod) + z * Math.sin(nod), z * Math.cos(nod) - y * Math.sin(nod)];
			[x, z] = [x * Math.cos(turn) - z * Math.sin(turn), z * Math.cos(turn) + x * Math.sin(turn)];
			[x, y] = [x * Math.cos(rock) + y * Math.sin(rock), y * Math.cos(rock) - x * Math.sin(rock)];

			const ease = near * near * (3 - 2 * near);
			return [
				clamp(Math.atan2(-z, x), -1, 1) * ease,
				clamp(Math.atan2(y, Math.hypot(x, z)), -0.3, 0.3) * ease
			];
		}

		function draw(dt: number) {
			const follow = dt > 0 ? 1 - Math.exp(-dt * 4.5) : 1;
			const poses: DuckPose[] = bodies.map((b) => {
				const { r, seed } = b.duck;
				// Bob up and down, and sway a little.
				b.bobX = r * 0.1 * Math.sin(elapsed * 0.23 + seed * 4);
				b.bobY = r * 0.16 * Math.sin(elapsed * 0.6 + seed * TAU);
				b.cx = b.homeX + b.ox + b.bobX;
				b.cy = b.homeY + b.oy + b.bobY;

				// Three-quarter view, beak towards the middle of the page.
				const facing = b.duck.facing === 'right' ? -0.6 : Math.PI + 0.6;
				const turn = facing + 0.45 * Math.sin(elapsed * 0.4 + seed * 5) + b.spin;
				const nod = 0.3 + 0.1 * Math.sin(elapsed * 0.5 + seed * 7);
				const rock = 0.16 * Math.sin(elapsed * 0.7 + seed * 3);

				const [lookTurn, lookNod] = gaze(b, turn, nod, rock);
				b.lookTurn += (lookTurn - b.lookTurn) * follow;
				b.lookNod += (lookNod - b.lookNod) * follow;

				return {
					x: b.cx,
					y: b.cy,
					r,
					turn,
					nod,
					rock,
					lean: b.lean,
					lookTurn: b.lookTurn,
					lookNod: b.lookNod,
					shades: !!b.duck.shades,
					hat: santa && !!b.duck.hat
				};
			});
			renderer!.draw(poses, lift);
		}

		function tick(now: number) {
			const dt = Math.min((now - last) / 1000, 0.033);
			last = now;
			elapsed += dt;
			lift += ((mode.current === 'dark' ? 1 : 0) - lift) * (1 - Math.exp(-dt * 7));
			step(dt);
			draw(dt);
			frame = requestAnimationFrame(tick);
		}

		/** Runs the animation only while it can be seen and motion is welcome. */
		function update() {
			cancelAnimationFrame(frame);
			frame = 0;
			if (onScreen && !document.hidden && !reducedMotion.matches) {
				last = performance.now();
				frame = requestAnimationFrame(tick);
			} else {
				release();
			}
		}

		// The canvas sits behind the page content, so pointer events are read from the window.

		function place(event: { clientX: number; clientY: number }): [number, number] {
			const rect = el.getBoundingClientRect();
			return [event.clientX - rect.left, event.clientY - rect.top];
		}

		function overControl(event: Event) {
			return event.target instanceof Element && !!event.target.closest(INTERACTIVE);
		}

		let cursor = '';
		function setCursor(value: string) {
			if (value === cursor) return;
			cursor = value;
			document.documentElement.style.cursor = value;
		}

		function release() {
			grab = null;
			setCursor('');
		}

		function onPointerDown(event: PointerEvent) {
			if (!frame || grab || (event.pointerType === 'mouse' && event.button !== 0) || overControl(event)) return;
			const [x, y] = place(event);
			const body = duckAt(x, y);
			if (!body) return;

			grab = {
				body,
				pointerId: event.pointerId,
				dx: body.cx - x,
				dy: body.cy - y,
				startX: x,
				startY: y,
				moved: false,
				x,
				y,
				vx: 0,
				vy: 0,
				time: performance.now()
			};
			body.vx = 0;
			body.vy = 0;
			// Dragging a duck should not select the text in front of it.
			if (event.pointerType === 'mouse') {
				event.preventDefault();
				setCursor('grabbing');
			}
		}

		function onPointerMove(event: PointerEvent) {
			if (!frame) return;
			const [x, y] = place(event);
			const now = performance.now();

			if (grab) {
				if (event.pointerId !== grab.pointerId) return;
				const dt = Math.max((now - grab.time) / 1000, 0.004);
				// Smoothed, so the throw follows the gesture and not just its last sample.
				grab.vx += ((x - grab.x) / dt - grab.vx) * 0.5;
				grab.vy += ((y - grab.y) / dt - grab.vy) * 0.5;
				grab.x = x;
				grab.y = y;
				grab.time = now;
				if (Math.hypot(x - grab.startX, y - grab.startY) > 6) grab.moved = true;

				const b = grab.body;
				b.ox = x + grab.dx - b.homeX - b.bobX;
				b.oy = y + grab.dy - b.homeY - b.bobY;
				return;
			}

			if (event.pointerType !== 'mouse') return;
			const dt = (now - mouse.time) / 1000;
			// After a long gap the mouse came from somewhere else, so its speed is unknown.
			const known = mouse.present && dt > 0 && dt < 0.2;
			const pvx = known ? (x - mouse.x) / Math.max(dt, 0.004) : 0;
			const pvy = known ? (y - mouse.y) / Math.max(dt, 0.004) : 0;
			mouse = { x, y, time: now, present: true };

			// The mouse acts like a heavy ball: it knocks a duck only while closing in on it fast.
			let hovering = false;
			for (const b of bodies) {
				const dx = b.cx - x;
				const dy = b.cy - y;
				const distance = Math.hypot(dx, dy);
				if (distance > b.duck.r * 0.8) continue;
				hovering = true;
				const nx = distance > 0.001 ? dx / distance : 0;
				const ny = distance > 0.001 ? dy / distance : -1;
				const closing = (pvx - b.vx) * nx + (pvy - b.vy) * ny;
				if (closing > KNOCK_SPEED) kick(b, nx, ny, Math.min(closing * 1.3, 1500));
			}
			setCursor(hovering && !overControl(event) ? 'grab' : '');
		}

		function onPointerUp(event: PointerEvent) {
			if (!grab || event.pointerId !== grab.pointerId) return;
			const { body, moved, vx, vy, x, y, time } = grab;
			release();

			if (!moved) {
				// A click or tap: shove the duck away from the point.
				const dx = body.cx - x;
				const dy = body.cy - y;
				const distance = Math.hypot(dx, dy);
				kick(body, distance > 0.001 ? dx / distance : 0, distance > 0.001 ? dy / distance : -1, 380);
				return;
			}

			// Thrown, unless the pointer had come to rest first.
			const still = performance.now() - time > 120;
			const speed = Math.hypot(vx, vy);
			const scale = still || speed < 1 ? 0 : Math.min(speed, 2600) / speed;
			body.vx = vx * scale;
			body.vy = vy * scale;
			body.spinV = clamp(body.spinV + vx * scale * 0.006, -14, 14);
		}

		// A finger dragging a duck must not scroll the page as well.
		function onTouchMove(event: TouchEvent) {
			if (grab && event.cancelable) event.preventDefault();
		}

		function onPointerLeave() {
			mouse.present = false;
			if (!grab) setCursor('');
		}

		arrange();
		draw(0);
		ready = true;
		redraw = () => {
			if (frame) return;
			lift = mode.current === 'dark' ? 1 : 0;
			draw(0);
		};
		update();

		const resizeObserver = new ResizeObserver(() => {
			arrange();
			draw(0);
		});
		resizeObserver.observe(el);

		const intersectionObserver = new IntersectionObserver(([entry]) => {
			onScreen = entry.isIntersecting;
			update();
		});
		intersectionObserver.observe(el);

		document.addEventListener('visibilitychange', update);
		reducedMotion.addEventListener('change', update);
		window.addEventListener('pointerdown', onPointerDown);
		window.addEventListener('pointermove', onPointerMove, { passive: true });
		window.addEventListener('pointerup', onPointerUp);
		window.addEventListener('pointercancel', onPointerUp);
		window.addEventListener('touchmove', onTouchMove, { passive: false });
		document.documentElement.addEventListener('pointerleave', onPointerLeave);

		return () => {
			cancelAnimationFrame(frame);
			redraw = undefined;
			release();
			resizeObserver.disconnect();
			intersectionObserver.disconnect();
			document.removeEventListener('visibilitychange', update);
			reducedMotion.removeEventListener('change', update);
			window.removeEventListener('pointerdown', onPointerDown);
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('pointerup', onPointerUp);
			window.removeEventListener('pointercancel', onPointerUp);
			window.removeEventListener('touchmove', onTouchMove);
			document.documentElement.removeEventListener('pointerleave', onPointerLeave);
			renderer.destroy();
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="absolute inset-0 h-full w-full transition-opacity duration-1000 {ready ? 'opacity-100' : 'opacity-0'}"
	aria-hidden="true"
></canvas>
