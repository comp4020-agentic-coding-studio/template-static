import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// A worked page-specific test, not an invariant. It describes the starter
// implementation so there is a concrete example to replace with tests for the
// week's published spec.
describe("starter page", () => {
  it("marks the intro region used by the starter script", () => {
    const distPath = resolve("dist/index.html");
    expect(
      existsSync(distPath),
      `${distPath} not found. If you've restructured away from dist/index.html, replace or delete this starter test.`,
    ).toBe(true);

    const doc = new JSDOM(readFileSync(distPath, "utf8")).window.document;
    expect(
      doc.querySelector('[data-testid="intro"]'),
      "This described the starter page you've now replaced. Replace it with a test for this week's published spec, or delete it — don't re-add the attribute to make it pass.",
    ).toBeTruthy();
  });
});
