// SPDX-License-Identifier: GPL-3.0-only

/**
 * Supply the typed story sections observed on Facebook using synthetic identities and no user data.
 * @param token Synthetic click token linking the author DOM to this story.
 * @param ai Whether the story owns an eligible AI transparency section.
 * @param id Shared story identity used to verify context and feedback ownership.
 * @returns Native-shaped JSON data suitable for inert payload and ownership tests.
 */
export function aiStory(token = "story-token", ai = true, id = "story-1") {
  return {
    __typename: "Story",
    id,
    encrypted_click_tracking: token,
    comet_sections: {
      context_layout: {
        story: {
          id,
          comet_sections: {
            metadata: ai
              ? [
                  {
                    __typename: "CometFeedStoryGenAIContentTransparencyStrategy",
                    is_prod_eligible: true,
                  },
                ]
              : [],
          },
        },
      },
      feedback: {
        story: { story_ufi_container: { story: { id, encrypted_click_tracking: `${token}-ufi` } } },
      },
    },
  };
}

/** Mount an inert native payload; append-only updates exercise the real observer rather than a test cache hook. */
export function appendPayload(value: unknown): HTMLScriptElement {
  const script = document.createElement("script");
  script.type = "application/json";
  script.setAttribute("data-sjs", "");
  script.textContent = JSON.stringify(value);
  document.head.append(script);
  return script;
}

/** Unknown-language player controls preserve the observed live transport shape and numeric identity. */
export function livePlayer(id = "123"): string {
  return `<div id="player"><video></video><div><div id="transport">
    <button>α</button><button>β</button><button>γ</button><button>δ</button>
    <span><span><span><div role="button" aria-pressed="true">ε</div></span></span></span>
    </div><div role="slider"></div></div><a href="https://www.facebook.com/author/videos/${id}/">ζ</a></div>`;
}
