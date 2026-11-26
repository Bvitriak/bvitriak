"use client";

import { useCallback, useEffect, useState } from "react";
import type { Locale } from "@/content/translations";
import { translations } from "@/content/translations";
import styles from "./LoadingScreen.module.css";

const AMBIENT_READY_EVENT = "bvitriak-ambient-ready";
const READY_FALLBACK_MS = 6000;
const MINIMUM_VISIBLE_MS = 1050;
const REDUCED_MOTION_VISIBLE_MS = 180;
const EXIT_DURATION_MS = 520;
const INTRO_SESSION_KEY = "bvitriak-intro-seen";

type LoadingState = "loading" | "leaving" | "hidden";
type IntroWindow = Window & { bvitriakIntroPending?: boolean };

export function markIntroSeenBeforeLanguageSwitch() {
  const introWindow = window as IntroWindow;
  introWindow.bvitriakIntroPending = false;

  try {
    window.sessionStorage.setItem(INTRO_SESSION_KEY, "true");
  } catch {
    introWindow.bvitriakIntroPending = false;
  }
}

export function LoadingScreen({ locale }: { locale: Locale }) {
  const [state, setState] = useState<LoadingState>("loading");
  const copy = translations[locale].loading;
  const setLoadingScreenRef = useCallback((element: HTMLDivElement | null) => {
    if (!element) return;

    try {
      const hasSeenIntro = window.sessionStorage.getItem(INTRO_SESSION_KEY) === "true";
      const introWindow = window as IntroWindow;
      element.hidden = hasSeenIntro && introWindow.bvitriakIntroPending !== true;
    } catch {
      element.hidden = false;
    }
  }, []);

  useEffect(() => {
    const introWindow = window as IntroWindow;
    if (introWindow.bvitriakIntroPending !== true) {
      let hasSeenIntro = false;

      try {
        hasSeenIntro = window.sessionStorage.getItem(INTRO_SESSION_KEY) === "true";
      } catch {
        hasSeenIntro = false;
      }

      if (hasSeenIntro) return;

      introWindow.bvitriakIntroPending = true;
      try {
        window.sessionStorage.setItem(INTRO_SESSION_KEY, "true");
      } catch {
        introWindow.bvitriakIntroPending = true;
      }
    }

    let cancelled = false;
    let transitionTimer: number | undefined;
    let fallbackTimer: number | undefined;
    let onLoad: (() => void) | undefined;
    let onAmbientReady: (() => void) | undefined;
    const startedAt = performance.now();

    const pageReady = new Promise<void>((resolve) => {
      if (document.readyState === "complete") {
        resolve();
        return;
      }

      onLoad = () => resolve();
      window.addEventListener("load", onLoad, { once: true });
    });
    const ambientReady = new Promise<void>((resolve) => {
      if (document.documentElement.dataset.ambientReady === "true") {
        resolve();
        return;
      }

      onAmbientReady = () => resolve();
      window.addEventListener(AMBIENT_READY_EVENT, onAmbientReady, { once: true });
    });
    const fontsReady = document.fonts?.ready.catch(() => undefined) ?? Promise.resolve();
    const fallbackReady = new Promise<void>((resolve) => {
      fallbackTimer = window.setTimeout(resolve, READY_FALLBACK_MS);
    });

    void Promise.race([
      Promise.all([pageReady, ambientReady, fontsReady]),
      fallbackReady,
    ]).then(() => {
      if (cancelled) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const minimumVisibleMs = prefersReducedMotion
        ? REDUCED_MOTION_VISIBLE_MS
        : MINIMUM_VISIBLE_MS;
      const remainingVisibleMs = Math.max(
        minimumVisibleMs - (performance.now() - startedAt),
        0,
      );

      transitionTimer = window.setTimeout(() => {
        if (cancelled) return;
        setState("leaving");
        transitionTimer = window.setTimeout(
          () => {
            if (cancelled) return;
            introWindow.bvitriakIntroPending = false;
            setState("hidden");
          },
          prefersReducedMotion ? 30 : EXIT_DURATION_MS,
        );
      }, remainingVisibleMs);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(transitionTimer);
      if (onLoad) window.removeEventListener("load", onLoad);
      if (onAmbientReady) {
        window.removeEventListener(AMBIENT_READY_EVENT, onAmbientReady);
      }
    };
  }, []);

  if (state === "hidden") return null;

  return (
    <div
      ref={setLoadingScreenRef}
      className={
        state === "leaving"
          ? styles.loadingScreen + " " + styles.leaving
          : styles.loadingScreen
      }
      role="status"
      aria-label={copy.status}
    >
      <div className={styles.loadingLine} aria-hidden="true" />
      <div className={styles.loadingIdentity} aria-hidden="true">
        <span className={styles.loadingName}>Bvitriak</span>
        <span className={styles.loadingDescriptor}>{copy.portfolio}</span>
      </div>
    </div>
  );
}
