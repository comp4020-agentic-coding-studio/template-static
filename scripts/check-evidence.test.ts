import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { currentDeliverable, type Payload, reflectionFor } from "./check-evidence.ts";

// A trimmed course calendar in the real payload's shape: a solo weekly crit, an
// assignment sharing its week with the retro crit, and the shared final repo.
const payload: Payload = {
  timezone: "Australia/Canberra",
  weeks: [2, 3, 4, 9, 10, 11, 12].map((week, i) => ({
    week,
    monday: ["2026-08-03", "2026-08-10", "2026-08-17", "2026-10-05", "2026-10-12", "2026-10-19", "2026-10-26"][i],
  })),
  deliverables: [
    { kind: "crit", slug: "01-forgotten-web", week: 2, repoPrefix: "comp4020-crit1" },
    { kind: "crit", slug: "03-a1-retro", week: 4, repoPrefix: "comp4020-ass1" },
    { kind: "assessment", slug: "assignment-1", week: 4, repoPrefix: "comp4020-ass1" },
    { kind: "crit", slug: "08-its-alive", week: 9, repoPrefix: "comp4020-final" },
    { kind: "crit", slug: "09-crit-the-critics", week: 10, repoPrefix: "comp4020-final" },
    { kind: "crit", slug: "10-fly-by-instruments", week: 11, repoPrefix: "comp4020-final" },
    { kind: "assessment", slug: "final-project", week: 12, repoPrefix: "comp4020-final" },
  ],
};

const current = (repo: string, today: string): string | undefined => {
  const deliverable = currentDeliverable(payload, repo, today);
  return deliverable && reflectionFor(deliverable);
};

describe("currentDeliverable", () => {
  it("names the weekly crit's reflection from the repo prefix", () => {
    expect(current("comp4020-crit1-alice", "2026-08-05")).toBe("crit-1.md");
  });

  it("prefers the assessment over its retro crit in a shared week", () => {
    expect(current("comp4020-ass1-alice", "2026-08-18")).toBe("assignment-1.md");
  });

  it("tracks the shared final repo week by week", () => {
    expect(current("comp4020-final-alice", "2026-10-13")).toBe("crit-9.md");
    expect(current("comp4020-final-alice", "2026-10-27")).toBe("final-project.md");
  });

  it("expects the first deliverable before any of the repo's weeks start", () => {
    expect(current("comp4020-final-alice", "2026-09-30")).toBe("crit-8.md");
  });

  it("matches nothing for a repo without a course prefix", () => {
    expect(current("template-static", "2026-08-05")).toBeUndefined();
  });
});

// The end-to-end runs are deliberately offline (an unroutable API URL), so
// they exercise the skip path plus everything that doesn't need the network.
const script = resolve("scripts/check-evidence.ts");
const fixtures: string[] = [];

const env = {
  ...process.env,
  COMP4020_CRIT_GROUPS_URL: "http://127.0.0.1:1/crit-groups.json",
  GIT_CONFIG_GLOBAL: "/dev/null",
  GIT_CONFIG_SYSTEM: "/dev/null",
};

function fixture(withClaudeMd = true): string {
  const cwd = mkdtempSync(join(tmpdir(), "check-evidence-"));
  fixtures.push(cwd);
  mkdirSync(join(cwd, "reflections"));
  writeFileSync(join(cwd, "reflections", "crit-1.md"), "# Reflection\n");
  if (withClaudeMd) writeFileSync(join(cwd, "CLAUDE.md"), "# Working method\n");
  execFileSync("git", ["init", "-q"], { cwd, env });
  execFileSync(
    "git",
    ["remote", "add", "origin", "https://github.com/comp4020-agentic-coding-studio/comp4020-crit1-alice.git"],
    { cwd, env },
  );
  execFileSync(
    "git",
    [
      "-c",
      "user.name=Test",
      "-c",
      "user.email=test@example.invalid",
      "-c",
      "commit.gpgsign=false",
      "commit",
      "--allow-empty",
      "-m",
      "fixture",
      "-q",
    ],
    { cwd, env },
  );
  const sha = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd,
    env,
    encoding: "utf8",
  }).trim();
  writeFileSync(
    join(cwd, "PROCESS.md"),
    `# Process\n\nEvidence: [${sha.slice(0, 8)}](https://example.invalid/commit/${sha})\n`,
  );
  return cwd;
}

afterEach(() => {
  for (const cwd of fixtures.splice(0)) rmSync(cwd, { recursive: true });
});

describe("check:evidence", () => {
  it("passes offline, warning that the reflection check was skipped", () => {
    const result = spawnSync(process.execPath, [script], {
      cwd: fixture(),
      env,
      encoding: "utf8",
    });
    expect(result.status, result.stderr).toBe(0);
    expect(result.stderr).toContain("couldn't reach the course API");
  });

  it("rejects a missing CLAUDE.md", () => {
    const result = spawnSync(process.execPath, [script], {
      cwd: fixture(false),
      env,
      encoding: "utf8",
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("no CLAUDE.md");
  });
});
