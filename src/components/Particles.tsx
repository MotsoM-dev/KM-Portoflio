"use client";

import { useEffect, useRef } from "react";
import { Camera, Geometry, Mesh, Program, Renderer } from "ogl";
import "./Particles.css";

const defaultColors = ["#f9a8d4", "#8b5cf6", "#22d3ee"];

const getThemePalette = () => {
  if (typeof window === "undefined") {
    return defaultColors;
  }

  const style = window.getComputedStyle(document.documentElement);

  return [
    style.getPropertyValue("--theme-particle-pink").trim() || defaultColors[0],
    style.getPropertyValue("--theme-particle-violet").trim() || defaultColors[1],
    style.getPropertyValue("--theme-particle-teal").trim() || defaultColors[2],
  ];
};

const hexToRgb = (hex: string): [number, number, number] => {
  let normalizedHex = hex.replace(/^#/, "");

  if (normalizedHex.length === 3) {
    normalizedHex = normalizedHex
      .split("")
      .map((character) => character + character)
      .join("");
  }

  const int = parseInt(normalizedHex.slice(0, 6), 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;

  return [r, g, b];
};

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;

  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;

  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vRandom = random;
    vColor = color;

    vec3 pos = position * uSpread;
    pos.z *= 10.0;

    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    vec4 mvPos = viewMatrix * mPos;

    if (uSizeRandomness == 0.0) {
      gl_PointSize = uBaseSize;
    } else {
      gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    }

    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));

    if (uAlphaParticles < 0.5) {
      if (d > 0.5) {
        discard;
      }

      gl_FragColor = vec4(vColor, 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.85;
      gl_FragColor = vec4(vColor, circle);
    }
  }
`;

export default function Particles({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleColors,
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  alphaParticles = false,
  particleBaseSize = 100,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
  pixelRatio = 1,
  className,
}: {
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleColors?: string[];
  moveParticlesOnHover?: boolean;
  particleHoverFactor?: number;
  alphaParticles?: boolean;
  particleBaseSize?: number;
  sizeRandomness?: number;
  cameraDistance?: number;
  disableRotation?: boolean;
  pixelRatio?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const pointerActiveRef = useRef(false);
  const lastPointerMoveRef = useRef(0);
  const themePaletteRef = useRef<string[]>(defaultColors);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      dpr: pixelRatio,
      depth: false,
      alpha: true,
    });

    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, cameraDistance);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      renderer.setSize(width, height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };

    window.addEventListener("resize", resize, false);
    resize();

    themePaletteRef.current = getThemePalette();

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

      mouseRef.current = { x, y };
      pointerActiveRef.current = true;
      lastPointerMoveRef.current = performance.now();
    };

    const handleMouseLeave = () => {
      pointerActiveRef.current = false;
      mouseRef.current = { x: 0, y: 0 };
    };

    if (moveParticlesOnHover) {
      window.addEventListener("pointermove", handleMouseMove);
      document.addEventListener("pointerleave", handleMouseLeave);
    }

    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);

    const palette = particleColors && particleColors.length > 0 ? particleColors : themePaletteRef.current;

    for (let i = 0; i < count; i++) {
      let x = 0;
      let y = 0;
      let z = 0;
      let len = 0;

      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      } while (len > 1 || len === 0);

      const r = Math.cbrt(Math.random());
      positions.set([x * r, y * r, z * r], i * 3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);

      const col = hexToRgb(palette[Math.floor(Math.random() * palette.length)]);
      colors.set(col, i * 3);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors },
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleBaseSize * pixelRatio },
        uSizeRandomness: { value: sizeRandomness },
        uAlphaParticles: { value: alphaParticles ? 1 : 0 },
      },
      transparent: true,
      depthTest: false,
    });

    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let animationFrameId = 0;
    let lastTime = performance.now();
    let elapsed = 0;

    const update = (time: number) => {
      animationFrameId = window.requestAnimationFrame(update);

      const delta = time - lastTime;
      lastTime = time;
      elapsed += delta * speed;

      const pointerActive = moveParticlesOnHover && time - lastPointerMoveRef.current < 80;
      pointerActiveRef.current = pointerActive;

      const targetX = pointerActive ? -mouseRef.current.x * particleHoverFactor : particles.position.x;
      const targetY = pointerActive ? -mouseRef.current.y * particleHoverFactor : particles.position.y;

      if (pointerActive) {
        particles.position.x += (targetX - particles.position.x) * 0.08;
        particles.position.y += (targetY - particles.position.y) * 0.08;
      }

      if (!disableRotation && pointerActive) {
        particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
        particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
        particles.rotation.z += 0.01 * speed;
      }

      renderer.render({ scene: particles, camera });
    };

    animationFrameId = window.requestAnimationFrame(update);

    return () => {
      window.removeEventListener("resize", resize);

      if (moveParticlesOnHover) {
        window.removeEventListener("pointermove", handleMouseMove);
        document.removeEventListener("pointerleave", handleMouseLeave);
      }

      window.cancelAnimationFrame(animationFrameId);

      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
    };
  }, [
    alphaParticles,
    cameraDistance,
    disableRotation,
    moveParticlesOnHover,
    particleBaseSize,
    particleCount,
    particleColors,
    particleHoverFactor,
    particleSpread,
    pixelRatio,
    sizeRandomness,
    speed,
  ]);

  return <div ref={containerRef} className={`particles-container ${className ?? ""}`} />;
}
