// SPDX-License-Identifier: GPL-3.0-only

import { runFeedProfile } from "./feed-scenarios";

void runFeedProfile().then(
  (scenarios) => {
    const output = document.createElement("pre");
    output.id = "results";
    output.textContent = JSON.stringify({ browser: navigator.userAgent, posts: 80, scenarios });
    document.body.replaceChildren(output);
  },
  (error: unknown) => {
    const output = document.createElement("pre");
    output.id = "failure";
    output.textContent = String(error);
    document.body.replaceChildren(output);
  }
);
