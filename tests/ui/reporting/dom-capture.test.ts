// SPDX-License-Identifier: GPL-3.0-only

import { captureDomSnapshot } from "../../../src/diagnostics/dom-capture";
import type {
  DomSnapshot,
  SnapshotElement,
  SnapshotNode,
} from "../../../src/core/diagnostics/dom-snapshot";

/** Flatten element records without consulting the original DOM, as an offline consumer must do. */
function elements(snapshot: DomSnapshot): SnapshotElement[] {
  const found: SnapshotElement[] = [];
  const queue: SnapshotNode[] = snapshot.regions.map((region) => region.root);
  queue.push(
    ...snapshot.references.flatMap((reference) => (reference.target ? [reference.target] : []))
  );
  while (queue.length) {
    const node = queue.pop();
    if (node?.kind === "element") {
      found.push(node);
      queue.push(...node.children);
    }
  }
  return found;
}

/** Build an unknown interface beside private authored content and one separately named SVG disclosure. */
function mountComplaint(): Element {
  document.body.innerHTML = `<nav role="navigation"><button>Notifications</button></nav><main role="main">
    <div role="article" id="account-PrivateIdentity" class="private-user-class"><div><h4><a data-ad-rendering-role="profile_name" href="/PrivateIdentity?secret=PrivateToken">Alice PrivateSurname</a><a href="/publisher?__cft__[0]=${"PrivateTracking".repeat(30)}"><span aria-labelledby="private-shared-label"><svg><use href="#private-artwork"></use></svg></span></a></h4></div>
      <div data-ad-rendering-role="story_message"><p>PrivateBody <button aria-label="PrivateControl">PrivateControl</button><img src="https://private-media.example/private-photo" alt="PrivateImage" /></p></div>
      <div role="comment"><a href="/PrivateCommenter">PrivateCommenter</a><p>PrivateComment</p></div>
    </div>
    <section role="region" data-unfamiliar-widget="PrivateAttribute"><h3>Neighborhood discoveries</h3><button id="complaint" aria-label="Explore nearby topics">Explore nearby topics</button><button>Hide this module</button></section>
    <section><h3>Neighbor module</h3><button>Keep this module</button></section>
  </main><span id="private-shared-label">Paid placement</span><svg id="private-artwork"><path d="PrivateGeometry"></path></svg>`;
  const target = document.getElementById("complaint");
  if (!target) throw new Error("Missing complaint fixture");
  return target;
}

afterEach(() => {
  document.body.replaceChildren();
  jest.restoreAllMocks();
});

