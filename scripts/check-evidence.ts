#!/usr/bin/env node
// Checks the process evidence every submission carries: PROCESS.md with its
// template boilerplate gone, every cited commit hash resolving to a real
// commit in this repo (a citation is a markdown link whose text is an
// abbreviated SHA or a sha...sha range), the current deliverable's exact
// reflection entry, and working-method instructions. Bare minimum, on purpose.
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";

let failed = false;
const fail = (msg: string): void => {
  console.error(`✗ ${msg}`);
  failed = true;
};

const workingFiles = ["CLAUDE.md", "AGENTS.md", "WORKING.md"].filter((path) => existsSync(path));
if (workingFiles.length === 0) {
  fail(
    "no working-method file in the repo root — keep CLAUDE.md/AGENTS.md for agentic work, or WORKING.md for the no-AI route",
  );
}

const REFLECTION_NAME = /^(crit-\d+|assignment-\d+|final-project)\.md$/;

type Deliverable = {
  kind: "crit" | "assessment";
  slug: string;
  repoPrefix: string;
  reflection: string;
};

const reflections = existsSync("reflections")
  ? readdirSync("reflections").filter((f) => f.endsWith(".md") && f !== "README.md")
  : [];
const misnamed = reflections.filter((f) => !REFLECTION_NAME.test(f));
let deliverable: Deliverable | undefined;
if (!existsSync(".comp4020/deliverable.json")) {
  fail(
    "no .comp4020/deliverable.json — rerun /comp4020:new-week so this repo records the current published deliverable",
  );
} else {
  try {
    const parsed = JSON.parse(
      readFileSync(".comp4020/deliverable.json", "utf8"),
    ) as Partial<Deliverable>;
    if (
      !["crit", "assessment"].includes(parsed.kind ?? "") ||
      typeof parsed.slug !== "string" ||
      typeof parsed.repoPrefix !== "string" ||
      !parsed.repoPrefix.startsWith("comp4020-") ||
      typeof parsed.reflection !== "string" ||
      !REFLECTION_NAME.test(parsed.reflection)
    ) {
      throw new Error("invalid fields");
    }
    deliverable = parsed as Deliverable;
  } catch {
    fail(
      ".comp4020/deliverable.json is invalid — rerun /comp4020:new-week rather than editing the cache by hand",
    );
  }
}

if (deliverable) {
  if (!reflections.includes(deliverable.reflection)) {
    fail(
      `current reflection is missing — the marker reads reflections/${deliverable.reflection} for ${deliverable.slug}`,
    );
  } else {
    console.log(`✓ reflections/${deliverable.reflection}: current deliverable entry`);
  }

  try {
    const origin = execFileSync("git", ["config", "--get", "remote.origin.url"], {
      encoding: "utf8",
    }).trim();
    const repoName = origin
      .replace(/\.git$/, "")
      .split(/[/:]/)
      .at(-1);
    if (repoName && !repoName.startsWith(`${deliverable.repoPrefix}-`)) {
      fail(`.comp4020/deliverable.json names ${deliverable.repoPrefix}, but origin is ${repoName}`);
    }
  } catch {
    fail("cannot read remote.origin.url to verify the deliverable cache");
  }
}

for (const f of misnamed) {
  console.warn(`! reflections/${f} isn't a name the marker reads, so it won't be marked`);
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
