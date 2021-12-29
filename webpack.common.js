const path = require("path");
const webpack = require("webpack");
const WorkerUrlPlugin = require("worker-url/plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    globalObject: "typeof self !== 'undefined' ? self : this",
    library: "jsgbc-core",
    libraryTarget: "umd",
    umdNamedDefine: true,
    publicPath: "/",
    filename: (pathData) => {
      return pathData.chunk.name === "main" ?
        "jsgbc-core.js" :
        pathData.chunk.name + ".js";
    }
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]),
    new WorkerUrlPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    })
  ]
};