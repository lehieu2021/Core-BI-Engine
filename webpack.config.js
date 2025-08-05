const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : 'bundle.js',
      publicPath: '/',
      clean: true
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      alias: {
        components: path.resolve(__dirname, 'src/components'),
        utils: path.resolve(__dirname, 'src/utils'),
        types: path.resolve(__dirname, 'src/types'),
        hooks: path.resolve(__dirname, 'src/hooks'),
        services: path.resolve(__dirname, 'src/services'),
        assets: path.resolve(__dirname, 'src/assets')
      }
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html'
      })
    ],
    devServer: {
      historyApiFallback: true,
      port: 3000,
      hot: true,
      open: true
    }
  };
};