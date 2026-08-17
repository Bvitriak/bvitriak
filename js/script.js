/* =========================================================================
   script.js — home page interactions
     1. Intro — reveal the content once the background has played through once.
     2. Music toggle — a faithful two-state control (music off ⇄ music on)
        that also drives an optional <audio> track when one is supplied.
   ========================================================================= */
(function () {
    "use strict";

    /* ---------------------------------------------------------------------
       1. Intro reveal
       The background webp plays a single ~2.5s pass (dark → lit) and freezes
       on its final lit frame; only then do the title, nav and footer appear.
       --------------------------------------------------------------------- */
    var home = document.querySelector(".home");
    var bg = document.querySelector(".home__bg img");
    var INTRO_MS = 2510; // one play-through of the background animation
    var reduce = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function reveal() {
        if (!home) return;
        home.removeAttribute("inert");   // interaction was blocked during intro
        home.classList.add("is-revealed");
    }

    if (home && !reduce) {
        // Block clicks/focus on the (invisible) links while the intro plays.
        home.setAttribute("inert", "");

        var startCountdown = function () {
            window.setTimeout(reveal, INTRO_MS);
        };

        if (bg && !bg.complete) {
            bg.addEventListener("load", startCountdown, { once: true });
            bg.addEventListener("error", startCountdown, { once: true });
            // Safety net in case the load event never arrives.
            window.setTimeout(reveal, INTRO_MS + 5000);
        } else {
            startCountdown();
        }
    }
    // Reduced-motion users skip the intro; CSS shows everything immediately.

    /* ---------------------------------------------------------------------
       2. Music toggle
       --------------------------------------------------------------------- */
    var button = document.querySelector(".home__music");
    if (!button) return;

    var stateEl = button.querySelector(".home__music-state");
    var audio = document.querySelector(".home__audio");
    var wantsMusic = false;

    function setLabel(on) {
        if (stateEl) stateEl.textContent = on ? "on" : "off";
        button.setAttribute("aria-pressed", on ? "true" : "false");
    }

    function toggle() {
        wantsMusic = !wantsMusic;
        setLabel(wantsMusic);

        if (!audio) return;

        if (wantsMusic) {
            // play() rejects when no playable source exists — the label still
            // flips so the control stays true to the design; audio is a bonus.
            var attempt = audio.play();
            if (attempt && typeof attempt.catch === "function") {
                attempt.catch(function () { /* no track available — stay silent */ });
            }
        } else {
            audio.pause();
        }
    }

    button.addEventListener("click", toggle);

    // Pulse the label only while a track is genuinely playing.
    if (audio) {
        audio.addEventListener("playing", function () {
            button.classList.add("is-playing");
        });
        audio.addEventListener("pause", function () {
            button.classList.remove("is-playing");
        });
        audio.addEventListener("ended", function () {
            button.classList.remove("is-playing");
        });
    }
}());
