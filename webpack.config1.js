var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    codemirror: './public/script/codemirror.js'
  },
  output: {
    path: path.resolve(__dirname,'dist'),
    filename:'bundle.js',
  },
   plugins: [
     new HtmlWebpackPlugin(
      // template: './public/index.html',
      //  filename: path.join(__dirname, 'public/index.html'),
      // chunks: ['note'],
      // chunksSortMode: 'manual',
    )
   ],
};