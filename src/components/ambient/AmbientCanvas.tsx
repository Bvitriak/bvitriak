"use client";

import { useEffect, useRef } from "react";
import type { WebGLRenderer } from "three";
import { fragmentShader, vertexShader } from "./shaders";
import styles from "./AmbientCanvas.module.css";

const AMBIENT_READY_EVENT = "bvitriak-ambient-ready";

function markAmbientReady() {
  document.documentElement.dataset.ambientReady = "true";
  window.dispatchEvent(new Event(AMBIENT_READY_EVENT));
}

export function AmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    let disposed = false;
    let detach = () => {};

    async function initialize(canvas: HTMLCanvasElement, host: HTMLElement) {
      let THREE: typeof import("three");
      try {
        THREE = await import("three");
      } catch {
        if (!disposed) markAmbientReady();
        return;
      }
      if (disposed) return;

      let renderer: WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: false,
          alpha: false,
          powerPreference: "low-power",
        });
      } catch {
        markAmbientReady();
        return;
      }

      const scene = new THREE.Scene();
      const camera = new THREE.Camera();
      const isSmallScreen = () => window.matchMedia("(max-width: 680px)").matches;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const bounds = host.getBoundingClientRect();
      const uniforms = {
        uResolution: {
          value: new THREE.Vector2(Math.max(bounds.width, 1), Math.max(bounds.height, 1)),
        },
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uLight: {
          value: document.documentElement.dataset.theme === "light" ? 1 : 0,
        },
      };
      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
      });

      scene.add(new THREE.Mesh(geometry, material));

      let animationFrame = 0;
      let lastFrame = -Infinity;
      let contextLost = false;
      const startTime = performance.now();

      function resize() {
        if (contextLost) return;
        const { width, height } = host.getBoundingClientRect();
        if (width < 1 || height < 1) return;

        const pixelRatio = Math.min(
          window.devicePixelRatio || 1,
          isSmallScreen() ? 1.5 : 2,
        );
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(width, height, false);
        uniforms.uResolution.value.set(width, height);
        refresh();
      }

      function draw(timestamp: number) {
        if (disposed || contextLost || document.hidden) return;

        if (reducedMotion.matches || !isSmallScreen() || timestamp - lastFrame >= 32) {
          lastFrame = timestamp;
          uniforms.uTime.value = reducedMotion.matches ? 0 : (timestamp - startTime) / 1000;
          renderer.render(scene, camera);
          if (!host.hasAttribute("data-canvas-ready")) {
            host.setAttribute("data-canvas-ready", "");
            markAmbientReady();
          }
        }

        if (!reducedMotion.matches) {
          animationFrame = window.requestAnimationFrame(draw);
        }
      }

      function refresh() {
        window.cancelAnimationFrame(animationFrame);
        lastFrame = -Infinity;
        draw(performance.now());
      }

      function onContextLost(event: Event) {
        event.preventDefault();
        contextLost = true;
        host.removeAttribute("data-canvas-ready");
        refresh();
        markAmbientReady();
      }

      function onContextRestored() {
        contextLost = false;
        resize();
      }

      function onScroll() {
        uniforms.uScroll.value = Math.min(
          window.scrollY / Math.max(window.innerHeight, 1),
          4,
        );
      }

      const themeObserver = new MutationObserver(() => {
        uniforms.uLight.value = document.documentElement.dataset.theme === "light" ? 1 : 0;
        if (reducedMotion.matches) refresh();
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
      const resizeObserver =
        typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
      resizeObserver?.observe(host);

      window.addEventListener("resize", resize, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("pageshow", refresh);
      document.addEventListener("visibilitychange", refresh);
      reducedMotion.addEventListener("change", refresh);
      canvas.addEventListener("webglcontextlost", onContextLost);
      canvas.addEventListener("webglcontextrestored", onContextRestored);

      onScroll();
      resize();

      detach = () => {
        window.cancelAnimationFrame(animationFrame);
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pageshow", refresh);
        document.removeEventListener("visibilitychange", refresh);
        reducedMotion.removeEventListener("change", refresh);
        canvas.removeEventListener("webglcontextlost", onContextLost);
        canvas.removeEventListener("webglcontextrestored", onContextRestored);
        host.removeAttribute("data-canvas-ready");
        resizeObserver?.disconnect();
        themeObserver.disconnect();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    }

    void initialize(canvas, host);

    return () => {
      disposed = true;
      detach();
    };
  }, []);

  return (
    <div className={styles.background} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
