const merge = require("webpack-merge");
const common = require("./webpack.common");
const nodeExternals = require("webpack-node-externals");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  externals: [nodeExternals()],
  plugins: [
    new CleanWebpackPlugin(["dist"])
  ]
});