import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// The invariants run against the BUILT site, so they check what actually
// ships, not the source. Run `pnpm build` first (the `check` script does).
// These hold for any good website, whatever the week's brief asks — the
// week-specific contracts live in your own spec/*.test.ts alongside this file.
const DIST = resolve("dist");

function files(dir: string = DIST): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}

// Everything the build emitted, as dist-relative POSIX paths.
const shipped = files().map((path) => relative(DIST, path).split(sep).join("/"));

const pages = shipped
  .filter((name) => name.endsWith(".html"))
  .map((name) => ({
    name,
    doc: new JSDOM(readFileSync(join(DIST, name), "utf8")).window.document,
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

      it("has a meta description", () => {
        const description = doc
          .querySelector('meta[name="description"]')
          ?.getAttribute("content")
          ?.trim();
        expect(
          description,
          "a search result and a link preview both read this page's description",
        ).toBeTruthy();
      });

      it("has an og:image that resolves", () => {
        const card = doc
          .querySelector('meta[property="og:image"]')
          ?.getAttribute("content")
          ?.trim();
        expect(
          card,
          "with no card image, a shared link renders as a bare row of text",
        ).toBeTruthy();

        // The tag carries an origin and a base path (GitHub Pages serves a
        // project repo under /<repo>/), neither of which is part of the path on
        // disk, so compare the tail of the URL's path against what shipped. The
        // card has to be a file this build emitted: one hosted somewhere else
        // can't be checked from here, and a card that goes dark when someone
        // else's host does isn't much of a card.
        const path = new URL(card!, `https://example.invalid/${name}`).pathname;
        expect(
          shipped.some((file) => path.endsWith(`/${file}`)),
          `og:image "${card}" is not a file this build emitted`,
        ).toBe(true);
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
