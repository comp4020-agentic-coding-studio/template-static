# Process overview

<!-- TEMPLATE: this file is a shape to fill in, not a form. Replace everything
     in it with your own overview, and delete this comment — `pnpm
     check:process` will remind you if it's still here. -->

A reading-guide to how the work came together --- a map to your process, not an
essay about it. Markers read this file and follow its citations; they don't
trawl the repo for evidence you didn't point at, so if a moment mattered, cite
it.

## What I built

One paragraph: the thing, and the idea behind it.

## The moments that mattered

The moments that mattered (three to five for an assignment; fewer is fine for a
weekly prototype), each pointing at the record: a commit or commit range, a
`CLAUDE.md` change, a check that went from red to green, a prompt paired with
the commit it produced. At least one should be a **correction** --- something
the agent got wrong and what you did about it.

Cite each moment as a link whose text is the commit hash or range and whose
target is this repo's commit or compare URL, so a reader clicks straight to the
evidence:

- one commit: [`a1b2c3d`](https://github.com/YOUR-ORG/YOUR-REPO/commit/a1b2c3d)
- a range:
  [`a1b2c3d...e4f5a6b`](https://github.com/YOUR-ORG/YOUR-REPO/compare/a1b2c3d...e4f5a6b)

To pair a prompt with the commit it produced, quote the prompt (curated, not a
full transcript) next to the citation:

> the prompt, verbatim

`pnpm check:process` verifies your citations resolve to real commits before you
ship.
