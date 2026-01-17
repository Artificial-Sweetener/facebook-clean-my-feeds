const { observeAttributes } = require("../../src/dom/mutations");

describe("dom/mutations", () => {
  test("observeAttributes returns null when MutationObserver missing", () => {
    const original = global.MutationObserver;
    delete global.MutationObserver;

    const observer = observeAttributes(document.body, {}, jest.fn());
    expect(observer).toBeNull();

    global.MutationObserver = original;
  });

  test("observeAttributes wires MutationObserver", () => {
    const observe = jest.fn();
    const original = global.MutationObserver;
    global.MutationObserver = jest.fn(() => ({ observe, disconnect: jest.fn() }));

    const target = document.createElement("div");
    const options = { attributes: true };
    const callback = jest.fn();
    const observer = observeAttributes(target, options, callback);

    expect(observer).not.toBeNull();
    expect(observe).toHaveBeenCalledWith(target, options);

    global.MutationObserver = original;
  });
});
