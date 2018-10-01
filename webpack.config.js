const webpack = require("webpack");

module.exports = {
  entry: [
    './src/js/index.js'
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(html)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: '../'
        }
      }
    , {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist/js',
    publicPath: '/dist/js',
    filename: 'app.bundle.js'
  },
  devServer: {
    contentBase: './',
    port: 3000
  }
};