import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

/** Exercise the actual CDPT refspec against disposable local Git repositories. */
function publishedRevision(refspec: string) {
  const scratch = mkdtempSync(path.join(tmpdir(), "sciti-release-push-"));
  const remote = path.join(scratch, "remote.git");
  const checkout = path.join(scratch, "checkout");
  const git = (args: string[]) => execFileSync("git", args, { encoding: "utf8", stdio: "pipe" }).trim();
  try {
    git(["init", "--bare", remote]);
    git(["init", "-b", "main", checkout]);
    const run = (...args: string[]) => git(["-C", checkout, ...args]);
    run("config", "user.email", "release-test@example.invalid");
    run("config", "user.name", "Release test");
    run("config", "commit.gpgsign", "false");
    run("config", "core.hooksPath", path.join(scratch, "no-hooks"));
    run("remote", "add", "origin", remote);
    run("commit", "--allow-empty", "-m", "base");
    run("switch", "-c", "codex/validated-release");
    run("commit", "--allow-empty", "-m", "validated release");
    const validated = run("rev-parse", "HEAD");
    run("switch", "main");
    run("commit", "--allow-empty", "-m", "another session's main");
    run("switch", "codex/validated-release");
    run("push", "origin", refspec);
    return { validated, published: git(["--git-dir", remote, "rev-parse", "refs/heads/main"]) };
  } finally {
    // This path is created by mkdtemp above and contains only test fixtures.
    rmSync(scratch, { recursive: true, force: true });
  }
}

describe("CDPT releases the revision it actually validated", () => {
  it("does not publish another worktree's local main", () => {
    const script = readFileSync(path.join(process.cwd(), "scripts/cdpt.sh"), "utf8");
    const refspec = script.match(/^git push origin (\S+) /m)?.[1];
    expect(refspec).toBeTruthy();
    const result = publishedRevision(refspec!);
    expect(result.published).toBe(result.validated);
  });

  it("detects the old main-ref mutation using real Git state", () => {
    const result = publishedRevision("main");
    expect(result.published).not.toBe(result.validated);
  });
});
