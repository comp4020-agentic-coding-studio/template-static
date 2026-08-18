import { execFileSync } from "node:child_process";

// Where this site will be served from.
//
// GitHub Pages serves a project repo under a sub-path
// (https://<owner>.github.io/<repo>/). Asset URLs and internal links don't need
// to know that --- `base: "./"` in vite.config.ts keeps them relative, so the
// built site works wherever it lands. Exactly one URL does need to know: the
// card image a link preview shows. A scraper fetches the page on its own and
// won't resolve a relative og:image against it, so that one has to be absolute.
//
// A template can't hardcode the address, because it doesn't know the repo name
// until you generate from it. So it's derived: GITHUB_REPOSITORY in Actions,
// the origin remote otherwise.

/** The origin remote, or undefined outside a git checkout. Impure, and kept
 *  apart from the resolution below so that stays testable. */
export function gitOrigin(): string | undefined {
  try {
    return execFileSync("git", ["remote", "get-url", "origin"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return undefined;
  }
}

export interface RepoSlug {
  owner: string;
  repo: string;
}

export interface Deployment {
  site: string | undefined;
  base: string;
}

// git@github.com:owner/repo.git, https://github.com/owner/repo, ssh://git@github.com/owner/repo.git
const REMOTE_URL =
  /^(?:git@github\.com:|(?:https?|ssh|git):\/\/(?:[^@/]+@)?github\.com\/)(?<owner>[^/]+)\/(?<repo>[^/]+?)(?:\.git)?\/?$/;

/** Parse `owner/repo` out of a GITHUB_REPOSITORY value or a git remote URL. */
export function parseRepoSlug(input: string | undefined | null): RepoSlug | null {
  const value = input?.trim();
  if (!value) return null;

  const remote = REMOTE_URL.exec(value);
  if (remote?.groups) {
    return { owner: remote.groups.owner!, repo: remote.groups.repo! };
  }

  // GITHUB_REPOSITORY form, e.g. "octocat/hello-world"
  const parts = value.replace(/\.git$/, "").split("/");
  if (parts.length === 2 && parts[0] && parts[1]) {
    return { owner: parts[0], repo: parts[1] };
  }
  return null;
}

/** The Pages URL a repo publishes to. A repo named `<owner>.github.io` is the
 *  owner's user/org site and serves at the domain root; everything else is a
 *  project site under `/<repo>`. */
export function pagesUrl(slug: RepoSlug): Deployment {
  const owner = slug.owner.toLowerCase();
  const isOwnerSite = slug.repo.toLowerCase() === `${owner}.github.io`;
  return {
    site: `https://${owner}.github.io`,
    base: isOwnerSite ? "/" : `/${slug.repo}`,
  };
}

/** Resolve the deployment from the environment, falling back to the git remote.
 *  `gitRemote` is injected so this stays a pure function under test. An unknown
 *  repo means no address, and a card URL is only worth stamping in once the
 *  site has one. */
export function resolveDeployment(
  env: Record<string, string | undefined>,
  gitRemote: () => string | undefined,
): Deployment {
  const slug = parseRepoSlug(env.GITHUB_REPOSITORY) ?? parseRepoSlug(gitRemote());
  return slug ? pagesUrl(slug) : { site: undefined, base: "/" };
}
