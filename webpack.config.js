const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const parseDotEnvFile = (filePath) => {
  const values = {};

  if (!fs.existsSync(filePath)) {
    return values;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  content.split(/\r?\n/).forEach((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith('#')) {
      return;
    }

    const separatorIndex = trimmedLine.indexOf('=');
    if (separatorIndex <= 0) {
      return;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    if (!key) {
      return;
    }

    let value = trimmedLine.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"'))
      || (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[key] = value;
  });

  return values;
};

const loadDotEnv = (mode) => {
  const envFiles = [
    '.env',
    `.env.${mode}`,
    '.env.local',
    `.env.${mode}.local`,
  ];

  return envFiles.reduce((acc, fileName) => {
    const filePath = path.resolve(__dirname, fileName);
    return {
      ...acc,
      ...parseDotEnvFile(filePath),
    };
  }, {});
};

module.exports = (_, argv = {}) => {
  const mode = argv.mode || 'development';
  const fileEnv = loadDotEnv(mode);
  const getEnvValue = (name) => process.env[name] || fileEnv[name] || '';
  const getEnvValueAny = (...names) => names.map((name) => getEnvValue(name)).find(Boolean) || '';

  return {
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
        'process.env.REACT_APP_SUPABASE_URL': JSON.stringify(getEnvValue('REACT_APP_SUPABASE_URL')),
        'process.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY': JSON.stringify(getEnvValueAny('REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY', 'REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT')),
        'process.env.VITE_SUPABASE_URL': JSON.stringify(getEnvValue('VITE_SUPABASE_URL')),
        'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(getEnvValue('VITE_SUPABASE_ANON_KEY')),
        'import.meta.env.VITE_DISQUS_SHORTNAME': JSON.stringify(getEnvValue('VITE_DISQUS_SHORTNAME')),
        'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(''),
        'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(''),
        'import.meta.env.REACT_APP_SUPABASE_URL': JSON.stringify(getEnvValue('REACT_APP_SUPABASE_URL')),
        'import.meta.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY': JSON.stringify(getEnvValueAny('REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY', 'REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT')),
        'import.meta.env.VITE_RATINGS_API_URL': JSON.stringify(getEnvValue('VITE_RATINGS_API_URL')),
        'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(getEnvValueAny('VITE_GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_ID', 'NEXT_PUBLIC_GOOGLE_CLIENT_ID', 'REACT_APP_GOOGLE_CLIENT_ID')),
        'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify(getEnvValueAny('VITE_FIREBASE_API_KEY', 'FIREBASE_API_KEY', 'NEXT_PUBLIC_FIREBASE_API_KEY', 'REACT_APP_FIREBASE_API_KEY')),
        'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(getEnvValueAny('VITE_FIREBASE_AUTH_DOMAIN', 'FIREBASE_AUTH_DOMAIN', 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 'REACT_APP_FIREBASE_AUTH_DOMAIN')),
        'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(getEnvValueAny('VITE_FIREBASE_PROJECT_ID', 'FIREBASE_PROJECT_ID', 'NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'REACT_APP_FIREBASE_PROJECT_ID')),
        'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(getEnvValueAny('VITE_FIREBASE_STORAGE_BUCKET', 'FIREBASE_STORAGE_BUCKET', 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', 'REACT_APP_FIREBASE_STORAGE_BUCKET')),
        'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(getEnvValueAny('VITE_FIREBASE_MESSAGING_SENDER_ID', 'FIREBASE_MESSAGING_SENDER_ID', 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', 'REACT_APP_FIREBASE_MESSAGING_SENDER_ID')),
        'import.meta.env.VITE_FIREBASE_APP_ID': JSON.stringify(getEnvValueAny('VITE_FIREBASE_APP_ID', 'FIREBASE_APP_ID', 'NEXT_PUBLIC_FIREBASE_APP_ID', 'REACT_APP_FIREBASE_APP_ID')),
        'import.meta.env.VITE_FIREBASE_MEASUREMENT_ID': JSON.stringify(getEnvValueAny('VITE_FIREBASE_MEASUREMENT_ID', 'FIREBASE_MEASUREMENT_ID', 'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID', 'REACT_APP_FIREBASE_MEASUREMENT_ID')),
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
};
