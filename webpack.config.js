const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  src: path.join(__dirname, "src"),
  build: path.join(__dirname, "lib"),
  example: path.join(__dirname, "example"),
  exampleBuild: path.join(__dirname, "example-build")
};

const common = {
  entry: {
    "fixer": path.resolve(__dirname, "index")
  },
  output: {
    libraryTarget: "umd",
    path: PATHS.build,
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
        include: [PATHS.src, PATHS.example]
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: [PATHS.src, PATHS.example],
        options: {
          presets: ["es2015"]
        }
      }
    ]
  }
};

if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    entry: {
      "example": path.resolve(PATHS.example, "index")
    },
    devtool: "source-map",
    devServer: {
      contentBase: PATHS.example,
      historyApiFallback: true,
      hot: false,
      inline: true,
      stats: "errors-only",
      host: process.env.HOST,
      port: process.env.PORT || 3000
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        title: "Fixer example",
        template: path.join(PATHS.example, "index.ejs"),
        inject: false
      })
    ]
  });
}

if (TARGET === "build") {
  module.exports = merge(common, {
    entry: {
      "fixer.min": path.resolve(__dirname, "index")
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        include: /\.min\.js$/,
        compress: {
          warnings: false
        }
      })
    ]
  });
}

if (TARGET === "deploy") {
  module.exports = merge(common, {
    output: {
      path: PATHS.exampleBuild
    },
    entry: {
      "example": path.resolve(PATHS.example, "index")
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        title: "Fixer example",
        template: path.join(PATHS.example, "index.ejs"),
        inject: false
      })
    ]
  });
}
