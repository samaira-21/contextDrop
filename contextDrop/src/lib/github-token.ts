export function githubAccessToken(explicit?: string) {
  const token = explicit?.trim() || process.env.GITHUB_TOKEN?.trim();
  return token || undefined;
}

export function rethrowGithubApiError(error: unknown): never {
  const message = error instanceof Error ? error.message : String(error);
  if (
    /rate limit exceeded/i.test(message) ||
    /API rate limit/i.test(message) ||
    /quota exhausted/i.test(message)
  ) {
    throw new Error(
      "GitHub API rate limit exceeded. Add a personal access token on the create form, or set GITHUB_TOKEN in .env.",
    );
  }
  throw error instanceof Error ? error : new Error(message);
}
