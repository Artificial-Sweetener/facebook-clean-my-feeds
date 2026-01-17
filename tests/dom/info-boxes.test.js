jest.mock("../../src/dom/hide", () => ({
  hideBlock: jest.fn(),
}));

const { hideBlock } = require("../../src/dom/hide");
const { scrubInfoBoxes } = require("../../src/dom/info-boxes");
const { postAtt } = require("../../src/dom/attributes");

describe("dom/info-boxes", () => {
  test("scrubInfoBoxes hides matching info box once", () => {
    const post = document.createElement("div");
    post.innerHTML = `
      <div>
        <a href="/coronavirus_info/test">Link</a>
      </div>
    `;
    const options = {
      OTHER_INFO_BOX_CORONAVIRUS: true,
      OTHER_INFO_BOX_CLIMATE_SCIENCE: true,
      OTHER_INFO_BOX_SUBSCRIBE: true,
    };
    const keyWords = {
      OTHER_INFO_BOX_CORONAVIRUS: "Coronavirus",
      OTHER_INFO_BOX_CLIMATE_SCIENCE: "Climate Science",
      OTHER_INFO_BOX_SUBSCRIBE: "Subscribe",
    };
    const pathInfo = {
      OTHER_INFO_BOX_CORONAVIRUS: { pathMatch: "/coronavirus_info/" },
      OTHER_INFO_BOX_CLIMATE_SCIENCE: { pathMatch: "/climatescienceinfo/" },
      OTHER_INFO_BOX_SUBSCRIBE: { pathMatch: "/support/" },
    };
    const state = { cssHideEl: "hide", showAtt: "show" };

    scrubInfoBoxes(post, options, keyWords, pathInfo, state);

    expect(hideBlock).toHaveBeenCalledTimes(1);
    const args = hideBlock.mock.calls[0];
    expect(args[2]).toBe("Coronavirus");
    expect(args[5]).toEqual({ postAtt });
  });
});
