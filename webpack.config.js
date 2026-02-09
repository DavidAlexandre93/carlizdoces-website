const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true,
    assetModuleFilename: 'assets/[name][ext]'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(svg|png|jpe?g|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@mui/icons-material/Share': path.resolve(__dirname, 'src/mui-icons/Share.jsx'),
      '@mui/icons-material/KeyboardArrowLeft': path.resolve(__dirname, 'src/mui-icons/KeyboardArrowLeft.jsx'),
      '@mui/icons-material/KeyboardArrowRight': path.resolve(__dirname, 'src/mui-icons/KeyboardArrowRight.jsx'),
      'material-ui-carousel': path.resolve(__dirname, 'src/mui-components/material-ui-carousel.jsx'),
      'react-swipeable-views': path.resolve(__dirname, 'src/mui-components/react-swipeable-views.jsx'),
      'motion/react': path.resolve(__dirname, 'src/motion/react.js')
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'import.meta.env.VITE_DISQUS_SHORTNAME': JSON.stringify(process.env.VITE_DISQUS_SHORTNAME || ''),
      'import.meta.env.VITE_RATINGS_API_URL': JSON.stringify(process.env.VITE_RATINGS_API_URL || ''),
      'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(process.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || ''),
    }),
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ],
  devServer: {
    static: path.resolve(__dirname, 'public'),
    port: 3000,
    hot: true,
    historyApiFallback: true
  }
};
