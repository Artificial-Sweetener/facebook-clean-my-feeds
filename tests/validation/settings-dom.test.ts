// SPDX-License-Identifier: GPL-3.0-only

import { translations } from "../../src/i18n";
import { collectDialogOptions } from "../../src/ui/dialog/form-state";
import { toggleDialog, updateDialog } from "../../src/ui/dialog/dialog";
import { addCSS, addExtraCSS } from "../../src/dom/styles";
import { defaults } from "../../src/core/options/defaults";
import { setOptions } from "../../src/storage/idb";
import { allKnownOptions, booleanOptionKeys, control, mountSettings } from "./settings-fixtures";

jest.mock("../../src/storage/idb", () => ({ setOptions: jest.fn(), deleteOptions: jest.fn() }));

const mounted: ReturnType<typeof mountSettings>[] = [];

/** Register a real mounted dialog for deterministic cleanup even when an assertion fails. */
function mount(stored = { ...allKnownOptions }) {
  const fixture = mountSettings(stored);
  mounted.push(fixture);
  return fixture;
}

beforeEach(() => {
  jest.useFakeTimers();
  document.body.innerHTML = '<div role="banner"></div>';
  document.documentElement.lang = "en";
  jest.mocked(setOptions).mockReset().mockResolvedValue(undefined);
});

