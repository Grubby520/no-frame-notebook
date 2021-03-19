const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './FINISHED/my-promise/my-promise.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  devServer: {
    hot: true,
    contentBase: './dist'
  },
  plugins: [new HtmlWebpackPlugin()]
};
