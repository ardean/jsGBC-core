const merge = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",
  entry: "./demoV2/index.ts",
  devtool: "inline-source-map"
});