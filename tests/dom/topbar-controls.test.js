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

    expect(getTopbarControlButtons()).toEqual([menuButton, messengerButton, notificationsButton]);
    expect(getTopbarMenuButton()).toBe(menuButton);
    expect(isTopbarControlButton(menuButton)).toBe(true);
    expect(isTopbarControlButton(backButton)).toBe(false);
  });

  test("includes square page-mode topbar links and dedupes nested controls", () => {
    const banner = document.createElement("div");
    banner.setAttribute("role", "banner");
    mockRect(banner, { left: 0, top: 0, width: 1935, height: 56 });

    const homeLink = document.createElement("a");
    homeLink.setAttribute("aria-label", "Home");
    homeLink.setAttribute("href", "/");
    mockRect(homeLink, { left: 628, top: 0, width: 130, height: 56 });

    const menuButton = document.createElement("div");
    menuButton.setAttribute("role", "button");
    menuButton.setAttribute("aria-label", "Facebook menu");
    mockRect(menuButton, { left: 1735, top: 8, width: 40, height: 40 });

    const messengerLink = document.createElement("a");
    messengerLink.setAttribute("aria-label", "Messenger");
    messengerLink.setAttribute("href", "https://business.facebook.com/latest/inbox/all/");
    mockRect(messengerLink, { left: 1783, top: 8, width: 40, height: 40 });

    const nestedMessengerLink = document.createElement("a");
    nestedMessengerLink.setAttribute("aria-label", "Messenger");
    nestedMessengerLink.setAttribute("href", "https://business.facebook.com/latest/inbox/all/");
    mockRect(nestedMessengerLink, { left: 1783, top: 8, width: 40, height: 40 });
    messengerLink.appendChild(nestedMessengerLink);

    const notificationsButton = document.createElement("div");
    notificationsButton.setAttribute("role", "button");
    notificationsButton.setAttribute("aria-label", "Notifications");
    mockRect(notificationsButton, { left: 1831, top: 8, width: 40, height: 40 });

    const profileButton = document.createElement("div");
    profileButton.setAttribute("role", "button");
    profileButton.setAttribute("aria-label", "Your profile");
    mockRect(profileButton, { left: 1879, top: 8, width: 40, height: 40 });

    banner.appendChild(homeLink);
    banner.appendChild(menuButton);
    banner.appendChild(messengerLink);
    banner.appendChild(notificationsButton);
    banner.appendChild(profileButton);
    document.body.appendChild(banner);

    expect(getTopbarControlButtons()).toEqual([
      menuButton,
      messengerLink,
      notificationsButton,
      profileButton,
    ]);
    expect(getTopbarMenuButton()).toBe(menuButton);
    expect(isTopbarControlButton(messengerLink)).toBe(true);
    expect(isTopbarControlButton(homeLink)).toBe(false);
    expect(isTopbarControlButton(nestedMessengerLink)).toBe(false);
  });
});
