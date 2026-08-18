import { describe, expect, it } from "vitest";
import { pagesUrl, parseRepoSlug, resolveDeployment } from "./pages-base.ts";

// Where the site ends up is invisible locally --- `pnpm dev` and `pnpm preview`
// both serve at the root --- and only the deployed URL shows a wrong answer. So
// it gets tested rather than eyeballed.

describe("parseRepoSlug", () => {
  it.each([
    ["octocat/hello-world", { owner: "octocat", repo: "hello-world" }],
    ["git@github.com:octocat/hello-world.git", { owner: "octocat", repo: "hello-world" }],
    ["https://github.com/octocat/hello-world.git", { owner: "octocat", repo: "hello-world" }],
    ["https://github.com/octocat/hello-world", { owner: "octocat", repo: "hello-world" }],
    ["ssh://git@github.com/octocat/hello-world.git", { owner: "octocat", repo: "hello-world" }],
  ])("parses %s", (input, expected) => {
    expect(parseRepoSlug(input)).toEqual(expected);
  });

  it.each([undefined, null, "", "   ", "not-a-repo", "https://gitlab.com/a/b.git"])(
    "returns null for %s",
    (input) => {
      expect(parseRepoSlug(input)).toBeNull();
    },
  );
});

describe("pagesUrl", () => {
  it("serves a project repo under /<repo>", () => {
    expect(pagesUrl({ owner: "SlopU", repo: "my-course" })).toEqual({
      site: "https://slopu.github.io",
      base: "/my-course",
    });
  });

  it("serves an owner site at the root", () => {
    expect(pagesUrl({ owner: "SlopU", repo: "slopu.github.io" })).toEqual({
      site: "https://slopu.github.io",
      base: "/",
    });
  });
});

describe("resolveDeployment", () => {
  const noRemote = () => undefined;

  it("prefers GITHUB_REPOSITORY", () => {
    const remote = () => "git@github.com:other/other-repo.git";
    expect(resolveDeployment({ GITHUB_REPOSITORY: "octocat/hello-world" }, remote)).toEqual({
      site: "https://octocat.github.io",
      base: "/hello-world",
    });
  });

  it("falls back to the git remote", () => {
    const remote = () => "git@github.com:octocat/hello-world.git";
    expect(resolveDeployment({}, remote)).toEqual({
      site: "https://octocat.github.io",
      base: "/hello-world",
    });
  });

  it("builds at the root when the repo is unknown", () => {
    expect(resolveDeployment({}, noRemote)).toEqual({ site: undefined, base: "/" });
  });
});
