#!/usr/bin/env node
// Checks the process evidence every submission carries: PROCESS.md with its
// template boilerplate gone, every cited commit hash resolving to a real
// commit in this repo (a citation is a markdown link whose text is an
// abbreviated SHA or a sha...sha range), every relative image path resolving to
// a file that exists, a reflection entry in reflections/, and the CLAUDE.md
// harness.
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

// Images are read on GitHub, which resolves a relative path against the repo —
// so the file has to be committed and the path has to be right. Absolute URLs
// aren't fetched (slow, flaky, and offline runs should still pass), but one
// hosted off GitHub gets a nudge: it can rot between shipping and marking.
const prose = src.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
const images = new Set<string>();
for (const m of prose.matchAll(/!\[[^\]]*\]\(\s*([^)\s]+)/g)) images.add(m[1]);
for (const m of prose.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)) images.add(m[1]);

for (const ref of images) {
  const url = ref.replace(/^</, "").replace(/>$/, "");
  if (/^data:/i.test(url)) continue;
  if (/^https?:\/\//i.test(url)) {
    if (!/^https:\/\/([\w-]+\.)*(github\.com|githubusercontent\.com)\//i.test(url)) {
      console.warn(`! image ${url} is hosted off GitHub — if it goes away before marking, so does the evidence`);
    }
    continue;
  }
  if (url.startsWith("/")) {
    fail(`image ${url} starts with "/" — GitHub resolves that off your repo; use a path relative to PROCESS.md`);
    continue;
  }
  const path = decodeURIComponent(url.split(/[?#]/)[0]);
  if (!existsSync(path)) {
    fail(`image ${path} isn't in this repo — commit it, or drop the reference; a broken image isn't evidence`);
  }
}

if (failed) process.exit(1);
console.log(`✓ PROCESS.md: ${shas.size} cited commit(s) all resolve`);
if (images.size > 0) console.log(`✓ PROCESS.md: ${images.size} image reference(s) checked`);
