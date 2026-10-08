// SPDX-License-Identifier: GPL-3.0-only

import type { DialogState } from "./types";

/**
 * Initialize collapsed section bodies and use one delegated listener for all legend toggles.
 */
export function addLegendEvents() {
  const elFBCMF = document.getElementById("fbcmf");
  if (elFBCMF) {
    const fieldsets = elFBCMF.querySelectorAll("fieldset");
    fieldsets.forEach((fieldset) => {
      updateFieldsetState(fieldset, false, { animateHeight: false });
    });

    if (elFBCMF.dataset.cmfLegendInit === "1") {
      return;
    }
    elFBCMF.dataset.cmfLegendInit = "1";
    elFBCMF.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const legend = target ? target.closest("legend") : null;
      if (!legend || !elFBCMF.contains(legend)) {
        return;
      }
      const fieldset = legend.parentElement;
      if (!fieldset) {
        return;
      }
      const isHidden = fieldset.classList.contains("cmf-hidden");
      updateFieldsetState(fieldset, isHidden, { animateRock: isHidden });
    });
  }
}

/**
 * Synchronize section classes, measured height, and optional icon animation while preserving collapsed layout.
 * @param fieldset Section whose classes and measured expansion height are synchronized.
 * @param expanded Whether the section body should be visible.
 * @param options Stored preferences or operation settings; existing values retain their meaning.
 */
export function updateFieldsetState(
  fieldset: HTMLElement | null,
  expanded: boolean,
  options: { animateRock?: boolean; animateHeight?: boolean } = {}
) {
  if (!fieldset) {
    return;
  }
  const { animateRock = false, animateHeight = true } = options;
  fieldset.classList.toggle("cmf-hidden", !expanded);
  fieldset.classList.toggle("cmf-visible", expanded);
  fieldset.classList.toggle("cmf-expanded", expanded);

  const body = fieldset.querySelector(".cmf-section-body");
  if (!body) {
    return;
  }

  if (expanded) {
    const height = body.scrollHeight;
    fieldset.style.setProperty("--cmf-section-height", `${height}px`);
  } else if (animateHeight) {
    const height = body.scrollHeight;
    fieldset.style.setProperty("--cmf-section-height", `${height}px`);
    requestAnimationFrame(() => {
      fieldset.style.setProperty("--cmf-section-height", "0px");
    });
  } else {
    fieldset.style.setProperty("--cmf-section-height", "0px");
  }

  const icon = fieldset.querySelector<HTMLElement>("legend .cmf-legend-icon");
  if (!icon) {
    return;
  }
  if (!expanded) {
    icon.classList.remove("cmf-legend-rock");
    return;
  }
  if (animateRock) {
    icon.classList.remove("cmf-legend-rock");
    void icon.offsetWidth;
    icon.classList.add("cmf-legend-rock");
    icon.addEventListener(
      "animationend",
      () => {
        icon.classList.remove("cmf-legend-rock");
      },
      { once: true }
    );
  }
}

/**
 * Filter setting labels case-insensitively, expand matches, and restore each section’s prior expansion state.
 * @param dialog Mounted settings root, or null when it is not available.
 * @param query User-entered case-insensitive settings search text.
 */
export function applySearchFilter(dialog: HTMLElement | null, query: string) {
  if (!dialog) {
    return;
  }
  const normalized = query.trim().toLowerCase();
  if (normalized.length > 0) {
    dialog.classList.add("cmf-searching");
  } else {
    dialog.classList.remove("cmf-searching");
  }
  const fieldsets = Array.from(dialog.querySelectorAll("fieldset"));
  fieldsets.forEach((fieldset) => {
    const legend = fieldset.querySelector("legend");
    const legendText = legend
      ? (legend.dataset.cmfTitle || legend.textContent || "").trim().toLowerCase()
      : "";
    const labels = Array.from(fieldset.querySelectorAll("label"));
    let anyMatch = false;
    labels.forEach((label) => {
      const labelText = (label.textContent || "").trim().toLowerCase();
      const matches = normalized.length === 0 || labelText.includes(normalized);
      label.style.display = matches ? "" : "none";
      if (matches) {
        anyMatch = true;
      }
    });

    const legendMatches = normalized.length === 0 || legendText.includes(normalized);
    const showFieldset = normalized.length === 0 ? true : legendMatches || anyMatch;

    if (normalized.length > 0) {
      if (!fieldset.dataset.cmfPrevState) {
        fieldset.dataset.cmfPrevState = fieldset.classList.contains("cmf-hidden")
          ? "hidden"
          : "visible";
      }
      if (showFieldset) {
        updateFieldsetState(fieldset, true, { animateHeight: false });
      }
      fieldset.style.display = showFieldset ? "" : "none";
      if (!showFieldset) {
        updateFieldsetState(fieldset, false, { animateHeight: false });
      }
    } else {
      fieldset.style.display = "";
      if (fieldset.dataset.cmfPrevState) {
        const prev = fieldset.dataset.cmfPrevState;
        updateFieldsetState(fieldset, prev !== "hidden", { animateHeight: false });
        delete fieldset.dataset.cmfPrevState;
      }
    }
  });
}

/**
 * Bind the current search input once and expose a refresh callback for reopening the dialog.
 * @param state Shared presentation state retained by mounted listeners.
 */
export function addSearchEvents(state: DialogState) {
  const dialog = document.getElementById("fbcmf");
  if (!dialog) {
    return;
  }
  const searchInput = dialog.querySelector<HTMLInputElement>(".fb-cmf-search input");
  if (!searchInput) {
    return;
  }
  if (searchInput.dataset.cmfSearchInit === "1") return;
  searchInput.dataset.cmfSearchInit = "1";
  const lifecycle = state.dialogContentLifecycle || state.dialogLifecycle;
  applySearchFilter(dialog, searchInput.value || "");
  lifecycle?.listen(searchInput, "input", () => {
    applySearchFilter(dialog, searchInput.value || "");
  });
  state.syncDialogSearch = () => {
    if (lifecycle && !lifecycle.active) return;
    if (searchInput.value) {
      applySearchFilter(dialog, searchInput.value);
    }
  };
}

/**
 * Keep legacy legends aligned by measured width while letting menu-style legends size naturally.
 * @param dialog Mounted settings root, or null when it is not available.
 */
export function updateLegendWidths(dialog: HTMLElement | null) {
  if (!dialog) {
    return;
  }
  const legends = Array.from(dialog.querySelectorAll<HTMLElement>("fieldset legend"));
  if (legends.length === 0) {
    return;
  }
  const usesMenuLegend = legends.some((legend) => legend.classList.contains("cmf-legend"));
  if (usesMenuLegend) {
    legends.forEach((legend) => {
      legend.style.width = "";
    });
    return;
  }
  const previousWidths = legends.map((legend) => legend.style.width);
  legends.forEach((legend) => {
    legend.style.width = "auto";
  });
  let maxWidth = 0;
  legends.forEach((legend) => {
    const rect = legend.getBoundingClientRect();
    if (rect.width > maxWidth) {
      maxWidth = rect.width;
    }
  });
  legends.forEach((legend, index) => {
    legend.style.width = maxWidth > 0 ? `${Math.ceil(maxWidth)}px` : previousWidths[index] || "";
  });
}
