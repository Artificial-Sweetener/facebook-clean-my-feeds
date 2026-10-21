/** @jest-environment node */
// SPDX-License-Identifier: GPL-3.0-only

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

/** Resolve the release step's literal Git identity overrides against deliberately conflicting runner defaults. */
function releaseEnvironment(): NodeJS.ProcessEnv {
  const workflow = readFileSync(
    path.resolve(__dirname, "../../.github/workflows/release.yml"),
    "utf8"
  ).replaceAll("\r\n", "\n");
  const releaseStep = workflow.split("      - name: Release\n")[1];
  if (!releaseStep) throw new Error("Release workflow step is missing");
  const environment = releaseStep.split("        env:\n")[1]?.split("        run:")[0];
  if (!environment) throw new Error("Release workflow environment is missing");
  const result: NodeJS.ProcessEnv = {
    ...process.env,
    GIT_AUTHOR_NAME: "Runner default author",
    GIT_AUTHOR_EMAIL: "author@example.invalid",
    GIT_COMMITTER_NAME: "Runner default committer",
    GIT_COMMITTER_EMAIL: "committer@example.invalid",
  };
  for (const match of environment.matchAll(
    /^ {10}(GIT_(?:AUTHOR|COMMITTER)_(?:NAME|EMAIL)): (.+)$/gm
  )) {
    const [, key, value] = match;
    if (key && value) result[key] = value.trim();
  }
  return result;
}

describe("release commit attribution", () => {
  test.each(["GIT_AUTHOR_IDENT", "GIT_COMMITTER_IDENT"])(
    "Git resolves %s to the requested release account",
    (variable) => {
      const identity = execFileSync("git", ["var", variable], {
        env: releaseEnvironment(),
        encoding: "utf8",
      });
      expect(identity.trim()).toMatch(
        /^Daisy-Bluemel <daisy@artificialsweetener\.ai> \d+ [+-]\d{4}$/
      );
    }
  );
});
