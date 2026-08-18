(function () {
    "use strict";

    var home = document.querySelector(".home");
    var background = document.querySelector(".home__bg img");
    var INTRO_MS = 2510;
    var ENTRANCE_MS = 1400;
    var reducedMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function reveal() {
        if (!home) return;
        home.classList.add("is-revealed");
        window.setTimeout(function () {
            home.removeAttribute("inert");
        }, ENTRANCE_MS);
    }

    if (home && !reducedMotion) {
        home.setAttribute("inert", "");

        var startCountdown = function () {
            window.setTimeout(reveal, INTRO_MS);
        };

        if (background && !background.complete) {
            background.addEventListener("load", startCountdown, { once: true });
            background.addEventListener("error", startCountdown, { once: true });
            window.setTimeout(reveal, INTRO_MS + 5000);
        } else {
            startCountdown();
        }
    }

    var button = document.querySelector(".home__music");
    if (!button) return;

    var stateElement = button.querySelector(".home__music-state");
    var audio = document.querySelector(".home__audio");
    var wantsMusic = false;

    var PLAYLIST = [
        "audio/i-dont-want-to-set-the-world-on-fire.mp3",
        "audio/into-each-life-some-rain-must-fall.mp3",
        "audio/maybe.mp3",
        "audio/well-meet-again.mp3"
    ];
    var order = [];
    var position = 0;

    function reshuffle() {
        var lastPlayed = order.length ? order[order.length - 1] : -1;

        order = [];
        for (var trackIndex = 0; trackIndex < PLAYLIST.length; trackIndex++) {
            order.push(trackIndex);
        }

        for (var index = order.length - 1; index > 0; index--) {
            var swapIndex = Math.floor(Math.random() * (index + 1));
            var temporary = order[index];
            order[index] = order[swapIndex];
            order[swapIndex] = temporary;
        }

        if (order.length > 1 && order[0] === lastPlayed) {
            order.push(order.shift());
        }

        position = 0;
    }

    function loadCurrent() {
        if (audio) audio.src = PLAYLIST[order[position]];
    }

    function nextTrack() {
        position++;
        if (position >= order.length) reshuffle();
        loadCurrent();
    }

    function play() {
        if (!audio) return;
        if (!order.length) {
            reshuffle();
            loadCurrent();
        }
        var attempt = audio.play();
        if (attempt && typeof attempt.catch === "function") {
            attempt.catch(function () {});
        }
    }

    function setLabel(isOn) {
        if (stateElement) stateElement.textContent = isOn ? "on" : "off";
        button.setAttribute("aria-pressed", isOn ? "true" : "false");
    }

    function toggle() {
        wantsMusic = !wantsMusic;
        setLabel(wantsMusic);

        if (!audio) return;

        if (wantsMusic) {
            play();
        } else {
            audio.pause();
        }
    }

    button.addEventListener("click", toggle);

    if (audio) {
        audio.addEventListener("playing", function () {
            button.classList.add("is-playing");
        });
        audio.addEventListener("pause", function () {
            button.classList.remove("is-playing");
        });
        audio.addEventListener("ended", function () {
            nextTrack();
            if (wantsMusic) play();
        });
    }
}());
