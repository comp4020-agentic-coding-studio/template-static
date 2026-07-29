import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// A worked page-specific test, not an invariant. It describes the starter
// implementation so there is a concrete example to replace with tests for the
// week's published spec.

// Both failures below mean the same thing: the starter page is gone, so this
// test has done its job. The reader may never open this file, so the advice
// has to live in the failure output.
const NEXT_STEP =
  "Replace it with a test for this week's published spec, or delete it — see spec/README.md.";

describe("starter page", () => {
  it("marks the intro region used by the starter script", () => {
    const distPath = resolve("dist/index.html");
    expect(
      existsSync(distPath),
      `${distPath} not found — you've restructured away from it. ${NEXT_STEP}`,
    ).toBe(true);

    const doc = new JSDOM(readFileSync(distPath, "utf8")).window.document;
    expect(
      doc.querySelector('[data-testid="intro"]'),
      `This described the starter page. ${NEXT_STEP} Don't re-add the attribute to make it pass.`,
    ).toBeTruthy();
  });
});
