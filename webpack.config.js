const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  src: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build'),
  example: path.join(__dirname, 'example')
};

const common = {
  entry: {
    'dist/fixer': path.resolve(__dirname, 'index'),
    'example/example': path.resolve(PATHS.example, 'index')
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};

if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'source-map',
    devServer: {
      contentBase: PATHS.example,
      historyApiFallback: true,
      hot: false,
      inline: true,
      progress: true,
      stats: 'errors-only',
      host: process.env.HOST,
      port: process.env.PORT || 3000
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        title: 'Fixer example',
        template: path.join(PATHS.example, 'index.ejs'),
        inject: false
      })
    ]
  });
}

if (TARGET === 'build') {
  module.exports = merge(common, {});
}