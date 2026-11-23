/*
 * Draws rubber ducks in 3D on a WebGL canvas, with no libraries.
 *
 * Each duck is a signed-distance model (body, head, tail, wings, beak, eyes, and optionally
 * sunglasses and a Santa hat) that the fragment shader ray-marches and lights. Pixels outside
 * a duck exit immediately, so the cost is only the area the ducks cover.
 *
 * This file only draws. Where the ducks are and how they move is up to the caller:
 * see DuckField.svelte (the interactive ducks) and DuckRain.svelte.
 */

/** One duck to draw. Position and radius are CSS pixels inside the canvas; angles are radians. */
export type DuckPose = {
	x: number;
	y: number;
	r: number;
	/** Rotation about the vertical axis. 0 faces right, in profile. */
	turn: number;
	/** Tips the top of the duck towards the viewer. */
	nod: number;
	/** Rocks the duck nose up and down. */
	rock: number;
	/** Leans the duck sideways on the screen. */
	lean: number;
	/** Turns and tilts the head on its own, relative to the body. */
	lookTurn: number;
	lookNod: number;
	shades: boolean;
	hat: boolean;
};

export type DuckRenderer = {
	/** Matches the drawing buffer to the canvas's size on the page. Returns that size in CSS pixels. */
	resize(): { width: number; height: number };
	/** `shadesLift` is 0 with sunglasses on the eyes and 1 with them pushed up on the head. */
	draw(poses: DuckPose[], shadesLift: number): void;
	destroy(): void;
};

const VERTEX = `
attribute vec2 aPos;
void main() {
	gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const fragment = (maxDucks: number) => `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uRes;
uniform vec4 uDuck[${maxDucks}]; // x, y, radius (device px, origin top left), extras (1 sunglasses + 2 hat)
uniform vec4 uRot[${maxDucks}];  // turn, nod, rock, lean
uniform vec2 uLook[${maxDucks}]; // head turn, head nod
uniform float uLift;
uniform int uCount;

// Set per duck before it is drawn.
float gShades;
float gHat;
mat3 gHead;
vec2 gLift;

const vec3 HEAD = vec3(0.22, 0.32, 0.0);
const float HEAD_R = 0.33;

mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }
mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 rotZ(float a) { float c = cos(a), s = sin(a); return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0); }

float smin(float a, float b, float k) {
	float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
	return mix(b, a, h) - k * h * (1.0 - h);
}

float ellipsoid(vec3 p, vec3 r) {
	float k0 = length(p / r);
	float k1 = length(p / (r * r));
	return k0 * (k0 - 1.0) / k1;
}

// A cone with rounded ends, from a (radius r1) to b (radius r2).
float roundCone(vec3 p, vec3 a, vec3 b, float r1, float r2) {
	vec3 ba = b - a;
	float l2 = dot(ba, ba);
	float rr = r1 - r2;
	float a2 = l2 - rr * rr;
	float il2 = 1.0 / l2;
	vec3 pa = p - a;
	float y = dot(pa, ba);
	float z = y - l2;
	vec3 xv = pa * l2 - ba * y;
	float x2 = dot(xv, xv);
	float y2 = y * y * l2;
	float z2 = z * z * l2;
	float k = sign(rr) * rr * rr * x2;
	if (sign(z) * a2 * z2 > k) return sqrt(x2 + z2) * il2 - r2;
	if (sign(y) * a2 * y2 < k) return sqrt(x2 + y2) * il2 - r1;
	return (sqrt(x2 * a2 * il2) + y * rr) * il2 - r1;
}

