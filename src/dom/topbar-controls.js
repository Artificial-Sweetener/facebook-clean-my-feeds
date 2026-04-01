const MIN_CONTROL_SIZE = 28;
const MAX_CONTROL_SIZE = 72;
const MIN_ASPECT_RATIO = 0.75;
const MAX_ASPECT_RATIO = 1.35;
const MAX_CLUSTER_GAP = 24;
const MAX_ROW_OFFSET = 12;

function getRect(element) {
  if (!element || typeof element.getBoundingClientRect !== "function") {
    return null;
  }
  const rect = element.getBoundingClientRect();
  if (!rect || rect.width <= 0 || rect.height <= 0) {
    return null;
  }
  return rect;
}

function isInteractiveControl(element) {
  if (!element || !element.tagName) {
    return false;
  }
  const tagName = element.tagName.toUpperCase();
  if (tagName === "BUTTON") {
    return true;
  }
  if (element.getAttribute("role") === "button") {
    return true;
  }
  if (element.getAttribute("aria-expanded") !== null) {
    return true;
  }
  const tabIndex = element.getAttribute("tabindex");
  return tabIndex !== null && tabIndex !== "-1";
}

function isTopbarControlCandidate(element, bannerRect) {
  if (!isInteractiveControl(element)) {
    return false;
  }
  const rect = getRect(element);
  if (!rect) {
    return false;
  }
  if (
    rect.width < MIN_CONTROL_SIZE ||
    rect.height < MIN_CONTROL_SIZE ||
    rect.width > MAX_CONTROL_SIZE ||
    rect.height > MAX_CONTROL_SIZE
  ) {
    return false;
  }
  const aspectRatio = rect.width / rect.height;
  if (aspectRatio < MIN_ASPECT_RATIO || aspectRatio > MAX_ASPECT_RATIO) {
    return false;
  }
  if (!bannerRect) {
    return true;
  }
  return rect.bottom > bannerRect.top && rect.top < bannerRect.bottom;
}

function buildControlClusters(controls) {
  const clusters = [];
  controls.forEach((control) => {
    const currentCluster = clusters[clusters.length - 1];
    if (!currentCluster) {
      clusters.push({
        controls: [control],
        rightEdge: control.rect.right,
      });
      return;
    }

    const previous = currentCluster.controls[currentCluster.controls.length - 1];
    const gap = control.rect.left - previous.rect.right;
    const sameRow = Math.abs(control.rect.top - previous.rect.top) <= MAX_ROW_OFFSET;
    const similarHeight = Math.abs(control.rect.height - previous.rect.height) <= MAX_ROW_OFFSET;
    if (sameRow && similarHeight && gap >= -1 && gap <= MAX_CLUSTER_GAP) {
      currentCluster.controls.push(control);
      currentCluster.rightEdge = control.rect.right;
      return;
    }

    clusters.push({
      controls: [control],
      rightEdge: control.rect.right,
    });
  });
  return clusters;
}

function getTopbarControlButtons(root = document) {
  if (!root || typeof root.querySelector !== "function") {
    return [];
  }
  const banner = root.querySelector('[role="banner"]');
  if (!banner) {
    return [];
  }

  const bannerRect = getRect(banner);
  const controls = Array.from(new Set(Array.from(banner.querySelectorAll('button, [role="button"]'))))
    .filter((control) => isTopbarControlCandidate(control, bannerRect))
    .map((control) => ({
      element: control,
      rect: getRect(control),
    }))
    .filter((control) => control.rect !== null)
    .sort((a, b) => a.rect.left - b.rect.left);

  if (controls.length === 0) {
    return [];
  }

  const clusters = buildControlClusters(controls);
  const candidateClusters = clusters.some((cluster) => cluster.controls.length > 1)
    ? clusters.filter((cluster) => cluster.controls.length > 1)
    : clusters;
  candidateClusters.sort(
    (a, b) => b.rightEdge - a.rightEdge || b.controls.length - a.controls.length
  );

  return candidateClusters[0].controls.map((control) => control.element);
}

function getTopbarMenuButton(root = document) {
  const controls = getTopbarControlButtons(root);
  return controls.length > 0 ? controls[0] : null;
}

function isTopbarControlButton(element, root = document) {
  return getTopbarControlButtons(root).some((control) => control === element);
}

module.exports = {
  getTopbarControlButtons,
  getTopbarMenuButton,
  isTopbarControlButton,
};
