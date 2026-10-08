/** @jest-environment node */
// SPDX-License-Identifier: GPL-3.0-only

import { runInContext } from "node:vm";
import { IDBFactory } from "fake-indexeddb";
import { JSDOM, VirtualConsole, type DOMWindow } from "jsdom";
import { buildUserscript } from "../../tools/build";

/** A synthetic page owns its errors and manager callbacks so bundle globals cannot leak between runs. */
interface BundleFixture {
  dom: JSDOM;
  window: DOMWindow;
  errors: unknown[];
  menus: Array<{ caption: string; open: () => void }>;
}

const fixtures: BundleFixture[] = [];
let bundledCode = "";

/**
 * Yield to real IndexedDB tasks and browser microtasks until an observable condition settles.
 * @param predicate Synchronous check of the public DOM or persisted result.
 * @param description Failure context included when the bounded wait expires.
 * @throws If the condition has not become true within two seconds.
 */
async function waitFor(predicate: () => boolean, description: string): Promise<void> {
  const deadline = Date.now() + 2000;
  while (!predicate()) {
    if (Date.now() >= deadline) throw new Error(`Timed out waiting for ${description}`);
    await new Promise<void>((resolve) => setTimeout(resolve, 5));
  }
}

/** Reject missing test markup immediately while retaining the query's precise element type. */
function requiredElement<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Missing bundle fixture element: ${selector}`);
  return element;
}

/**
 * Execute the final IIFE with its actual assets, UI, storage adapter, and route composition.
 * The Facebook URL is only a local JSDOM origin; scripts and subresources never load remotely.
 * @param database Per-test IndexedDB implementation, shared only for explicit reload checks.
 * @param withManager Whether optional manager globals and metadata are supplied.
 * @returns A tracked page whose window is always closed by afterEach, including failed startup.
 */
async function startBundle(database: IDBFactory, withManager: boolean): Promise<BundleFixture> {
  const errors: unknown[] = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("jsdomError", (error: unknown) => errors.push(error));
  virtualConsole.on("error", (error: unknown) => errors.push(error));
  virtualConsole.on("warn", (warning: unknown) => errors.push(warning));
  const dom = new JSDOM(
    '<!doctype html><html lang="en"><head></head><body><div role="banner"></div><div role="navigation"></div><div role="main"><div role="feed"><div aria-posinset="1"><a href="/private-person/posts/private-post-id">Private Person</a><p>Private post body sentinel</p></div></div></div></body></html>',
    {
      url: "https://www.facebook.com/?private_query=secret-query#secret-fragment",
      runScripts: "outside-only",
      pretendToBeVisual: true,
      virtualConsole,
    }
  );
  const { window } = dom;
  const fixture: BundleFixture = { dom, window, errors, menus: [] };
  fixtures.push(fixture);
  Object.defineProperty(window, "indexedDB", { value: database });
  window.addEventListener("error", (event) => errors.push(event.error));
  window.addEventListener("unhandledrejection", (event) => errors.push(event.reason));
  if (withManager) {
    Object.defineProperty(window, "GM", {
      value: {
        info: {
          script: { name: "FB - Clean my feeds", version: "6.3.2" },
          scriptHandler: "Synthetic Manager",
        },
        /** Record the manager's optional settings action without depending on a real extension. */
        registerMenuCommand(caption: string, open: () => void): void {
          fixture.menus.push({ caption, open });
        },
      },
    });
  }
  runInContext(bundledCode, dom.getInternalVMContext(), { timeout: 2000 });
  await waitFor(() => window.document.querySelector("#fbcmf") !== null, "settings mount");
  return fixture;
}

/**
 * Read the historical storage contract independently of the bundle's private module scope.
 * @param database The same IndexedDB factory installed on the synthetic browser window.
 * @returns The committed raw Options value without assuming its external data type.
 * @throws Native IndexedDB open, request, or transaction errors.
 */
async function readStoredOptions(database: IDBFactory): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const opening = database.open("dbCMF");
    opening.onerror = () => reject(opening.error);
    opening.onsuccess = () => {
      const connection = opening.result;
      const transaction = connection.transaction("Mopping", "readonly");
      const request: IDBRequest<unknown> = transaction.objectStore("Mopping").get("Options");
      transaction.oncomplete = () => {
        connection.close();
        resolve(request.result);
      };
      transaction.onabort = () => {
        connection.close();
        reject(transaction.error);
      };
      request.onerror = () => reject(request.error);
    };
  });
}

beforeAll(async () => {
  bundledCode = (await buildUserscript()).code;
});

afterEach(() => {
  const errors = fixtures.flatMap((fixture) => fixture.errors);
  for (const fixture of fixtures.splice(0)) fixture.window.close();
  expect(errors).toEqual([]);
});

describe("compiled userscript smoke", () => {
  test.each([false, true])(
    "mounts, saves, reloads, and redacts reports with optional GM present: %s",
    async (withManager) => {
      const database = new IDBFactory();
      const fixture = await startBundle(database, withManager);
      const { document } = fixture.window;
      const dialog = requiredElement<HTMLElement>(document, "#fbcmf");
      const toggle = requiredElement<HTMLElement>(document, "#fbcmfToggle");
      const style = requiredElement<HTMLStyleElement>(document, "head style");
      expect(document.querySelectorAll("#fbcmf")).toHaveLength(1);
      expect(style.textContent).toContain(".fb-cmf");
      expect(style.sheet?.cssRules.length).toBeGreaterThan(0);
      expect(fixture.window.getComputedStyle(dialog).visibility).toBe("hidden");
      expect(fixture.menus).toHaveLength(withManager ? 1 : 0);
      if (withManager) {
        const menu = fixture.menus[0];
        if (!menu) throw new Error("Expected the optional manager settings command");
        expect(menu.caption).toMatch(/settings/i);
        menu.open();
      } else {
        toggle.click();
      }
      expect(toggle.getAttribute("data-cmf-open")).toBe("true");
      expect(fixture.window.getComputedStyle(dialog).visibility).toBe("visible");
      toggle.click();
      expect(toggle.hasAttribute("data-cmf-open")).toBe(false);
      expect(fixture.window.getComputedStyle(dialog).visibility).toBe("hidden");
      toggle.click();
      expect(toggle.getAttribute("data-cmf-open")).toBe("true");

      const blocked = requiredElement<HTMLInputElement>(dialog, 'input[name="NF_BLOCKED_ENABLED"]');
      const keywords = requiredElement<HTMLTextAreaElement>(
        dialog,
        'textarea[name="NF_BLOCKED_TEXT"]'
      );
      blocked.checked = true;
      keywords.value = "private-keyword-sentinel";
      keywords.dispatchEvent(new fixture.window.Event("input", { bubbles: true }));
      const save = requiredElement<HTMLButtonElement>(dialog, "#BTNSave");
      expect(save.classList.contains("cmf-action--dirty")).toBe(true);
      save.click();
      await waitFor(() => save.classList.contains("cmf-action--confirm-blue"), "saved settings");
      expect(save.classList.contains("cmf-action--dirty")).toBe(false);
      const stored = await readStoredOptions(database);
      if (typeof stored !== "string") throw new Error("Expected historical JSON-string options");
      const decoded: unknown = JSON.parse(stored);
      expect(decoded).toEqual(
        expect.objectContaining({
          NF_BLOCKED_ENABLED: true,
          NF_BLOCKED_TEXT: "private-keyword-sentinel",
        })
      );

      requiredElement<HTMLButtonElement>(dialog, "#BTNReportGenerate").click();
      const report = requiredElement<HTMLTextAreaElement>(dialog, ".cmf-report-output");
      const reportData: unknown = JSON.parse(report.value);
      expect(reportData).toEqual(
        expect.objectContaining({
          page: expect.objectContaining({
            url: "https://www.facebook.com/",
            pathname: "/",
            search: "",
          }),
          environment: expect.objectContaining({ hasGM: withManager, hasGMInfo: withManager }),
          options: expect.objectContaining({ NF_BLOCKED_TEXT: "[redacted]" }),
          blockedFilters: expect.objectContaining({
            NF_BLOCKED_TEXT_LC: expect.objectContaining({ count: 1 }),
          }),
        })
      );
      for (const secret of [
        "secret-query",
        "secret-fragment",
        "private-keyword-sentinel",
        "Private Person",
        "Private post body sentinel",
        "private-person",
        "private-post-id",
      ])
        expect(report.value).not.toContain(secret);
      expect(report.classList.contains("cmf-report-output--visible")).toBe(true);
      fixture.window.close();

      const reloaded = await startBundle(database, withManager);
      expect(
        requiredElement<HTMLInputElement>(
          reloaded.window.document,
          'input[name="NF_BLOCKED_ENABLED"]'
        ).checked
      ).toBe(true);
      expect(
        requiredElement<HTMLTextAreaElement>(
          reloaded.window.document,
          'textarea[name="NF_BLOCKED_TEXT"]'
        ).value
      ).toBe("private-keyword-sentinel");
    }
  );
});
