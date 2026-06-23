# COMP4020 prototype

This is your starter repo for a COMP4020 prototype: a static site that builds to
plain HTML/CSS/JS and deploys to GitHub Pages. The **deployed site is what gets
marked** --- not this repo, and not "it works on my machine". It's marked live
in Chrome at 1920×1080 against the deployed URL, so make that artefact good and
use the checks below to know whether it is.

What you're building this week is in `spec/README.md` (the brief), and
`spec/spec.test.js` checks the contracts that brief promises. Read the brief
first.

## How to work in here

- Keep the dev server running (`pnpm dev`) so you see changes as you make them.
- Before you push, run `pnpm check`. It runs most of what CI runs --- build,
  lint, format, and the spec --- so you catch those in seconds instead of
  waiting for the pipeline. The links, secrets, and deploy checks only run in
  CI.
- To see what the page actually looks like rather than what you assume it looks
  like, open it with `agent-browser`. The rendered page is the truth; your
  mental model of it isn't.
- When a check fails, read its output before changing anything. Each check below
  names what it measures, and the failure message is the instruction: it tells
  you the file, the line, or the contract. Treat a red check as authoritative
  --- the page is wrong until the check is green, not until you decide it should
  be.
- Commit when the checks pass. Never commit a red state.

## The checks (your sensors)

CI runs these on every push and reports each one separately. They aren't hoops.
Each is a different way of finding out something true about the site that you
can't reliably see by looking at it.

- **build** --- the site must build (`pnpm build`). A build failure means the
  deployed site is broken or stale, so nothing else matters until this is green.
- **deploy / online** --- the live GitHub Pages URL must load and return the
  page you expect. An asset that 404s on the deployed URL counts as broken even
  if it loads locally.
- **spec** --- `spec/spec.test.js` checks the contracts in this week's brief. A
  failure names the contract you haven't met yet.
- **lint** --- `stylelint` for CSS, `oxlint` for JS. Flags code that's wrong,
  fragile, or non-idiomatic. Read the rule it names.
- **format** --- `oxfmt` keeps the code consistently formatted. Cosmetic, but it
  keeps diffs honest.
- **tests** --- any tests you write must pass. A failing test is a claim about
  the site that's no longer true.
- **links** --- internal links must resolve. A broken link is a dead end you
  didn't mean to ship.
- **secrets** --- the repo is scanned for committed credentials. Never put a
  key, token, or password in a tracked file. If one leaks, rotate it.

Two more sensors --- **accessibility** (`axe-core`) and **performance**
(Lighthouse) --- arrive in week 6, when we cover them. When they do, read a
green performance result honestly: it's a lab estimate from one run on a CI
machine, not proof the site is fast for real users.

## Your process is part of the mark

The deployed page is only half of it. How you got there is marked too: your
commit history, your agent files, and the decisions visible across them. The
checks above can't see any of that, so a person reads it directly --- which
means building legibly is part of building well.

- **Commit as you go.** Small, frequent commits are the record of how the work
  came together, and that record is read, not just the final state. A trail that
  grew alongside the code is the strongest evidence of your process; a single
  dump the night before is the weakest.
- **Keep a process overview** (`OVERVIEW.md`, or a clearly-marked section of
  your `README.md`). A short reading-guide, not an essay: what you built, which
  decisions mattered, and where to look in the history. It points a marker at
  the evidence; it doesn't stand in for it.
- **Publish your weekly reflection at `/reflections/`** --- a page on the
  deployed site about the developer you're becoming and the breakthrough that
  moved the work forward. It's the written half of your crit contribution.
- **This file is process evidence.** The harness you build to direct the agent,
  this `CLAUDE.md` and any `AGENTS.md`, is itself read as part of how you
  worked. Keep it honest and current (see below).

You don't need a name, a student number, or any identity file in the repo: we
know whose repo it is. Spend the effort on the work.

## This file is yours

This CLAUDE.md is a starting point, not a fixed rulebook. As you learn what your
prototype needs --- a convention to hold the agent to, a sensor that keeps
catching you out, a fact about the stack the agent keeps getting wrong --- write
it down here. Growing this file is the work of harness engineering, and the gap
between this boilerplate and your own version is part of what your prototype
says about the developer you're becoming.
