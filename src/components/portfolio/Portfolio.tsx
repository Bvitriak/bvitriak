"use client";

import Link from "next/link";
import { useEffect, type MouseEvent } from "react";
import { AmbientCanvas } from "@/components/ambient/AmbientCanvas";
import { projects } from "@/content/projects";
import type { Locale, MonthKey } from "@/content/translations";
import { translations } from "@/content/translations";
import { LoadingScreen, markIntroSeenBeforeLanguageSwitch } from "./LoadingScreen";
import { PageMotion } from "./PageMotion";
import styles from "./Portfolio.module.css";
import {
  SectionNavigation,
  useActiveSection,
} from "./SectionNavigation";
import { ThemeToggle } from "./ThemeToggle";

const socialLinks = [
  { label: "X", href: "https://x.com/Bitriak" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/bvitriak" },
  { label: "GitHub", href: "https://github.com/Bvitriak" },
  { label: "Figma", href: "https://www.figma.com/@bitriak" },
];

function handleLanguageSwitch(event: MouseEvent<HTMLAnchorElement>) {
  if (
    event.button !== 0 ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  ) {
    return;
  }

  markIntroSeenBeforeLanguageSwitch();
}

export function Portfolio({ locale }: { locale: Locale }) {
  const copy = translations[locale];
  const activeSection = useActiveSection();
  const sectionLabel = {
    home: copy.navigation.index,
    projects: copy.navigation.projects,
    contact: copy.navigation.contact,
  }[activeSection];

  useEffect(() => {
    const preventClipboardCopy = (event: ClipboardEvent) => event.preventDefault();

    document.addEventListener("copy", preventClipboardCopy, true);
    document.addEventListener("cut", preventClipboardCopy, true);

    return () => {
      document.removeEventListener("copy", preventClipboardCopy, true);
      document.removeEventListener("cut", preventClipboardCopy, true);
    };
  }, []);

  return (
    <>
      <LoadingScreen key={locale} locale={locale} />
      <a className="skip-link" href="#main-content">
        {copy.skip}
      </a>

      <div className={styles.page} id="top">
        <div className={styles.topBand} aria-hidden="true" />
        <div className={styles.frame}>
          <AmbientCanvas />
          <aside className={styles.sidebar}>
            <div className={styles.identity}>
              <h1 className={styles.name}>Bvitriak</h1>
              <span className={styles.role}>{copy.hero.role}</span>
            </div>

            <SectionNavigation locale={locale} />
          </aside>

          <main
            className={styles.stage}
            id="main-content"
            aria-label={sectionLabel}
            data-section={activeSection}
          >
            {activeSection === "home" && (
              <section
                className={styles.panelSection + " " + styles.homePanel}
                aria-labelledby="home-title"
              >
                <h2 className={styles.visuallyHidden} id="home-title">
                  {copy.navigation.index}
                </h2>
                <p className={styles.homeStatement} data-motion>
                  {copy.hero.statement}
                </p>
              </section>
            )}

            {activeSection === "projects" && (
              <section className={styles.panelSection} aria-label={copy.navigation.projects}>
                <ol className={styles.projectList}>
                  {projects.map((project) => (
                    <li key={project.name}>
                      <div className={styles.projectRow} data-motion>
                        <a
                          className={styles.projectLink}
                          href={project.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={project.name + ": " + copy.projects.open}
                        >
                          <span className={styles.projectName}>{project.name}</span>
                        </a>
                        <span className={styles.projectMeta}>
                          <time dateTime={project.date.iso}>
                            {copy.projects.months[
                              project.date.iso.slice(5, 7) as MonthKey
                            ]}
                            .{project.date.iso.slice(2, 4)}
                          </time>
                          <span aria-hidden="true">/</span>
                          <span>{copy.projects.roles[project.role]}</span>
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {activeSection === "contact" && (
              <section
                className={styles.panelSection + " " + styles.contactPanel}
                aria-label={copy.navigation.contact}
              >
                <nav
                  className={styles.contactSocials}
                  aria-label={copy.contact.linksLabel}
                >
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      className={styles.socialLink}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      data-motion
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </section>
            )}
          </main>

        </div>

        <div className={styles.sideControls}>
          <nav className={styles.language} aria-label={copy.language.label}>
            <Link
              href={"/#" + activeSection}
              onClick={handleLanguageSwitch}
              aria-current={locale === "en" ? "page" : undefined}
              aria-label={copy.language.english}
            >
              EN
            </Link>
            <Link
              href={"/ru/#" + activeSection}
              onClick={handleLanguageSwitch}
              aria-current={locale === "ru" ? "page" : undefined}
              aria-label={copy.language.russian}
            >
              RU
            </Link>
          </nav>
          <ThemeToggle locale={locale} />
        </div>

        <footer className={styles.footer}>
          <span>© 2026 Bvitriak</span>
        </footer>
      </div>

      <PageMotion section={activeSection} />
    </>
  );
}
