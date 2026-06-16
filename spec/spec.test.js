import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseHTML } from "linkedom";
import { describe, expect, it } from "vitest";

// The conformance test runs against the BUILT site, so it checks what actually
// ships, not the source. Run `pnpm build` first (the `check` script does).
function builtPage(path = "index.html") {
  const html = readFileSync(resolve("dist", path), "utf8");
  return parseHTML(html).document;
}

describe("spec: home page contracts", () => {
  const doc = builtPage();

  it("has a primary navigation landmark", () => {
    expect(doc.querySelector("nav")).toBeTruthy();
  });

  it("has exactly one top-level heading", () => {
    expect(doc.querySelectorAll("h1").length).toBe(1);
  });

  it("has the required intro hook", () => {
    expect(doc.querySelector('[data-testid="intro"]')).toBeTruthy();
  });
});
