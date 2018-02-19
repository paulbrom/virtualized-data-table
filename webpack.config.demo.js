const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/demo/index',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'demo'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: './src/demo/index.html',
    }),
  ],
  module : {
    rules : [
      {
        test: /\.jsx?$/,
        include: [
          path.join(__dirname, './src/'),
        ],
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react', 'stage-2'],
        },
      },
    ],
  },
  resolve : {
    extensions: ['.js', '.jsx'],
  },
};