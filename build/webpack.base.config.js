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
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: indexHtmlPath
    })
  ]
};
