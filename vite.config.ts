import { readdirSync } from "node:fs";
import { join } from "node:path";
import { type Plugin, defineConfig } from "vite";
import { gitOrigin, resolveDeployment } from "./scripts/pages-base.ts";

// Every .html file in the repo is a page and a build entry, so a multi-page
// hand-written site needs no build config: add pages, link them, ship.
// (Vite's default would build only the root index.html and silently drop the
// rest from dist/ — fine locally, 404s deployed.)
const SKIP = new Set(["node_modules", "dist", "spec", "scripts", "reflections"]);

function htmlEntries(dir = "."): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith(".") || SKIP.has(entry.name)) return [];
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlEntries(path);
    return entry.name.endsWith(".html") ? [path] : [];
  });
}

// A card image is the one URL on the page that has to be absolute: a scraper
// fetches the page on its own, so a relative og:image has nothing to resolve
// against and Facebook and LinkedIn both drop the card. Write the path relative
// to the page like any other link; the build stamps in the deployed URL. Until
// the repo has a remote there is no address to stamp, and a card for a site
// nobody can reach isn't worth much anyway.
function absoluteCardUrls(): Plugin {
  const { site, base } = resolveDeployment(process.env, gitOrigin);
  const cardMeta = /property=["']og:image["']|name=["']twitter:image["']/;

  return {
    name: "absolute-card-urls",
    apply: "build",
    transformIndexHtml(html, ctx) {
      if (!site) return html;
      const page = new URL(join(base, ctx.path), site);
      return html.replace(/<meta\b[^>]*>/g, (tag) =>
        cardMeta.test(tag)
          ? tag.replace(/(content=["'])([^"']*)(["'])/, (whole, open, url, close) => {
              try {
                return `${open}${new URL(url, page).href}${close}`;
              } catch {
                // Not a URL at all. Leave it be: the invariants say so far
                // more clearly than a build crash in here would.
                return whole;
              }
            })
          : tag,
      );
    },
  };
}

// `base: "./"` makes built asset URLs relative, so the site works under any
// GitHub Pages path (username.github.io/your-repo/) without further config.
export default defineConfig({
  base: "./",
  plugins: [absoluteCardUrls()],
  build: {
    rollupOptions: {
      input: htmlEntries(),
    },
  },
});
