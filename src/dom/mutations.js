function observeAttributes(target, options, callback) {
  if (!target || typeof MutationObserver === "undefined") {
    return null;
  }

  const observer = new MutationObserver(callback);
  observer.observe(target, options);
  return observer;
}

module.exports = {
  observeAttributes,
};
