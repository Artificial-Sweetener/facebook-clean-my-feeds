function createToggleButton(state, keyWords, onToggle) {
  if (!state || !keyWords || typeof onToggle !== "function") {
    return null;
  }

  if (!document.body) {
    return null;
  }

  const btn = document.createElement("button");
  btn.innerHTML = state.logoHTML;
  btn.id = "fbcmfToggle";
  btn.title = keyWords.DLG_TITLE;
  btn.className = "fb-cmf-toggle fb-cmf-icon";
  document.body.appendChild(btn);
  btn.addEventListener("click", onToggle, false);
  state.btnToggleEl = btn;
  return btn;
}

module.exports = {
  createToggleButton,
};
