const path = require("path");

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

module.exports = {
  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: {
      "@": resolve("src"),
      utils: resolve("src/utils")
    }
  }
};
