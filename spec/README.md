# The spec

Every deliverable's spec — what the markers consider when they judge whether
your work matches what was required — is published on the course website, and
this repo's name tells you which one applies: the course API maps repo prefixes
to deliverables, and the `new-week` course skill walks your agent through
pulling the right one. Read the spec on the site first; it's the contract.

The checks in this directory come in two kinds:

## Invariants (shipped, always on)

`invariants.test.ts` asserts things that are true of any good website, however
you build it and whatever the week's brief asks: a navigation landmark, exactly
one top-level heading, the marked intro region (`data-testid="intro"`), a
document language, a real title, a mobile viewport, alt text on images. They run
against the **built** site (`dist/`), so they check what actually ships. Keep
them green; don't delete them.

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
