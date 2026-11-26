"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { Locale } from "@/content/translations";
import { translations } from "@/content/translations";
import styles from "./Portfolio.module.css";

type Theme = "dark" | "light";

function subscribeToTheme(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== "bvitriak-theme") return;
    document.documentElement.dataset.theme = event.newValue === "light" ? "light" : "dark";
    callback();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener("bvitriak-theme-change", callback);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("bvitriak-theme-change", callback);
  };
}

function getThemeSnapshot(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function getServerThemeSnapshot(): Theme {
  return "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  window.dispatchEvent(new Event("bvitriak-theme-change"));
  try {
    window.localStorage.setItem("bvitriak-theme", theme);
  } catch {
    return;
  }
}

export function ThemeToggle({ locale }: { locale: Locale }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const copy = translations[locale];

  useEffect(() => {
    let storedTheme: string | null;
    try {
      storedTheme = window.localStorage.getItem("bvitriak-theme");
    } catch {
      return;
    }

    if (storedTheme === "light" || storedTheme === "dark") {
      document.documentElement.dataset.theme = storedTheme;
      window.dispatchEvent(new Event("bvitriak-theme-change"));
    }
  }, []);

  return (
    <div className={styles.themeOptions} role="group" aria-label={copy.theme.label}>
      {(["dark", "light"] as const).map((option) => (
        <button
          className={styles.themeOption}
          key={option}
          type="button"
          aria-pressed={theme === option}
          onClick={() => applyTheme(option)}
        >
          <span className={styles.themeSwatch} aria-hidden="true" />
          <span>{copy.theme[option]}</span>
        </button>
      ))}
    </div>
  );
}