// The duck faces +x, with +y up.
// Returns (distance, material): 0 body, 1 beak, 2 eye, 3 frame, 4 lens, 5 hat, 6 fur.
vec2 duck(vec3 p) {
	vec3 q = vec3(p.x, p.y, abs(p.z));
	// Head space: relative to the centre of the head, and turned with it.
	vec3 hp = (p - HEAD) * gHead;
	vec3 hq = vec3(hp.x, hp.y, abs(hp.z));

	float body = ellipsoid(p - vec3(-0.10, -0.30, 0.0), vec3(0.56, 0.34, 0.43));
	float head = length(p - HEAD) - HEAD_R;
	float d = smin(body, head, 0.12);

	// Tail, swept up and back.
	vec3 t = p - vec3(-0.56, -0.05, 0.0);
	t.xy = vec2(0.769 * t.x - 0.639 * t.y, 0.639 * t.x + 0.769 * t.y);
	d = smin(d, ellipsoid(t, vec3(0.22, 0.12, 0.16)), 0.17);

	// Wings, raised towards the back, with a crisp edge.
	vec3 w = q - vec3(-0.14, -0.24, 0.385);
	w.xy = vec2(0.921 * w.x - 0.391 * w.y, 0.391 * w.x + 0.921 * w.y);
	d = smin(d, ellipsoid(w, vec3(0.30, 0.18, 0.10)), 0.045);

	// Flat base, like a bath toy.
	d = max(d, -(p.y + 0.60));

	// Two-part beak.
	float beak = smin(
		ellipsoid(hp - vec3(0.34, -0.065, 0.0), vec3(0.17, 0.05, 0.15)),
		ellipsoid(hp - vec3(0.31, -0.135, 0.0), vec3(0.13, 0.04, 0.12)),
		0.02
	);
	// Tall oval eyes on the sides of the head.
	float eye = ellipsoid(hq - vec3(0.154, 0.056, 0.224), vec3(0.10, 0.115, 0.05));

	vec2 res = vec2(d, 0.0);
	if (beak < res.x) res = vec2(beak, 1.0);
	// Sunglasses hide the eyes until they are pushed up.
	if ((gShades < 0.5 || uLift > 0.35) && eye < res.x) res = vec2(eye, 2.0);

	if (gShades > 0.5) {
		// A thick shell just off the head is cut into two square-ish frames on the face, resting
		// on the beak, and a brow bar that runs back into the arms. Lifting swings it up over the head.
		vec3 h = hq;
		h.xy = vec2(gLift.x * h.x + gLift.y * h.y, gLift.x * h.y - gLift.y * h.x);
		float shell = abs(length(h) - (HEAD_R + 0.045));
		// Position on the face around the middle of one lens: across, and up.
		vec2 face = vec2(dot(h, vec3(0.4067, 0.0, -0.9135)), dot(h, vec3(-0.1743, 0.9815, -0.0776)));
		vec2 edge = abs(face) - vec2(0.135, 0.09) + 0.04;
		float outline = length(max(edge, 0.0)) + min(max(edge.x, edge.y), 0.0) - 0.04;
		float front = 0.1 - dot(h, vec3(0.8967, 0.1908, 0.3992));
		float frame = max(shell - 0.02, max(outline, front));
		float bar = max(shell - 0.016, max(abs(h.y - 0.135) - 0.024, -(h.x + 0.10)));
		float shades = min(frame, bar);
		// Inside the frame's rim it is lens, everywhere else frame.
		if (shades < res.x) res = vec2(shades, outline < -0.026 && front < 0.0 ? 4.0 : 3.0);
	}

	if (gHat > 0.5) {
		// Santa hat: a stubby cone leaning back, a fur band round the head and a pom-pom.
		float cone = max(roundCone(hp, vec3(-0.02, 0.20, 0.0), vec3(-0.14, 0.50, 0.07), 0.235, 0.045), 0.17 - hp.y);
		if (cone < res.x) res = vec2(cone, 5.0);
		float band = length(vec2(length(hp.xz - vec2(-0.01, 0.0)) - 0.25, hp.y - 0.20)) - 0.058;
		float pom = length(hp - vec3(-0.15, 0.52, 0.08)) - 0.07;
		float fur = min(band, pom);
		if (fur < res.x) res = vec2(fur, 6.0);
	}

	return res;
}

vec3 normalAt(vec3 p) {
	vec2 e = vec2(0.002, -0.002);
	return normalize(
		e.xyy * duck(p + e.xyy).x +
		e.yyx * duck(p + e.yyx).x +
		e.yxy * duck(p + e.yxy).x +
		e.xxx * duck(p + e.xxx).x
	);
}

