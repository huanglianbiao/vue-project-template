const webpack = require("webpack");
const { merge } = require("webpack-merge");
const apiMocker = require("mocker-api");

const common = require("./webpack.base.config");
const { rootPath, outputPath, MockPath } = require("./path");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  output: {
    path: outputPath,
    filename: "[name].[hash].js"
  },
  devServer: {
    contentBase: rootPath,
    publicPath: "/",
    hot: true,
    host: "0.0.0.0",
    // port: 5000,
    quiet: true,
    historyApiFallback: true, // 当vue-router为history模式时，设置为true
    before(app) {
      apiMocker(app, MockPath, {
        changeHost: true
      });
    },
    proxy: {
      "/web": {
        // target: `http://192.168.1.1`,
        changeOrigin: true
      }
    }
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
          // {
          //   loader: "style-resources-loader",
          //   options: {
          //     // patterns: [lessVariablesPath]
          //   }
          // }
        ]
      },
      {
        test: /\.sass$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin() // 热更新
  ]
});
