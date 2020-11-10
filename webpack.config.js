const webpack = require("webpack");
const { merge } = require("webpack-merge");
const path = require("path");
const apiMocker = require("mocker-api");

const common = require("./build/webpack.base.config");
const outputPath = path.resolve(__dirname, "dist");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  output: {
    path: outputPath,
    filename: "[name].[hash].js"
  },
  devServer: {
    contentBase: path.resolve(__dirname, "../"),
    hot: true,
    host: "0.0.0.0",
    quiet: true,
    historyApiFallback: true, // 当vue-router为history模式时，设置为true
    before(app) {
      apiMocker(app, path.resolve("./mock/index.js"), {
        changeHost: true
      });
    },
    proxy: {}
  },
  module: {
    rules: [
      {
        test: /\.(c|le)ss/,
        use: [
          "style-loader",
          {
            loader: "css-loader"
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin() // 热更新
  ]
});
