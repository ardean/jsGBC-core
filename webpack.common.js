const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.worklet\.js$/,
        use: { loader: "worklet-loader" }
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  output: {
    filename: "jsgbc-core.js",
    path: path.resolve(__dirname, "dist"),
    globalObject: "typeof self !== 'undefined' ? self : this",
    library: "jsgbc-core",
    libraryTarget: "umd"
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    })
  ]
};