describe("independent sanitized DOM capture", () => {
  test("retains unfamiliar interface structure and neighboring context independently of detector matches", async () => {
    const target = mountComplaint();
    const snapshot = await captureDomSnapshot(document, { target });
    const text = JSON.stringify(snapshot);
    expect(text).toContain("Neighborhood discoveries");
    expect(text).toContain("Explore nearby topics");
    expect(text).toContain("Keep this module");
    expect(snapshot.target).not.toBeNull();
    expect(snapshot.regions[0]?.selection).toBe("target");
    expect(snapshot.regions[0]?.root.tag).toBe("section");
    expect(
      snapshot.regions[0]?.ancestors.some((ancestor) => ancestor.attributes.role === "main")
    ).toBe(true);
    const buttons = elements(snapshot).filter((node) => node.tag === "button");
    expect(buttons.some((node) => node.attributes["aria-label"] === "Explore nearby topics")).toBe(
      true
    );
    expect(
      elements(snapshot).some(
        (node) =>
          "data-unfamiliar-widget" in node.attributes &&
          node.attributes["data-unfamiliar-widget"] === ""
      )
    ).toBe(true);
  });

  test("preserves external ARIA/SVG relationships and a previously unknown graphic disclosure label", async () => {
    const target = mountComplaint();
    const snapshot = await captureDomSnapshot(document, { target });
    expect(JSON.stringify(snapshot)).toContain("Paid placement");
    const graphic = elements(snapshot).find((node) => node.attributes["aria-labelledby"]);
    expect(graphic).toBeDefined();
    expect(
      snapshot.references.some(
        (reference) =>
          reference.id === graphic?.attributes["aria-labelledby"] && reference.status === "external"
      )
    ).toBe(true);
    expect(JSON.stringify(snapshot)).toContain("data-cmf-cft-length");
    expect(JSON.stringify(snapshot)).not.toContain("PrivateTracking");
    expect(JSON.stringify(snapshot)).not.toContain("PrivateGeometry");
  });

  test("redacts authored controls, identities, identifiers, media, arbitrary attributes and personal destinations throughout JSON", async () => {
    const target = mountComplaint();
    const snapshot = await captureDomSnapshot(document, { target });
    const text = JSON.stringify(snapshot);
    for (const secret of [
      "Alice",
      "PrivateSurname",
      "PrivateIdentity",
      "PrivateToken",
      "private-user-class",
      "private-shared-label",
      "private-artwork",
      "PrivateBody",
      "PrivateControl",
      "PrivateImage",
      "PrivateComment",
      "PrivateAttribute",
      "private-media",
      "private-photo",
      "PrivateTracking",
      "PrivateGeometry",
    ])
      expect(text).not.toContain(secret);
    expect(text).toContain("[authored text]");
    expect(text).toContain("cmf-class-");
    expect(snapshot.privacy.interfaceLabels).toBe("automatically-sanitized");
  });

  test("redacts personalized labels using locally observed identity evidence", async () => {
    const target = mountComplaint();
    target.setAttribute(
      "aria-label",
      "Send to Alice PrivateSurname at alice@example.test or +1 555 123 4567"
    );
    const snapshot = await captureDomSnapshot(document, { target });
    const text = JSON.stringify(snapshot);
    for (const secret of ["Alice", "PrivateSurname", "alice@example.test", "555 123 4567"])
      expect(text).not.toContain(secret);
    expect(text).toContain("[identity]");
    expect(text).toContain("[email]");
  });

  test("does not promote an external authored label into public interface text", async () => {
    const target = mountComplaint();
    document.getElementById("private-shared-label")?.remove();
    document.body.insertAdjacentHTML(
      "beforeend",
      '<p><span id="private-shared-label">PrivateExternalMessage</span></p>'
    );
    const snapshot = await captureDomSnapshot(document, { target });
    expect(JSON.stringify(snapshot)).not.toContain("PrivateExternalMessage");
    expect(
      snapshot.references.some(
        (reference) => reference.status === "external" && reference.target?.content === "authored"
      )
    ).toBe(true);
  });

  test("records missing references without inventing evidence", async () => {
    const target = mountComplaint();
    target.setAttribute("aria-labelledby", "missing-private-id");
    const snapshot = await captureDomSnapshot(document, { target });
    expect(snapshot.references.some((reference) => reference.status === "missing")).toBe(true);
    expect(JSON.stringify(snapshot)).not.toContain("missing-private-id");
  });

  test("captures hidden decoys as concealed structure and does not mutate Facebook nodes", async () => {
    const target = mountComplaint();
    target.insertAdjacentHTML(
      "afterend",
      '<button hidden style="display:none">Hidden decoy</button>'
    );
    const before = document.documentElement.outerHTML;
    const snapshot = await captureDomSnapshot(document, { target });
    expect(document.documentElement.outerHTML).toBe(before);
    expect(
      elements(snapshot).some(
        (node) => node.attributes.hidden === "" && node.layout.display === "none"
      )
    ).toBe(true);
  });

  test("reports node, depth, discovery and region limits explicitly", async () => {
    const target = mountComplaint();
    const snapshot = await captureDomSnapshot(document, {
      target,
      limits: { nodes: 12, nodesPerRegion: 8, depth: 2, discoveryNodes: 10, regions: 2 },
    });
    expect(snapshot.coverage.capturedNodes).toBeLessThanOrEqual(12);
    expect(snapshot.coverage.discoveryComplete).toBe(false);
    expect(snapshot.coverage.regionSelectionComplete).toBe(false);
    expect(Object.keys(snapshot.coverage.omissions).length).toBeGreaterThan(0);
    expect(snapshot.regions[0]?.selection).toBe("target");
  });

  test("oversized interface labels are explicitly omitted rather than partially exported", async () => {
    const target = mountComplaint();
    target.textContent = "long interface label ".repeat(30);
    const snapshot = await captureDomSnapshot(document, {
      target,
      limits: { labelCharacters: 24 },
    });
    expect(snapshot.coverage.omissions["label-limit"]).toBeGreaterThan(0);
    expect(JSON.stringify(snapshot)).not.toContain("A".repeat(40));
  });

  test("attribute budgets cannot silently erase evidence or publish oversized values", async () => {
    const target = mountComplaint();
    target.setAttribute("title", "SensitiveAttribute".repeat(400));
    const oversized = await captureDomSnapshot(document, { target });
    expect(oversized.coverage.omissions["attribute-value-limit"]).toBeGreaterThan(0);
    expect(JSON.stringify(oversized)).not.toContain("SensitiveAttribute");
    const bounded = await captureDomSnapshot(document, { target, limits: { attributes: 3 } });
    expect(bounded.coverage.omissions["attribute-limit"]).toBeGreaterThan(0);
  });

  test("personalized labels near a complaint remain redacted when global discovery stops before it", async () => {
    const target = mountComplaint();
    target.setAttribute("aria-label", "Send to Alice PrivateSurname");
    document.body.insertAdjacentHTML("afterbegin", "<div></div>".repeat(200));
    const snapshot = await captureDomSnapshot(document, { target, limits: { discoveryNodes: 20 } });
    expect(snapshot.coverage.discoveryComplete).toBe(false);
    expect(snapshot.coverage.identitySeedNodes).toBeGreaterThan(0);
    expect(JSON.stringify(snapshot)).not.toMatch(/Alice|PrivateSurname/);
  });

  test("changes during cooperative capture are reported instead of implying an atomic page snapshot", async () => {
    const target = mountComplaint();
    const pending = captureDomSnapshot(document, { target });
    target.setAttribute("aria-expanded", "true");
    const snapshot = await pending;
    expect(snapshot.coverage.mutationsDuringCapture).toBeGreaterThan(0);
  });

  test("does not sample settings inputs or previously generated reports", async () => {
    const target = mountComplaint();
    document.body.insertAdjacentHTML(
      "beforeend",
      '<div id="fbcmf"><h2>PrivateSettingsHeading</h2><textarea>PrivateReportData</textarea></div>'
    );
    const snapshot = await captureDomSnapshot(document, { target });
    expect(JSON.stringify(snapshot)).not.toMatch(/PrivateSettingsHeading|PrivateReportData/);
  });

  test.each(["محتوى ترويجي جديد", "新しいおすすめ", "Nouveaux sujets à découvrir", "Нова добірка"])(
    "retains unfamiliar interface copy without guessing its language: %s",
    async (label) => {
      const target = mountComplaint();
      target.textContent = label;
      target.setAttribute("aria-label", label);
      const snapshot = await captureDomSnapshot(document, { target });
      expect(JSON.stringify(snapshot)).toContain(label);
    }
  );
});
test("identity names from ordinary profile anchors are removed from personalized controls", async () => {
  document.body.innerHTML =
    '<nav><a href="/PrivateOwner">PrivateOwner FamilyName</a><a href="/pages/create">Create a post</a></nav><main role="main"><button>What is on your mind, PrivateOwner?</button><button>Create a post</button></main>';
  const snapshot = await captureDomSnapshot(document);
  expect(JSON.stringify(snapshot)).not.toContain("PrivateOwner");
  expect(JSON.stringify(snapshot)).not.toContain("FamilyName");
  expect(JSON.stringify(snapshot)).toContain("Create a post");
  expect(JSON.stringify(snapshot)).toContain("[identity]");
});

test("a selected unfamiliar heading includes its nearby controls through wrapper-only ancestors", async () => {
  document.body.innerHTML =
    '<main role="main"><div data-new-card=""><div><div><div><div><h3>Unfamiliar prompt</h3><p>Private text</p></div></div></div></div><button>Dismiss</button></div><article role="article"><p>Private neighbor</p></article></main>';
  const snapshot = await captureDomSnapshot(document, { target: document.querySelector("h3") });
  const region = snapshot.regions[0];
  expect(region?.selection).toBe("target");
  expect(region?.root.attributes).toHaveProperty("data-new-card");
  expect(JSON.stringify(region)).toContain("Dismiss");
  expect(JSON.stringify(snapshot)).not.toContain("Private text");
  expect(snapshot.regions[1]?.selection).toBe("neighbor");
});
