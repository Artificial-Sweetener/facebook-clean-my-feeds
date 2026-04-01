const {
  getTopbarControlButtons,
  getTopbarMenuButton,
  isTopbarControlButton,
} = require("../../src/dom/topbar-controls");

function mockRect(element, { left, top, width, height }) {
  Object.defineProperty(element, "getBoundingClientRect", {
    configurable: true,
    value: () => ({
      x: left,
      y: top,
      left,
      top,
      width,
      height,
      right: left + width,
      bottom: top + height,
      toJSON: () => null,
    }),
  });
}

describe("dom/topbar-controls", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("finds the leftmost button in the rightmost banner control cluster", () => {
    const banner = document.createElement("div");
    banner.setAttribute("role", "banner");
    mockRect(banner, { left: 0, top: 0, width: 900, height: 56 });

    const backButton = document.createElement("button");
    backButton.setAttribute("aria-label", "Back");
    mockRect(backButton, { left: 8, top: 8, width: 40, height: 40 });

    const searchButton = document.createElement("button");
    searchButton.setAttribute("aria-label", "Search helper");
    mockRect(searchButton, { left: 320, top: 18, width: 20, height: 20 });

    const menuButton = document.createElement("div");
    menuButton.setAttribute("role", "button");
    menuButton.setAttribute("tabindex", "0");
    menuButton.setAttribute("aria-label", "Localized menu");
    mockRect(menuButton, { left: 700, top: 8, width: 40, height: 40 });

    const messengerButton = document.createElement("button");
    messengerButton.setAttribute("aria-label", "Localized messages");
    mockRect(messengerButton, { left: 748, top: 8, width: 40, height: 40 });

    const notificationsButton = document.createElement("button");
    notificationsButton.setAttribute("aria-expanded", "false");
    mockRect(notificationsButton, { left: 796, top: 8, width: 40, height: 40 });

    banner.appendChild(backButton);
    banner.appendChild(searchButton);
    banner.appendChild(menuButton);
    banner.appendChild(messengerButton);
    banner.appendChild(notificationsButton);
    document.body.appendChild(banner);

    expect(getTopbarControlButtons()).toEqual([
      menuButton,
      messengerButton,
      notificationsButton,
    ]);
    expect(getTopbarMenuButton()).toBe(menuButton);
    expect(isTopbarControlButton(menuButton)).toBe(true);
    expect(isTopbarControlButton(backButton)).toBe(false);
  });
});
