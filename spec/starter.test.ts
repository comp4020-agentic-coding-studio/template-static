import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// A worked page-specific test, not an invariant. It describes the starter
// implementation so there is a concrete example to replace with tests for the
// week's published spec.
describe("starter page", () => {
  const doc = new JSDOM(readFileSync(resolve("dist/index.html"), "utf8")).window
    .document;

  it("marks the intro region used by the starter script", () => {
    expect(doc.querySelector('[data-testid="intro"]')).toBeTruthy();
  });
});
