# The spec

Every deliverable's spec — what the markers consider when they judge whether
your work matches what was required — is published on the course website, and
this repo's name tells you which one applies: the course API maps repo prefixes
to deliverables, and the `start` course skill walks your agent through pulling
the right one. The brief poses the problem; the spec is the fixed contract. Read
both on the site before you plan or build.

The checks in this directory come in three kinds:

## Invariants (shipped, always on)

`invariants.test.ts` asserts things that are true of any good website, however
you build it and whatever the week's brief asks: a navigation landmark, exactly
one top-level heading, a document language, a real title, a meta description, an
`og:image` card, a mobile viewport, and alt text on images. They run against the
**built** site (`dist/`), so they check what actually ships. Keep them green;
don't delete them.

The description and the card are what a link to your site looks like when
someone shares it. The card check is presence only: a path that doesn't resolve
shows up in the course gallery, not as a red check, so look at the deployed head
when you add pages.

## A worked example (yours to replace)

`starter.test.ts` shows the shape of a spec test: it checks the starter page's
intro hook. It's a worked example, not part of the always-on contract — replace
or delete it when you replace the starter page. A starter implementation detail
is not a universal invariant.

## Your spec tests (yours to write)

Turning the week's published spec into tests is your work, not the template's.
Some spec lines are mechanically checkable — assert those here, in your own test
file alongside the invariants (any `spec/*.test.ts` runs with `pnpm check`).
Some lines only a person can judge; leave those to the crit. Write tests for the
**contracts** — what the page must do, not how you built it — so the tests
survive a change of approach, or of stack.

A green suite here is backpressure, not a mark: your tutor verifies the live
site against the published spec at the crit, and keeping your own tests green is
how you arrive with no surprises.
