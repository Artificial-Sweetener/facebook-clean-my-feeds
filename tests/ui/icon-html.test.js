const { buildIconHTML } = require("../../src/ui/icon-html");

describe("ui/icon-html", () => {
  test("buildIconHTML includes the data uri and class names", () => {
    const html = buildIconHTML("data:image/png;base64,abc", "extra");
    expect(html).toContain("cmf-icon");
    expect(html).toContain("extra");
    expect(html).toContain("data:image/png;base64,abc");
  });
});
