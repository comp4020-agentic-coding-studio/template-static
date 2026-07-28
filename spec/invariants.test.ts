import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// The invariants run against the BUILT site, so they check what actually
// ships, not the source. Run `pnpm build` first (the `check` script does).
// These hold for any good website, whatever the week's brief asks — the
// week-specific contracts live in your own spec/*.test.ts alongside this file.
const DIST = resolve("dist");

function htmlFiles(dir: string = DIST): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith(".html") ? [path] : [];
  });
}

const pages = htmlFiles().map((path) => ({
  name: relative(DIST, path),
  doc: new JSDOM(readFileSync(path, "utf8")).window.document,
}));

describe("invariants: every page", () => {
  it("built at least one page", () => {
    expect(pages.length).toBeGreaterThan(0);
  });

  for (const { name, doc } of pages) {
    describe(name, () => {
      it("declares its language", () => {
        expect(doc.documentElement.getAttribute("lang")).toBeTruthy();
      });

      it("has a real title", () => {
        expect(doc.title.trim()).not.toBe("");
      });

      it("has a mobile viewport", () => {
        expect(doc.querySelector('meta[name="viewport"]')).toBeTruthy();
      });

      it("has a navigation landmark", () => {
        expect(doc.querySelector("nav")).toBeTruthy();
      });

      it("has exactly one top-level heading", () => {
        expect(doc.querySelectorAll("h1").length).toBe(1);
      });

      it("gives every image alt text", () => {
        for (const img of doc.querySelectorAll("img")) {
          expect(
            img.hasAttribute("alt"),
            `<img src="${img.getAttribute("src")}"> needs alt text`,
          ).toBe(true);
        }
      });
    });
  }
});

describe("invariants: home page", () => {
  const home = pages.find(({ name }) => name === "index.html");

  it("exists", () => {
    expect(home).toBeTruthy();
  });
});
