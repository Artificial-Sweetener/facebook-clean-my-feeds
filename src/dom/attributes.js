const { generateRandomString } = require("../utils/random");

const postAtt = "cmfr";
const postAttCPID = "cmfcpid";
const postPropDS = "cmfDusted";
const postAttChildFlag = "cmfcf";
const postAttTab = "cmftsb";
const postAttMPSkip = "cmfsmp";
const rvAtt = "cmfrv";
const mainColumnAtt = "cmfmc";

function initializeRuntimeAttributes(state) {
  if (!state) {
    return;
  }

  state.hideAtt = generateRandomString();
  state.hideWithNoCaptionAtt = generateRandomString();
  state.showAtt = generateRandomString();
  state.cssHideEl = generateRandomString();
  state.cssHideNumberOfShares = generateRandomString();
}

module.exports = {
  initializeRuntimeAttributes,
  mainColumnAtt,
  postAtt,
  postAttCPID,
  postAttChildFlag,
  postAttMPSkip,
  postAttTab,
  postPropDS,
  rvAtt,
};
