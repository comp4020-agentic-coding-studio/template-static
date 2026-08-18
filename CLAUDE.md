# COMP4020 prototype

Your starter repo for a COMP4020 prototype: a static site in HTML/CSS/TypeScript
that builds to plain HTML/CSS/JS and deploys to GitHub Pages. The deployed site
is what gets marked, not this repo.

The
[course website](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/)
publishes this deliverable's brief and spec, and this repo's name tells you
which deliverable applies. Read both before you plan or build.

## How to work in here

- Keep the dev server running (`pnpm dev`) so you see changes as you make them.
- Run `pnpm check` before you push.
- Open the page in a browser and look at it. The rendered page is the truth;
  your mental model of it isn't.
- When a check fails, read its output before you change anything.
- Never commit a red state.

## The link-preview card

`public/card.png` is the image people see when a link to the site is shared, and
`index.html`'s head points at it. Both are placeholders: replace the picture
(keep it 1200x630) and the `description` meta, and copy the same head block into
any new page you write. The invariants check the tags are there and that the
card resolves to a file the build emitted, not that either is any good.

The card URL is resolved against the page that names it, exactly like any other
link --- so `./card.png` is right for a page at the site root and wrong one
directory down, which the invariants will catch. The course gallery resolves it
that way; some chat platforms only honour an absolute URL, so off-site previews
are best-effort.

## The checks

`typecheck`, `build`, `deploy`, `spec`, `lint`, `tests`, `evidence`, `links`,
`secrets`. Run `pnpm check`. Read the failure.

`spec/README.md`, `PROCESS.md` and `reflections/README.md` are in this repo and
say what they are for.

## This file is yours

A starting point, not a rulebook. As you learn what your prototype needs --- a
convention the work has to hold to, a sensor that keeps catching you out, a fact
about the stack that is easy to get wrong --- write it down here. Growing this
file is the work.
