#!/usr/bin/env node
// Checks the process evidence every submission carries: PROCESS.md with its
// template boilerplate gone and every cited commit hash resolving to a real
// commit in this repo (a citation is a markdown link whose text is an
// abbreviated SHA or a sha...sha range), a reflection entry in reflections/,
// and the CLAUDE.md harness.
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

const reflections = existsSync("reflections")
  ? readdirSync("reflections").filter((f) => f.endsWith(".md") && f !== "README.md")
  : [];
if (reflections.length === 0) {
  fail("no reflection entry in reflections/ — one short markdown file per week");
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

if (failed) process.exit(1);
console.log(`✓ PROCESS.md: ${shas.size} cited commit(s) all resolve`);
