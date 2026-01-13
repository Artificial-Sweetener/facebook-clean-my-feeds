const fs = require("fs");
const path = require("path");
const vm = require("vm");

const sourcePath = path.join(__dirname, "..", "..", "fb-clean-my-feeds.user.js");

function extractFunctionSource(source, functionName) {
  const marker = `function ${functionName}`;
  const startIndex = source.indexOf(marker);
  if (startIndex === -1) {
    throw new Error(`Function not found: ${functionName}`);
  }

  const nextFunctionIndex = source.indexOf("\n    function ", startIndex + marker.length);
  if (nextFunctionIndex === -1) {
    return source.slice(startIndex);
  }

  return source.slice(startIndex, nextFunctionIndex);
}

function loadFunctions(functionNames, contextExtras = {}) {
  const source = fs.readFileSync(sourcePath, "utf8");
  const context = vm.createContext({
    console,
    ...contextExtras,
  });

  const exports = {};
  for (const functionName of functionNames) {
    const functionSource = extractFunctionSource(source, functionName);
    vm.runInContext(functionSource, context);
    if (typeof context[functionName] !== "function") {
      throw new Error(`Function not loaded: ${functionName}`);
    }
    exports[functionName] = context[functionName];
  }

  return exports;
}

module.exports = {
  loadFunctions,
};
