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
    const canvasRefValue = canvasRef.current;
    if (!canvasRefValue) return;
    const canvasElement: HTMLCanvasElement = canvasRefValue;
    const hostElement = canvasElement.parentElement as HTMLElement;
    if (!hostElement) return;

    let disposed = false;
    let detach = () => {};

    async function initialize() {
      let THREE: typeof import("three");
      try {
        THREE = await import("three");
      } catch {
        canvasElement.hidden = true;
        markAmbientReady();
        return;
      }
      if (disposed) return;

      let renderer: WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas: canvasElement,
          antialias: false,
          alpha: false,
          powerPreference: "low-power",
        });
      } catch {
        canvasElement.hidden = true;
        markAmbientReady();
        return;
      }

      const scene = new THREE.Scene();
      const camera = new THREE.Camera();
      const isSmallScreen = () => window.matchMedia("(max-width: 680px)").matches;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const bounds = hostElement.getBoundingClientRect();
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
      let lastMobileFrame = 0;
      let hasRendered = false;

      function resize() {
        const { width, height } = hostElement.getBoundingClientRect();
        if (width < 1 || height < 1) return;

        const pixelRatio = Math.min(
          window.devicePixelRatio || 1,
          isSmallScreen() ? 1.5 : 2,
        );
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(width, height, false);
        uniforms.uResolution.value.set(width, height);
        if (reducedMotion.matches) draw(0);
      }

      function draw(timestamp: number) {
        if (disposed) return;

        if (isSmallScreen() && timestamp - lastMobileFrame < 32) {
          animationFrame = window.requestAnimationFrame(draw);
          return;
        }

        lastMobileFrame = timestamp;
        uniforms.uTime.value = reducedMotion.matches ? 0 : timestamp * 0.001;
        renderer.render(scene, camera);
        if (!hasRendered) {
          hasRendered = true;
          markAmbientReady();
        }

        if (!reducedMotion.matches && !document.hidden) {
          animationFrame = window.requestAnimationFrame(draw);
        }
      }

      function onScroll() {
        uniforms.uScroll.value = Math.min(
          window.scrollY / Math.max(window.innerHeight, 1),
          4,
        );
      }

      function onVisibilityChange() {
        window.cancelAnimationFrame(animationFrame);
        if (!document.hidden) draw(reducedMotion.matches ? 0 : performance.now());
      }

      function onMotionChange() {
        window.cancelAnimationFrame(animationFrame);
        draw(reducedMotion.matches ? 0 : performance.now());
      }

      const themeObserver = new MutationObserver(() => {
        uniforms.uLight.value = document.documentElement.dataset.theme === "light" ? 1 : 0;
        if (reducedMotion.matches) draw(0);
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
      const resizeObserver =
        typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
      resizeObserver?.observe(hostElement);

      window.addEventListener("resize", resize, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("visibilitychange", onVisibilityChange);
      reducedMotion.addEventListener("change", onMotionChange);

      resize();
      onScroll();
      draw(reducedMotion.matches ? 0 : performance.now());

      detach = () => {
        window.cancelAnimationFrame(animationFrame);
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        reducedMotion.removeEventListener("change", onMotionChange);
        resizeObserver?.disconnect();
        themeObserver.disconnect();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    }

    void initialize();

    return () => {
      disposed = true;
      detach();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
