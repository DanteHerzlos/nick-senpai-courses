const path = require("path")
const ESLintPlugin = require('eslint-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const Dotenv  = require("dotenv-webpack")
// const WebpackBundleAnalyzer = require('webpack-bundle-analyzer')

module.exports = {
  entry: './src/index.tsx',
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[fullhash].js'
  },
  optimization: {
    usedExports: true
  },
  resolve: {
    extensions: ['.js', '.json', '.tsx', '.ts'],
  },
  plugins: [
    new Dotenv(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].css'
    }),
    // new WebpackBundleAnalyzer.BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({ template: './src/index.html'}),
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new ESLintPlugin({
      extensions: ['.tsx', '.ts', '.js'],
      exclude: 'node_modules'
    })
  ],
  module: {
    rules: [
      {
        test: /\.(css|sass)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
          ]
      },

      {
        test: /\.(jpg|png|jpeg|svg)$/,
        use: ['file-loader']
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            
          }
        },
      },
    ]
  },
}