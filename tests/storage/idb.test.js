jest.mock("../../src/vendor/idb-keyval", () => ({
  createStore: jest.fn(() => "store"),
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
}));

describe("storage/idb", () => {
  test("creates store with expected constants", () => {
    jest.isolateModules(() => {
      const idbKeyval = require("../../src/vendor/idb-keyval");
      const { DB_NAME, DB_STORE, optionsStore } = require("../../src/storage/idb");
      expect(idbKeyval.createStore).toHaveBeenCalledWith(DB_NAME, DB_STORE);
      expect(optionsStore).toBe("store");
    });
  });

  test("getOptions delegates to idb-keyval", () => {
    jest.isolateModules(() => {
      const idbKeyval = require("../../src/vendor/idb-keyval");
      const { DB_KEY, getOptions } = require("../../src/storage/idb");
      getOptions();
      expect(idbKeyval.get).toHaveBeenCalledWith(DB_KEY, "store");
    });
  });

  test("setOptions delegates to idb-keyval", () => {
    jest.isolateModules(() => {
      const idbKeyval = require("../../src/vendor/idb-keyval");
      const { DB_KEY, setOptions } = require("../../src/storage/idb");
      setOptions({ a: 1 });
      expect(idbKeyval.set).toHaveBeenCalledWith(DB_KEY, { a: 1 }, "store");
    });
  });

  test("deleteOptions delegates to idb-keyval", () => {
    jest.isolateModules(() => {
      const idbKeyval = require("../../src/vendor/idb-keyval");
      const { DB_KEY, deleteOptions } = require("../../src/storage/idb");
      deleteOptions();
      expect(idbKeyval.del).toHaveBeenCalledWith(DB_KEY, "store");
    });
  });
});
