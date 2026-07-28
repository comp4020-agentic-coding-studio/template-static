#!/usr/bin/env node
// Checks the process evidence every submission carries: PROCESS.md with its
// template boilerplate gone, every cited commit hash resolving to a real
// commit in this repo (a citation is a markdown link whose text is an
// abbreviated SHA or a sha...sha range), a correctly named reflection entry in
// reflections/, and the CLAUDE.md harness. Bare minimum, on purpose.
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";

let failed = false;
const fail = (msg: string): void => {
  console.error(`✗ ${msg}`);
  failed = true;
};

if (!existsSync("CLAUDE.md")) {
  fail("no CLAUDE.md in the repo root — the harness is part of every submission");
}

// A reflection is named for the deliverable it answers, so the number in the
// filename is the number in the repo name: crit-1.md in comp4020-crit1-<you>,
// assignment-1.md in comp4020-ass1-<you>. The marker reads that exact name.
const REFLECTION_NAME = /^(crit-\d+|assignment-\d+|final-project)\.md$/;

const reflections = existsSync("reflections")
  ? readdirSync("reflections").filter((f) => f.endsWith(".md") && f !== "README.md")
  : [];
const misnamed = reflections.filter((f) => !REFLECTION_NAME.test(f));
if (reflections.length === 0) {
  fail(
    "no reflection entry in reflections/ — one per deliverable, named for it (e.g. crit-1.md)",
  );
} else if (misnamed.length > 0) {
  fail(
    `reflections/${misnamed.join(", reflections/")} — name each entry for the ` +
      "deliverable it answers: crit-<n>.md, assignment-<n>.md, or final-project.md. " +
      "The marker reads that exact name, so anything else reads as no reflection at all.",
  );
} else {
  console.log(
    `✓ reflections/: ${reflections.length} entr${reflections.length === 1 ? "y" : "ies"}`,
  );
}

if (!existsSync("PROCESS.md")) {
  fail("no PROCESS.md in the repo root");
  process.exit(1);
}

const src = readFileSync("PROCESS.md", "utf8");

if (src.includes("TEMPLATE:")) {
  fail(
    "PROCESS.md still contains the template comment — replace the boilerplate with your own overview",
  );
}

const shas = new Set<string>();
for (const match of src.matchAll(/\[`?([0-9a-f]{7,40}(?:\.\.\.[0-9a-f]{7,40})?)`?\]\(/g)) {
  for (const sha of match[1].split("...")) shas.add(sha);
}

if (shas.size === 0) {
  fail("no commit citations found — cite each moment as [`<sha>`](<commit or compare URL>)");
}

for (const sha of shas) {
  try {
    execFileSync("git", ["cat-file", "-e", `${sha}^{commit}`], {
      stdio: "ignore",
    });
  } catch {
    fail(`cited commit ${sha} doesn't exist in this repo`);
  }
}

// Images are deliberately not checked. Whether one renders is visible the
// moment you look at PROCESS.md on GitHub, which is where it's read — unlike a
// citation whose SHA doesn't resolve, which looks perfectly fine rendered.
// This check covers what you can't see by looking; the rest is on you.

if (failed) process.exit(1);
console.log(`✓ PROCESS.md: ${shas.size} cited commit(s) all resolve`);
