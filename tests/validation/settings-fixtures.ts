// SPDX-License-Identifier: GPL-3.0-only

import { createOptionsService } from "../../src/application/options-service";
import { defaults } from "../../src/core/options/defaults";
import { hydrateOptions } from "../../src/core/options/hydrate";
import type { Options, StoredOptions } from "../../src/core/options/types";
import { createState } from "../../src/runtime/state";
import { initDialog } from "../../src/ui/dialog/dialog";
import type { DialogCapabilities } from "../../src/ui/dialog/types";

/** Required typing makes additions to the persisted option contract break this inventory until covered. */
export const allKnownOptions: Required<Options> = {
  ...defaults,
  NF_SPONSORED: false,
  GF_SPONSORED: false,
  VF_SPONSORED: false,
  MP_SPONSORED: false,
  VERBOSITY_LEVEL: "2",
  VERBOSITY_MESSAGE_COLOUR: "#123456",
  CMF_DIALOG_LANGUAGE: "en",
  NF_LIKES_MAXIMUM_COUNT: "12345",
  NF_BLOCKED_TEXT: "NewsİİOther news",
  GF_BLOCKED_TEXT: "GroupİİOther group",
  VF_BLOCKED_TEXT: "VideoİİOther video",
  MP_BLOCKED_TEXT: "$10İİ$20",
  MP_BLOCKED_TEXT_DESCRIPTION: "MarketplaceİİOther description",
  PP_BLOCKED_TEXT: "ProfileİİOther profile",
};

/** Derive exhaustive value-type groups from the compile-time complete inventory, including legacy aliases. */
export const booleanOptionKeys = Object.entries(allKnownOptions)
  .filter(([, value]) => typeof value === "boolean")
  .map(([key]) => key);
export const arrayOptionKeys = Object.entries(allKnownOptions)
  .filter(([, value]) => Array.isArray(value))
  .map(([key]) => key);
export const stringOptionKeys = Object.entries(allKnownOptions)
  .filter(([, value]) => typeof value === "string")
  .map(([key]) => key);

/** Build shared runtime references through production hydration rather than reproducing its defaults. */
export function createSettingsFixture(stored: StoredOptions = {}) {
  const hydrated = hydrateOptions(stored, document.documentElement.lang || "en");
  const state = createState();
  Object.assign(state, hydrated, {
    showAtt: "cmf-test-show",
    hideAtt: "cmf-test-hide",
    hideWithNoCaptionAtt: "cmf-test-no-caption",
    cssHideEl: "cmf-test-hide-block",
    cssHideNumberOfShares: "cmf-test-hide-shares",
    cssHideVerifiedBadge: "cmf-test-hide-verified",
  });
  const context = {
    state,
    options: state.options,
    filters: state.filters,
    keyWords: hydrated.keyWords,
  };
  const applyOptions = jest.fn();
  const service = createOptionsService(context, { applyOptions });
  return { state, context, applyOptions, service };
}

/** Mount real settings controls with an application service and replaceable external capability edges. */
export function mountSettings(
  stored: StoredOptions = {},
  overrides: Partial<DialogCapabilities> = {}
) {
  const fixture = createSettingsFixture(stored);
  const capabilities: DialogCapabilities = {
    ...fixture.service,
    /** Report controls are present while collection stays outside this settings-focused fixture. */
    buildReport: () => ({ text: "settings fixture report" }),
    /** Keep report navigation inert and distinct from the public issue tracker. */
    getSupportUrl: () => "https://example.test/support",
    ...overrides,
  };
  const handlers = initDialog(fixture.context, capabilities);
  return { ...fixture, handlers, capabilities };
}

/** Reject missing fixture controls immediately rather than converting absence into a misleading assertion. */
export function control<T extends Element = HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing settings fixture control: ${selector}`);
  return element;
}

/** Construct a deferred operation without widening its resolved value contract. */
export function deferred<T>() {
  let complete: ((value: T) => void) | undefined;
  let fail: ((reason?: unknown) => void) | undefined;
  const promise = new Promise<T>((resolve, reject) => {
    complete = resolve;
    fail = reject;
  });
  return {
    promise,
    /** Complete the captured operation at an explicitly chosen lifecycle boundary. */
    resolve(value: T): void {
      if (!complete) throw new Error("Deferred operation was not initialized");
      complete(value);
    },
    /** Simulate external failure without involving a real browser storage quota. */
    reject(reason: unknown): void {
      if (!fail) throw new Error("Deferred operation was not initialized");
      fail(reason);
    },
  };
}