afterEach(() => {
  mounted.splice(0).forEach(({ handlers }) => handlers.destroyDialog());
  document.body.replaceChildren();
  document.head.querySelectorAll("style").forEach((style) => style.remove());
  jest.clearAllTimers();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe("settings locale and control inventory", () => {
  test.each(Object.entries(translations))(
    "constructs every control and saves locale %s",
    async (language, catalog) => {
      const { state, handlers } = mount({ ...allKnownOptions, CMF_DIALOG_LANGUAGE: language });
      const dialog = control("#fbcmf");
      expect(dialog.dir).toBe(catalog.LANGUAGE_DIRECTION);
      expect(control<HTMLSelectElement>('[name="CMF_DIALOG_LANGUAGE"]').value).toBe(language);
      expect(control("#BTNSave .cmf-action-text").textContent).toBe(catalog.DLG_BUTTONS[0]);
      expect(control<HTMLButtonElement>(".fb-cmf-close button").getAttribute("aria-label")).toBe(
        catalog.DLG_BUTTONS[1]
      );
      for (const key of booleanOptionKeys.filter((key) => key !== "SPONSORED")) {
        const inputs = document.querySelectorAll<HTMLInputElement>(`input[name="${key}"]`);
        expect(inputs).toHaveLength(1);
        expect(inputs[0]?.checked).toBe(Reflect.get(allKnownOptions, key));
      }
      await handlers.saveUserOptions();
      expect(state.options.CMF_DIALOG_LANGUAGE).toBe(language);
      for (const [key, value] of Object.entries(allKnownOptions)) {
        if (["SPONSORED", "DLG_VERBOSITY", "CMF_DIALOG_LANGUAGE"].includes(key)) continue;
        expect({ key, actual: Reflect.get(state.options, key) }).toEqual({ key, actual: value });
      }
      expect(state.options).not.toHaveProperty("SPONSORED");
      expect(state.options).not.toHaveProperty("DLG_VERBOSITY");
    }
  );

  test.each(Object.entries(translations))(
    "relocalizes content and preserves footer ownership for %s",
    async (language, catalog) => {
      const { handlers, state } = mount();
      const dialog = control("#fbcmf");
      const footer = control("#fbcmf footer");
      const previousContent = state.dialogContentLifecycle;
      control<HTMLSelectElement>('[name="CMF_DIALOG_LANGUAGE"]').value = language;
      toggleDialog(state);
      await handlers.saveUserOptions();
      expect(document.getElementById("fbcmf")).toBe(dialog);
      expect(control("#fbcmf footer")).toBe(footer);
      expect(dialog.hasAttribute(state.showAtt)).toBe(true);
      expect(dialog.dir).toBe(catalog.LANGUAGE_DIRECTION);
      expect(control("#BTNSave .cmf-action-text").textContent).toBe(catalog.DLG_BUTTONS[0]);
      if (language !== "en") expect(previousContent?.active).toBe(false);
      expect(control<HTMLButtonElement>(".fb-cmf-close button").title).toBe(catalog.DLG_BUTTONS[1]);
      expect(control(".fb-cmf-close button").getAttribute("aria-label")).toBe(
        catalog.DLG_BUTTONS[1]
      );
      expect(control<HTMLInputElement>(".fb-cmf-search input").placeholder).toBe(
        "Search Clean My Feeds"
      );
      expect(document.querySelectorAll("#fbcmf")).toHaveLength(1);
      expect(document.querySelectorAll("#fbcmfToggle")).toHaveLength(1);
      const before = jest.mocked(setOptions).mock.calls.length;
      control<HTMLInputElement>('[name="NF_STORIES"]').checked = true;
      control<HTMLButtonElement>("#BTNSave").click();
      await Promise.resolve();
      await Promise.resolve();
      expect(jest.mocked(setOptions).mock.calls.length).toBe(before + 1);
      expect(state.options.NF_STORIES).toBe(true);
    }
  );

  test.each([false, true])(
    "saves every editable boolean as %p through real controls",
    async (checked) => {
      const { handlers, state } = mount();
      const inputs = document.querySelectorAll<HTMLInputElement>('input[cbtype="T"]');
      inputs.forEach((input) => {
        input.checked = checked;
      });
      await handlers.saveUserOptions();
      for (const input of inputs) expect(Reflect.get(state.options, input.name)).toBe(checked);
      handlers.destroyDialog();
      const remounted = mountSettings({ ...state.options });
      mounted.push(remounted);
      for (const input of inputs) {
        expect(control<HTMLInputElement>(`input[name="${input.name}"]`).checked).toBe(checked);
      }
    }
  );

  test("normalizes blank blocked lines without trimming meaningful spaces and keeps arrays detached", async () => {
    const { state, handlers } = mount();
    const oldArray = state.options.NF_BLOCKED_FEED;
    control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]').value =
      "  First  \n\n \nSecond\r\nThird";
    control<HTMLInputElement>('[name="NF_BLOCKED_FEED"][value="1"]').checked = true;
    const draft = collectDialogOptions(state);
    expect(draft?.NF_BLOCKED_TEXT).toBe("  First  İİSecondİİThird");
    expect(draft?.NF_BLOCKED_FEED).toEqual(["1", "1", "0"]);
    expect(draft?.NF_BLOCKED_FEED).not.toBe(oldArray);
    expect(oldArray).toEqual(["1", "0", "0"]);
    await handlers.saveUserOptions();
    updateDialog(state);
    expect(control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]').value).toBe(
      "  First  \nSecond\nThird"
    );
  });

  test("rejects an enabled empty likes limit but allows disabled empty limit", async () => {
    const alert = jest.spyOn(window, "alert").mockImplementation(() => undefined);
    const { handlers } = mount();
    const enabled = control<HTMLInputElement>('[name="NF_LIKES_MAXIMUM"]');
    const count = control<HTMLInputElement>('[name="NF_LIKES_MAXIMUM_COUNT"]');
    enabled.checked = true;
    count.value = "";
    await handlers.saveUserOptions();
    expect(alert).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(count);
    expect(setOptions).not.toHaveBeenCalled();
    enabled.checked = false;
    await handlers.saveUserOptions();
    expect(setOptions).toHaveBeenCalledTimes(1);
  });

  test("reopening retains the unsaved draft and only explicit save changes active filters", async () => {
    const { handlers, state } = mount();
    const input = control<HTMLInputElement>('[name="NF_BLOCKED_ENABLED"]');
    const textarea = control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]');
    toggleDialog(state);
    input.checked = true;
    textarea.value = "Changed";
    toggleDialog(state);
    toggleDialog(state);
    expect(textarea.value).toBe("Changed");
    expect(state.filters.NF_BLOCKED_ENABLED).toBe(false);
    await handlers.saveUserOptions();
    expect(state.filters.NF_BLOCKED_ENABLED).toBe(true);
    expect(state.filters.NF_BLOCKED_TEXT).toEqual(["Changed"]);
  });
});

