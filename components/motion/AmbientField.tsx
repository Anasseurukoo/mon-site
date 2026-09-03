"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useHeavyEffectsAllowed } from "@/hooks/useDeviceCapability";

/**
 * Atmospheric background: slow drifting fog with a faint gold ember drift.
 *
 * Written as a single hand-rolled WebGL fragment shader rather than pulling in
 * Three.js — this needs one full-screen quad and no scene graph, so a library
 * would cost ~150 kB of JavaScript to do less. Total cost here is the shader
 * source below.
 *
 * It degrades in three steps:
 *   1. reduced motion / save-data  → never mounts, CSS gradient only
 *   2. no WebGL context            → CSS gradient only
 *   3. tab hidden                  → rAF loop paused
 *
 * The CSS gradient underneath is always present, so the page never depends on
 * this rendering at all.
 */

const VERT = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2  uResolution;
uniform float uTime;

// Value noise — cheap, and at this scale indistinguishable from gradient noise.
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p  = uv * vec2(uResolution.x / uResolution.y, 1.0);

  float t = uTime * 0.014;

  // Two fog layers drifting at different rates and directions.
  float fog  = fbm(p * 1.7 + vec2(t, t * 0.45));
  float fog2 = fbm(p * 3.1 - vec2(t * 0.7, t * 0.3));
  float density = mix(fog, fog2, 0.42);

  // Palette: dark petrol lifting out of near-black, warm gold in the crest.
  vec3 sumi   = vec3(0.027, 0.031, 0.039);
  vec3 petrol = vec3(0.055, 0.102, 0.114);
  vec3 gold   = vec3(0.788, 0.643, 0.298);

  vec3 col = mix(sumi, petrol, smoothstep(0.30, 0.85, density));
  col += gold * pow(smoothstep(0.68, 1.0, density), 3.0) * 0.16;

  // Radial falloff keeps the centre clear so text over it stays readable.
  float vign = smoothstep(1.15, 0.18, length(uv - 0.5));
  col *= mix(0.55, 1.0, vign);

  // Dither to stop banding across such a narrow value range.
  col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.012;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function AmbientField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const capable = useHeavyEffectsAllowed();

  // Pure derivation — both inputs are external-store reads, so this is correct
  // on the first client render with no intermediate state.
  const enabled = capable && !prefersReduced;

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    }) ?? null) as WebGLRenderingContext | null;

    if (!gl) return; // step 2 of the degradation ladder

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");

    // Render at half resolution: this is out-of-focus fog, nobody can tell,
    // and it roughly quarters the fragment cost.
    const SCALE = 0.5;
    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * SCALE));
      const h = Math.max(1, Math.floor(canvas.clientHeight * SCALE));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uResolution, w, h);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    let frame = 0;
    let running = true;
    const start = performance.now();

    const loop = () => {
      if (!running) return;
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frame = requestAnimationFrame(loop);
    };

    // step 3: don't burn cycles on a tab nobody is looking at.
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!running) {
        running = true;
        frame = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onContextLost = (event: Event) => {
      event.preventDefault();
      running = false;
      cancelAnimationFrame(frame);
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    frame = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [enabled]);

  return (
    <div className={className} aria-hidden="true">
      {/* Always-present fallback. The canvas draws on top when available. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, #16292e 0%, #0e1a1d 34%, #07080a 72%)",
        }}
      />
      {enabled && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ opacity: 0.9 }}
        />
      )}
    </div>
  );
}
