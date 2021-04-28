const webpack = require("webpack");
const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.base.config");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const MinCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const { outputPath, staticPath, distStaticPath } = require("./path");

module.exports = merge(common, {
  mode: "production",
  output: {
    path: outputPath,
    filename: "[name].[contenthash].js",
    publicPath: "/"
  },
  optimization: {
    minimizer: [
      // 压缩css
      new OptimizeCSSAssetsPlugin(),

      //  压缩js
      new TerserPlugin({
        extractComments: false
      })
    ],
    // 分离第三方库
    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: 1, // 设置优先级，首先抽离第三方模块
          name: "vendor",
          test: /node_modules/,
          chunks: "initial",
          minSize: 0,
          minChunks: 1 // 最少引入了1次
        },
        common: {
          // 公共模块
          chunks: "initial",
          name: "common",
          minSize: 100, // 大小超过100个字节
          minChunks: 3 // 最少引入了3次
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.css/,
        use: [
          MinCssExtractPlugin.loader,
          // "style-loader",
          {
            loader: "css-loader",
            options: {}
          }
        ]
      },
      {
        test: /\.less/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {}
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
          //     patterns: [lessVariablesPath]
          //   }
          // }
        ]
      },
      {
        test: /\.sass$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    // 拷贝静态文件
    // new CopyWebpackPlugin({
    //   patterns: [{ from: staticPath, to: distStaticPath }]
    // }),

    // 解决vender后面的hash每次都改变( 因为正常情况下module.id会随着加载顺序的改变而改变, vendor bundle 会随着自身的 module.id 的变化，而发生变化);
    // 推荐用于生成环境     
    new webpack.HashedModuleIdsPlugin(),
    
    new MinCssExtractPlugin({
      filename: "css/[name].[contenthash].css",
      chunkFilename: "css/[id].[contenthash].css"
    }),
    new CleanWebpackPlugin()
  ]
});
