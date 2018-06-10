const merge = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",
  entry: "./demo/index.ts",
  devtool: "inline-source-map"
});