// uv is the pixel inside the duck's bounding circle, -1 to 1. px is one pixel in the same units.
vec4 renderDuck(vec2 uv, float px, mat3 rot) {
	// Orthographic camera on +z looking down -z. "v * rot" takes view space into duck space.
	vec3 ro = vec3(uv, 1.6) * rot;
	vec3 rd = vec3(0.0, 0.0, -1.0) * rot;

	float t = 0.0;
	float nearest = 1e5;
	vec3 pos = ro;
	float material = 0.0;
	bool hit = false;

	for (int i = 0; i < 56; i++) {
		vec3 p = ro + rd * t;
		vec2 h = duck(p);
		if (h.x < nearest) {
			nearest = h.x;
			pos = p;
			material = h.y;
		}
		if (h.x < 0.0015) {
			hit = true;
			break;
		}
		t += h.x * 0.85;
		if (t > 3.2) break;
	}

	// Rays that just miss still shade their closest point, which smooths the outline.
	float alpha = hit ? 1.0 : 1.0 - smoothstep(0.0, px * 1.5, nearest);
	if (alpha <= 0.0) return vec4(0.0);

	vec3 n = normalAt(pos);
	vec3 light = normalize(vec3(-0.45, 0.75, 0.55)) * rot;
	vec3 view = -rd;

	float diffuse = smoothstep(-0.35, 1.0, dot(n, light));
	float specular = pow(max(dot(n, normalize(light + view)), 0.0), 60.0);
	float rim = pow(1.0 - max(dot(n, view), 0.0), 3.0);
	float occlusion = clamp(duck(pos + n * 0.10).x / 0.10, 0.0, 1.0);

	vec3 lit = vec3(1.0, 0.79, 0.12);
	vec3 shade = vec3(0.85, 0.47, 0.05);
	float gloss = 0.55;
	vec3 extra = vec3(0.0);
	if (material > 5.5) {
		// Fur: white and matte.
		lit = vec3(0.97, 0.97, 0.95);
		shade = vec3(0.64, 0.68, 0.78);
		gloss = 0.04;
		rim *= 0.5;
	} else if (material > 4.5) {
		// Hat: red felt.
		lit = vec3(0.88, 0.09, 0.10);
		shade = vec3(0.42, 0.02, 0.05);
		gloss = 0.12;
	} else if (material > 3.5) {
		// Lenses: dark glass with a bit of sky in it.
		lit = vec3(0.10, 0.13, 0.18);
		shade = vec3(0.02, 0.03, 0.05);
		gloss = 1.0;
		extra = vec3(0.20, 0.30, 0.40) * smoothstep(-0.2, 0.7, (rot * n).y);
		rim *= 0.5;
	} else if (material > 2.5) {
		// Frame: black plastic.
		lit = vec3(0.09, 0.09, 0.10);
		shade = vec3(0.01);
		gloss = 0.3;
		rim *= 0.3;
	} else if (material > 1.5) {
		lit = vec3(0.07, 0.06, 0.06);
		shade = vec3(0.0);
		gloss = 0.9;
		rim = 0.0;
	} else if (material > 0.5) {
		lit = vec3(0.98, 0.42, 0.07);
		shade = vec3(0.70, 0.22, 0.03);
	}

	vec3 col = mix(shade, lit, diffuse);
	col *= mix(0.72, 1.0, occlusion);
	col += extra;
	col += specular * gloss;
	col += rim * 0.18 * vec3(1.0, 0.95, 0.75);

	if (material > 1.5 && material < 2.5) {
		// A small white dot painted on each eye, up and towards the beak.
		vec3 onHead = (pos - HEAD) * gHead;
		onHead.z = abs(onHead.z);
		col = mix(col, vec3(1.0), 1.0 - smoothstep(0.017, 0.027, length(onHead - vec3(0.202, 0.098, 0.260))));
	}

	return vec4(clamp(col, 0.0, 1.0) * alpha, alpha);
}

