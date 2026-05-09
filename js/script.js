(() => {
    "use strict";

    const qs = (sel, root = document) => root.querySelector(sel);
    const qsa = (sel, root = document) =>
        Array.from(root.querySelectorAll(sel));

    const clamp = (value, min, max) =>
        Math.min(max, Math.max(min, value));

    function initSmoothScroll() {
        qsa('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", (e) => {
                const href = anchor.getAttribute("href");
                if (!href || href === "#") return;

                const target = qs(href);
                if (!target) return;

                e.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            });
        });
    }

    function initHeaderParallax() {
        const header = qs("header");
        if (!header) return;

        const maxOffset = 80;
        const maxBlur = 4;

        const onScroll = () => {
            const y =
                window.pageYOffset || document.documentElement.scrollTop;
            const ratio = clamp(y / 300, 0, 1);

            header.style.transform = `translateY(${ratio * -maxOffset}px)`;
            header.style.opacity = String(1 - ratio * 0.25);
            header.style.backdropFilter = `blur(${ratio * maxBlur}px)`;
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    }

    function initSectionReveal() {
        const revealables = [
            ...qsa("section"),
            ...qsa(".channel-block"),
            ...qsa(".about-block"),
            ...qsa(".contact-block"),
        ];

        if (!revealables.length) return;

        revealables.forEach((el) => {
            el.classList.add("reveal-init");
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("reveal-in");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        revealables.forEach((el) => observer.observe(el));
    }

    function initActiveSectionHighlight() {
        const sections = qsa("section[id]");
        if (!sections.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const id = entry.target.id;
                    if (!id) return;

                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-active");
                    } else {
                        entry.target.classList.remove("is-active");
                    }
                });
            },
            { threshold: 0.4 }
        );

        sections.forEach((section) => observer.observe(section));
    }
    
    function initBackToTop() {
        const btn = document.createElement("button");
        btn.className = "back-to-top";
        btn.type = "button";
        btn.setAttribute("aria-label", "Back to top");
        btn.textContent = "↑";
        document.body.appendChild(btn);

        const toggleVisibility = () => {
            const y =
                window.pageYOffset || document.documentElement.scrollTop;
            if (y > 320) {
                btn.classList.add("visible");
            } else {
                btn.classList.remove("visible");
            }
        };

        btn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        window.addEventListener("scroll", toggleVisibility, { passive: true });
        toggleVisibility();
    }

    function prefersReducedMotion() {
        return window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    window.addEventListener("DOMContentLoaded", () => {
        initSmoothScroll();
        initHeaderParallax();
        initActiveSectionHighlight();
        initBackToTop();

        if (!prefersReducedMotion()) {
            initSectionReveal();
        }

        const yearEl = document.querySelector(".year");
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }
    });
})();
