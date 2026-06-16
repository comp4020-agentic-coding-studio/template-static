# COMP4020 static prototype template

A starter template for static-site prototypes in **COMP4020 / COMP8020 Agentic
Coding Studio**. Click **Use this template** to create your own repo, build your
prototype, and deploy it to GitHub Pages.

## Quick start

```sh
pnpm install
pnpm dev        # local dev server
pnpm check      # run the same checks CI runs
pnpm build      # produce dist/ (what gets deployed)
```

## What's here

- `index.html`, `styles.css`, `main.js` --- a minimal starting site. Replace it.
- `spec/` --- the brief (`README.md`) and the conformance test (`spec.test.js`)
  for this instance. The brief is what you're building; the test checks it.
- `CLAUDE.md` --- orients your coding agent: what the checks mean and how to
  work here. Yours to grow.
- `.github/workflows/checks.yml` --- the CI sensors that run on every push, and
  the GitHub Pages deploy.

This template is SSG-agnostic: it's plain HTML/CSS/JS on Vite, so you can add
Astro, Eleventy, or any static generator later without changing how it deploys.

See the course site for how the checks map to each week of the course.
