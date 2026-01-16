const { rvAtt } = require("../dom/attributes");

function mopReelsFeed(context, caller = "self") {
  if (!context) {
    return null;
  }

  const { state, options } = context;
  if (!state || !options) {
    return null;
  }

  if (!state.isRF) {
    state.isRF_InTimeoutMode = false;
    return null;
  }
  if (caller !== "self" && state.isRF_InTimeoutMode === true) {
    return null;
  }

  const videoRules = `[data-video-id] video:not([${rvAtt}])`;
  const videos = document.querySelectorAll(videoRules);

  for (const video of videos) {
    const elVideoId = video.closest("[data-video-id]");
    if (elVideoId) {
      const videoContainer = elVideoId.parentElement;
      if (videoContainer) {
        if (options.REELS_CONTROLS === true) {
          const descriptionOverlay = videoContainer.nextElementSibling;
          if (descriptionOverlay) {
            const elDescriptionContainer = descriptionOverlay.children[0];
            elDescriptionContainer.setAttribute(
              "style",
              `margin-bottom:${state.isChromium ? "4.5" : "2.25"}rem;`
            );
            video.setAttribute("controls", "true");
            const sibling = video.nextElementSibling;
            if (sibling) {
              sibling.setAttribute("style", "display:none;");
            }
          }
        }
        if (options.REELS_DISABLE_LOOPING === true) {
          video.addEventListener("ended", (ev) => {
            ev.target.pause();
          });
        }
        video.setAttribute(rvAtt, "1");
      }
    }
  }

  state.isRF_InTimeoutMode = true;
  setTimeout(() => {
    mopReelsFeed(context, "self");
  }, 1000);

  return videos;
}

module.exports = {
  mopReelsFeed,
};
