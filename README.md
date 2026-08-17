# Bvitriak — Portfolio

Home (landing) page for **Bvitriak**, an independent game reviewer and content
creator. A pixel-art night-city scene with an animated sky/city, a welcome
title, and a menu into the rest of the portfolio.

Built to match the Figma design in three breakpoints (desktop, tablet, mobile).

## Tech stack

- HTML5 (`index.html`)
- Modular CSS (`css/style.css` base + tokens, `css/home.css` page layout)
- Vanilla JavaScript (`js/script.js`)
- Font: [VT323](https://fonts.google.com/specimen/VT323) (Google Fonts)

## Project structure

```text
.
├── index.html
├── css
│   ├── style.css        # reset, design tokens (colours, glows), typography
│   └── home.css         # home page layout + responsive breakpoints + motion
├── js
│   └── script.js        # music on/off toggle
├── img
│   ├── bg
│   │   ├── home-bg.webp        # animated night-city background (all breakpoints)
│   │   └── home-bg-poster.jpg  # static first frame (poster / fallback)
│   └── favicon                 # logo favicons (.ico, 16/32 png, apple-touch)
└── .gitignore
```

## Responsive breakpoints

The layout follows the three Figma frames:

| Range        | Layout                                                          |
| ------------ | -------------------------------------------------------------- |
| `< 768px`    | Mobile — title, nav and footer all centred, stacked vertically |
| `≥ 768px`    | Tablet — title top-left, nav vertically-centred on the right   |
| `≥ 1200px`   | Desktop — same as tablet, scaled up to the 1920×1080 design    |

## Background asset

The Figma design supplies the background as a single **1920×1080 animated
GIF** (~16.8 MB) shared across all three breakpoints. It was converted to an
**animated WebP** (`gif2webp -lossy`), which is visually identical (8 distinct
frames) but only **~197 KB** — a ~99% reduction. A static JPG of one lit frame
(`home-bg-poster.jpg`) is the poster / no-WebP fallback, and is also served to
visitors who prefer reduced motion.

### Intro

The background plays through **once** (dark → lit) and freezes on its final lit
frame — the loop count is set to 1 (`webpmux -set loop 1`). The title, nav and
footer stay hidden (and the page is `inert`) until that ~2.5s play-through
finishes, then they fade in. Reduced-motion visitors skip the intro: they get
the static poster and see everything immediately.

## Notes / next steps

- **Navigation** links point to in-page anchors (`#about`, `#works`, `#socials`,
  `#certificates`) as placeholders. Repoint them to the real pages/sections as
  those are built.
- **Music toggle** is fully wired but silent until a track is added: drop an
  audio file in the project and uncomment the `<source>` inside the
  `<audio class="home__audio">` element in `index.html`.

## Local preview

Any static file server works, e.g.:

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

## License

MIT LICENSE
