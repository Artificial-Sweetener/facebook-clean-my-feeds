function detectDarkMode() {
  if (!document || !document.documentElement) {
    return false;
  }

  if (document.documentElement.classList.contains("__fb-light-mode")) {
    return false;
  }

  if (document.documentElement.classList.contains("__fb-dark-mode")) {
    return true;
  }

  if (document.body) {
    const bodyBackgroundColour = window.getComputedStyle(document.body).backgroundColor;
    const rgb = bodyBackgroundColour.match(/\d+/g);
    if (rgb) {
      const red = parseInt(rgb[0], 10);
      const green = parseInt(rgb[1], 10);
      const blue = parseInt(rgb[2], 10);
      const luminance = 0.299 * red + 0.587 * green + 0.114 * blue;
      return luminance < 128;
    }
  }

  return false;
}

function watchDarkMode(state, onChange) {
  if (!state || typeof MutationObserver === "undefined") {
    return null;
  }

  const syncMode = () => {
    const modeNow = detectDarkMode();
    if (state.isDarkMode === null || state.isDarkMode !== modeNow) {
      state.isDarkMode = modeNow;
      if (typeof onChange === "function") {
        onChange(modeNow);
      }
    }
  };

  const startObserving = () => {
    if (!document.documentElement) {
      return null;
    }

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          syncMode();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return observer;
  };

  syncMode();

  const observer = startObserving();
  if (observer) {
    return observer;
  }

  const bootstrapObserver = new MutationObserver(() => {
    if (!document.documentElement) {
      return;
    }
    bootstrapObserver.disconnect();
    startObserving();
  });

  bootstrapObserver.observe(document, { childList: true });
  return bootstrapObserver;
}

module.exports = {
  watchDarkMode,
};
