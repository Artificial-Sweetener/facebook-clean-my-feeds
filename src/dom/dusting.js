const { postPropDS } = require("./attributes");

function doLightDusting(post, state) {
  if (!post || !state) {
    return;
  }

  let scanCount = state.scanCountStart;
  if (post[postPropDS] !== undefined) {
    scanCount = parseInt(post[postPropDS], 10);
    scanCount = scanCount < state.scanCountStart ? state.scanCountStart : scanCount;
  }
  if (scanCount < state.scanCountMaxLoop) {
    const dustySpots = post.querySelectorAll('[data-0="0"]');
    if (dustySpots) {
      dustySpots.forEach((element) => {
        element.remove();
      });
    }
    scanCount += 1;
    post[postPropDS] = scanCount;
  }
}

module.exports = {
  doLightDusting,
};
