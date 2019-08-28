const webpack = require('webpack');
const path = require('path');
const baseConfig = require('./webpack.base.js');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const developmentWk =  {
    mode:'production',
    target:'web',
    optimization:{
      minimize:true,
      runtimeChunk:{
        name:'vendor'
      },
      splitChunks:{
        cacheGroups: {
            default: false,
            commons: {
              test: /node_modules/,
              name: "vendor",
              chunks: "initial",
              minSize: 1
            }
        }
      }
    },
	plugins:[
       new CleanWebpackPlugin(),
       new webpack.HotModuleReplacementPlugin(),
       new webpack.HashedModuleIdsPlugin(),
       new ExtractTextPlugin({
          filename: 'css/[name].css?[hash]-[chunkhash]-[name]',
          allChunks: true,
          disable: false,
        })
	],
};	
module.exports = merge(baseConfig,developmentWk);