describe("settings placement preferences", () => {
  test.each(["0", "1", "2"])(
    "remounts floating/topbar/hidden placement %s after save",
    async (placement) => {
      const { state, handlers } = mount({
        ...allKnownOptions,
        CMF_BTN_OPTION: placement === "0" ? "1" : "0",
      });
      const previous = state.btnToggleEl;
      control<HTMLInputElement>(`[name="CMF_BTN_OPTION"][value="${placement}"]`).checked = true;
      await handlers.saveUserOptions();
      const toggle = control("#fbcmfToggle");
      expect(toggle).not.toBe(previous);
      expect(toggle.tagName).toBe(placement === "1" ? "DIV" : "BUTTON");
      expect(toggle.classList.contains("fb-cmf-toggle-topbar")).toBe(placement === "1");
      state.cssID = "settings-placement-style";
      const styleTag = document.createElement("style");
      styleTag.id = state.cssID;
      document.head.appendChild(styleTag);
      addExtraCSS(state, state.options, defaults);
      const style = control<HTMLStyleElement>(`#${state.cssID}`);
      if (placement === "2") expect(style.textContent).toContain("display:none !important");
      expect(control<HTMLElement>(".fb-cmf-close").hidden).toBe(placement === "1");
    }
  );
});

test.each(["0", "1"])(
  "applies dialog side %s and all saved presentation colors to actual styles",
  async (placement) => {
    const { state, handlers } = mount();
    control<HTMLInputElement>(`[name="CMF_DIALOG_OPTION"][value="${placement}"]`).checked = true;
    control<HTMLInputElement>('[name="CMF_BORDER_COLOUR"]').value = "#102030";
    control<HTMLInputElement>('[name="VERBOSITY_MESSAGE_COLOUR"]').value = "#405060";
    control<HTMLInputElement>('[name="VERBOSITY_MESSAGE_BG_COLOUR"]').value = "#708090";
    control<HTMLInputElement>('[name="VERBOSITY_LEVEL"][value="1"]').checked = true;
    control<HTMLInputElement>('[name="VERBOSITY_DEBUG"]').checked = true;
    await handlers.saveUserOptions();
    addCSS(state, state.options, defaults);
    addExtraCSS(state, state.options, defaults);
    const style = control<HTMLStyleElement>(`#${state.cssID}`);
    expect(style.textContent).toContain("border:3px dotted #102030 !important");
    expect(style.textContent).toContain("color:#405060");
    expect(style.textContent).toContain("background-color:#708090");
    expect(style.textContent).toContain(placement === "1" ? "right:16px" : "left:16px");
    expect(state.options.VERBOSITY_LEVEL).toBe("1");
    expect(state.options.VERBOSITY_DEBUG).toBe(true);
  }
);

test("unknown stored and site language constructs an English fallback without activating text filters", async () => {
  document.documentElement.lang = "zz";
  const { state, handlers } = mount({ ...allKnownOptions, CMF_DIALOG_LANGUAGE: "unknown" });
  expect(state.language).toBe("zz");
  expect(control("#fbcmf").dir).toBe("ltr");
  expect(control("#BTNSave .cmf-action-text").textContent).toBe(translations.en.DLG_BUTTONS[0]);
  expect(state.filters.NF_BLOCKED_ENABLED).toBe(false);
  await handlers.saveUserOptions();
  expect(state.language).toBe("en");
  expect(state.filters.NF_BLOCKED_ENABLED).toBe(false);
});
