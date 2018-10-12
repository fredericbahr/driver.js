const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const scriptFileName = 'driver-demo.min.js';
const styleFileName = 'driver-demo.min.css';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    './demo/styles/demo.scss',
    './demo/scripts/demo.js',
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, '/../dist/demo'),
    publicPath: '/dist/demo/',
    filename: scriptFileName,
    libraryTarget: 'umd',
    library: 'Driver',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        enforce: 'pre',
        options: {
          failOnWarning: false,
          failOnError: true,
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /.scss$/,
        loader: ExtractTextPlugin.extract([
          {
            loader: 'css-loader',
            options: { minimize: isProduction, url: false },
          },
          'sass-loader',
        ]),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: styleFileName,
      allChunks: true,
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.min\.css$/g,
      // eslint-disable-next-line global-require
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: [
          'default',
          {
            discardComments: { removeAll: true },
          },
        ],
      },
      canPrint: true,
    }),
    new CopyWebpackPlugin([
      './demo/images/separator.png',
      './demo/images/driver.png',
    ]),
  ],
  stats: {
    colors: true,
  },
  devtool: 'cheap-module-eval-source-map',
};
