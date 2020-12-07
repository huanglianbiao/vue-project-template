const path = require("path");

const rootPath = path.resolve(__dirname, "../");
const entryPath = path.resolve(__dirname, "../src/index.js");
const indexHtmlPath = path.resolve(__dirname, "../index.html");
const srcPath = path.resolve(__dirname, "../src");
const componentsPath = path.resolve(__dirname, "../src/components");
const viewsPath = path.resolve(__dirname, "../src/views");
const utilsPath = path.resolve(__dirname, "../src/utils");
const MockPath = path.resolve(__dirname, "../mock/index.js");

const outputPath = path.resolve(__dirname, "../dist");
// const lessVariablesPath = path.resolve(__dirname, "../src/assets/style/variables/*.less");
const staticPath = path.resolve(__dirname, "../static");
const distStaticPath = path.resolve(__dirname, "../dist/static");

module.exports = {
  rootPath,
  entryPath,
  indexHtmlPath,
  srcPath,
  componentsPath,
  viewsPath,
  utilsPath,
  MockPath,
  outputPath,
  // lessVariablesPath,
  staticPath,
  distStaticPath
};