void main() {
	vec2 frag = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
	vec4 color = vec4(0.0);
	gLift = vec2(cos(uLift * 0.95), sin(uLift * 0.95));

	for (int i = 0; i < ${maxDucks}; i++) {
		if (i >= uCount) break;
		vec4 d = uDuck[i];
		vec2 uv = (frag - d.xy) / d.z;
		uv.y = -uv.y;
		if (dot(uv, uv) > 1.0) continue;

		vec4 r = uRot[i];
		mat3 rot = rotZ(r.w) * rotX(r.y) * rotY(r.x) * rotZ(r.z);
		gHat = step(1.5, d.w);
		gShades = d.w - 2.0 * gHat;
		gHead = rotY(uLook[i].x) * rotZ(uLook[i].y);

		vec4 duckColor = renderDuck(uv, 1.0 / d.z, rot);
		color += duckColor * (1.0 - color.a);
		if (color.a > 0.995) break;
	}

	gl_FragColor = color;
}`;

/**
 * Sets up the shader on a canvas. Returns null where WebGL is unavailable or the shader
 * does not compile, in which case the page simply has no ducks.
 */
export function createDuckRenderer(
	canvas: HTMLCanvasElement,
	maxDucks: number,
	maxPixelRatio = 2
): DuckRenderer | null {
	const gl = canvas.getContext('webgl', {
		alpha: true,
		premultipliedAlpha: true,
		antialias: false,
		powerPreference: 'low-power'
	});
	if (!gl) return null;

	function compile(type: number, source: string) {
		const shader = gl!.createShader(type);
		if (!shader) return null;
		gl!.shaderSource(shader, source);
		gl!.compileShader(shader);
		if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
			console.warn('Duck shader:', gl!.getShaderInfoLog(shader));
			return null;
		}
		return shader;
	}

	const vertexShader = compile(gl.VERTEX_SHADER, VERTEX);
	const fragmentShader = compile(gl.FRAGMENT_SHADER, fragment(maxDucks));
	const program = gl.createProgram();
	if (!vertexShader || !fragmentShader || !program) return null;
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.warn('Duck program:', gl.getProgramInfoLog(program));
		return null;
	}
	gl.useProgram(program);

	// One triangle that covers the whole canvas.
	gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
	const aPos = gl.getAttribLocation(program, 'aPos');
	gl.enableVertexAttribArray(aPos);
	gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

	const uRes = gl.getUniformLocation(program, 'uRes');
	const uDuck = gl.getUniformLocation(program, 'uDuck[0]');
	const uRot = gl.getUniformLocation(program, 'uRot[0]');
	const uLook = gl.getUniformLocation(program, 'uLook[0]');
	const uLift = gl.getUniformLocation(program, 'uLift');
	const uCount = gl.getUniformLocation(program, 'uCount');
	const duckData = new Float32Array(maxDucks * 4);
	const rotData = new Float32Array(maxDucks * 4);
	const lookData = new Float32Array(maxDucks * 2);
	let ratio = 1;

	return {
		resize() {
			ratio = Math.min(window.devicePixelRatio || 1, maxPixelRatio);
			const width = canvas.clientWidth;
			const height = canvas.clientHeight;
			canvas.width = Math.max(1, Math.round(width * ratio));
			canvas.height = Math.max(1, Math.round(height * ratio));
			gl.viewport(0, 0, canvas.width, canvas.height);
			gl.uniform2f(uRes, canvas.width, canvas.height);
			return { width, height };
		},

		draw(poses, shadesLift) {
			const count = Math.min(poses.length, maxDucks);
			for (let i = 0; i < count; i++) {
				const pose = poses[i];
				duckData.set(
					[pose.x * ratio, pose.y * ratio, pose.r * ratio, (pose.shades ? 1 : 0) + (pose.hat ? 2 : 0)],
					i * 4
				);
				rotData.set([pose.turn, pose.nod, pose.rock, pose.lean], i * 4);
				lookData.set([pose.lookTurn, pose.lookNod], i * 2);
			}
			gl.uniform4fv(uDuck, duckData);
			gl.uniform4fv(uRot, rotData);
			gl.uniform2fv(uLook, lookData);
			gl.uniform1f(uLift, shadesLift);
			gl.uniform1i(uCount, count);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
		},

		destroy() {
			gl.getExtension('WEBGL_lose_context')?.loseContext();
		}
	};
}
