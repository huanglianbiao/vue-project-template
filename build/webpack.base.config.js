const webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const { indexHtmlPath, componentsPath, viewsPath, utilsPath, entryPath, srcPath } = require("./path");

module.exports = {
  entry: entryPath,
  resolve: {
    extensions: [".js", ".vue"],
    modules: ["node_modules"],
    alias: {
      "@components": componentsPath,
      "@views": viewsPath,
      "@utils": utilsPath
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ["thread-loader", "vue-loader"]
      },
      {
        test: /\.js$/,
        use: ["thread-loader", "babel-loader?cacheDirectory"], // ?cacheDirectory: 缓存loader执行结果，提升打包速率
        exclude: /node_modules/,
        include: srcPath
      },
      // 处理图片
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "assets/images/[name].[hash:7].[ext]"
            }
          }
        ]
      },
      // 处理字体文件
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 8192,
          name: "assets/fonts/[name].[hash:7].[ext]"
        }
      }
    ]
  },
  plugins: [
    // 解决vender后面的hash每次都改变( 因为正常情况下module.id会随着加载顺序的改变而改变, vendor bundle 会随着自身的 module.id 的变化，而发生变化)
    new webpack.HashedModuleIdsPlugin(),

    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: indexHtmlPath
    })
  ]
};
