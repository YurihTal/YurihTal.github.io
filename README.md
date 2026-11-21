# yurihtal.github.io

Portfolio of **Yuri Hlebanja** — 5-axis CNC programmer, CAD/CAM designer and AI-for-manufacturing developer.
Live at **https://yurihtal.github.io**.

## Stack
Hand-written HTML, CSS and vanilla JavaScript. No dependencies, no build step — GitHub Pages serves the files as-is (`.nojekyll`).

```
index.html      single page: hero, about, experience, engineering, software, skills, education, contact
css/site.css    design tokens (dark + light), layout, components, motion (CSS @layer)
js/main.js      theme toggle, nav, mobile menu, scroll-spy, copy email
js/motion.js    hero intro, scroll reveals, timeline progress (progressive enhancement)
img/            project images (WebP + JPEG fallback)
v2/             redirect from the old preview URL to /
```

## Design notes
- "Toolpath" concept: blueprint grid, G-code section labels (`N10`…`M30`), GD&T-style metric frames.
- Dark theme by default, follows the OS until the visitor chooses; choice persisted in `localStorage`.
- Motion only runs when `prefers-reduced-motion` is not set, and never hides content if JavaScript fails.

## Editing
Edit `index.html` directly and push to `main`; Pages redeploys in ~1–2 minutes.
Previous site is tagged `v1-final`.
