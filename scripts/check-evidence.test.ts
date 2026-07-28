import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

const script = resolve("scripts/check-evidence.ts");
const fixtures: string[] = [];

function fixture(reflections: string[], workingFile = "CLAUDE.md"): string {
  const cwd = mkdtempSync(join(tmpdir(), "check-evidence-"));
  fixtures.push(cwd);
  mkdirSync(join(cwd, ".comp4020"));
  mkdirSync(join(cwd, "reflections"));
  if (workingFile) writeFileSync(join(cwd, workingFile), "# Working method\n");
  writeFileSync(
    join(cwd, ".comp4020", "deliverable.json"),
    `${JSON.stringify(
      {
        kind: "crit",
        slug: "08-final-brief",
        repoPrefix: "comp4020-final",
        reflection: "crit-8.md",
      },
      null,
      2,
    )}\n`,
  );
  for (const reflection of reflections) {
    writeFileSync(join(cwd, "reflections", reflection), "# Reflection\n");
  }
  execFileSync("git", ["init", "-q"], { cwd });
  execFileSync(
    "git",
    [
      "-c",
      "user.name=Test",
      "-c",
      "user.email=test@example.invalid",
      "commit",
      "--allow-empty",
      "-m",
      "fixture",
      "-q",
    ],
    { cwd },
  );
  execFileSync(
    "git",
    [
      "remote",
      "add",
      "origin",
      "https://github.com/comp4020-agentic-coding-studio/comp4020-final-alice.git",
    ],
    { cwd },
  );
  const sha = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd,
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

describe("check:evidence current reflection", () => {
  it("accepts the exact reflection named by the deliverable cache", () => {
    const result = spawnSync(process.execPath, [script], {
      cwd: fixture(["crit-8.md", "crit-7.md"]),
      encoding: "utf8",
    });
    expect(result.status, result.stderr).toBe(0);
  });

  it("rejects a different valid reflection name", () => {
    const result = spawnSync(process.execPath, [script], {
      cwd: fixture(["crit-7.md"]),
      encoding: "utf8",
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("reflections/crit-8.md");
  });

  it("accepts WORKING.md for the no-AI route", () => {
    const result = spawnSync(process.execPath, [script], {
      cwd: fixture(["crit-8.md"], "WORKING.md"),
      encoding: "utf8",
    });
    expect(result.status, result.stderr).toBe(0);
  });

  it("rejects a missing working-method file", () => {
    const result = spawnSync(process.execPath, [script], {
      cwd: fixture(["crit-8.md"], ""),
      encoding: "utf8",
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("no working-method file");
  });
});
