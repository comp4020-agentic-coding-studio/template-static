# COMP4020 static prototype template

A starter template for static-site prototypes in **COMP4020 / COMP8020 Agentic
Coding Studio**. Click **Use this template** to create your own repo, build your
prototype, and deploy it to GitHub Pages.

## First time: turn on Pages

GitHub Pages isn't enabled automatically on a new repo. Once, after you create
yours: **Settings → Pages → Build and deployment → Source → GitHub Actions.**
After that, every push to `main` builds and deploys, and the deploy step prints
your live URL and checks it returns 200.

## Quick start

```sh
pnpm install
pnpm dev        # local dev server
pnpm check      # most of what CI runs (links, secrets and deploy are CI-only)
pnpm build      # produce dist/ (what gets deployed)
```

## What's here

- `index.html`, `styles.css`, `main.ts` --- a minimal starting site. Replace it.
- `spec/` --- what the checks are for (`README.md`) and the shipped invariants
  (`invariants.test.ts`); your own spec tests live alongside them.
- `CLAUDE.md` --- orients your coding agent: what the checks mean and how to
  work here. Yours to grow.
- `PROCESS.md` --- a template for your process overview, showing the
  cited-moment format. Replace it with your own; `pnpm check:evidence` verifies
  your citations resolve.
- `.github/workflows/checks.yml` --- the CI sensors that run on every push, and
  the GitHub Pages deploy.
- `.githooks/pre-commit` --- blocks any commit that contains something shaped
  like an API key, so your COMP4020 key can't end up in a public repo. Installed
  automatically by `pnpm install`.

This template is SSG-agnostic: it's plain HTML/CSS/TypeScript on Vite, so you
can add Astro, Eleventy, or any static generator later without changing how it
deploys. TypeScript is the course default over plain JavaScript: the types are
extra backpressure, and your agent feels it before you do.

See the course site for how the checks map to each week of the course.
