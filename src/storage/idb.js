const idbKeyval = require("../vendor/idb-keyval");

const DB_NAME = "dbCMF";
const DB_STORE = "Mopping";
const DB_KEY = "Options";

const optionsStore = idbKeyval.createStore(DB_NAME, DB_STORE);

function getOptions() {
  return idbKeyval.get(DB_KEY, optionsStore);
}

function setOptions(options) {
  return idbKeyval.set(DB_KEY, options, optionsStore);
}

function deleteOptions() {
  return idbKeyval.del(DB_KEY, optionsStore);
}

module.exports = {
  DB_KEY,
  DB_NAME,
  DB_STORE,
  deleteOptions,
  getOptions,
  optionsStore,
  setOptions,
};
