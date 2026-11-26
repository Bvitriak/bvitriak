"use client";

import { useSyncExternalStore } from "react";
import type { Locale } from "@/content/translations";
import { translations } from "@/content/translations";
import styles from "./Portfolio.module.css";

export const sectionIds = ["home", "projects", "contact"] as const;
export type SectionId = (typeof sectionIds)[number];

function subscribeToSection(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener("hashchange", callback);
  window.addEventListener("bvitriak-section-change", callback);

  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("bvitriak-section-change", callback);
  };
}

function getSectionSnapshot(): SectionId {
  const hash = window.location.hash.slice(1);
  if (hash === "info") return "contact";
  return sectionIds.includes(hash as SectionId) ? (hash as SectionId) : "home";
}

function getServerSectionSnapshot(): SectionId {
  return "home";
}

export function useActiveSection() {
  return useSyncExternalStore(
    subscribeToSection,
    getSectionSnapshot,
    getServerSectionSnapshot,
  );
}

export function navigateToSection(section: SectionId) {
  const currentHash = window.location.hash;
  const nextHash = section === "home" ? "" : "#" + section;
  if (currentHash === nextHash) return;

  const nextUrl =
    section === "home"
      ? window.location.pathname + window.location.search
      : nextHash;
  window.history.pushState(null, "", nextUrl);
  window.dispatchEvent(new Event("bvitriak-section-change"));
}

export function SectionNavigation({ locale }: { locale: Locale }) {
  const activeSection = useActiveSection();
  const copy = translations[locale];
  const labels: { id: SectionId; label: string }[] = [
    { id: "home", label: copy.navigation.index },
    { id: "projects", label: copy.navigation.projects },
    { id: "contact", label: copy.navigation.contact },
  ];

  return (
    <nav className={styles.navigation} aria-label={copy.navigation.label}>
      {labels.map(({ id, label }) =>
        activeSection === id ? (
          <span
            key={id}
            className={styles.navigationCurrent}
            aria-hidden="true"
          >
            <span className={styles.navigationLabel}>{label}</span>
          </span>
        ) : (
          <a
            key={id}
            className={styles.navigationLink}
            href={"#" + id}
            aria-label={label}
            onClick={(event) => {
              event.preventDefault();
              navigateToSection(id);
            }}
          >
            <span className={styles.navigationLabel}>{label}</span>
          </a>
        ),
      )}
    </nav>
  );
}
