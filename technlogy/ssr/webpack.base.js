const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: ["@babel/polyfill",'react-hot-loader/babel','./client/index.js'],
  output: {
      path: path.resolve(__dirname, 'statics'),
      filename: 'react-client-ssr.js',
      publicPath:'/'
  },
  module: {
      rules: [
        { test: /\.txt$/, use: 'raw-loader' },
		{
		  test: /\.css?$/,
		  use: [
		    { loader: 'style-loader' },
		    {
		      loader: 'css-loader',
		      options: {
		        modules: true
		      }
		    }, 
			{
              loader: "sass-loader"
            }
		  ]
		},
		{
		  test: /\.(png|jpg|gif)$/,
		  use: [
		    {
		      loader: 'url-loader',
		      options: {
		        limit: 8192
		      }
		    }
		  ]
		},
		{
          test:/\.(woff|woff2|eot|ttf|otf)$/,
          use:['url-loader']
        },
		{
		  test: /\.(js|jsx)$/,
		  exclude: /(node_modules|bower_components)/,
		  use: {
		    loader: 'babel-loader',
		    options: {
		      presets: [['@babel/preset-env',
		                {
    	                    targets:{
    	                    	edge: "17",
    	                    	firefox: "60",
    	                    	chrome: "67",
    	                    	safari: "11.1",
    	                    }
                        }],'@babel/preset-react'],
			  plugins: ["react-hot-loader/babel",
			            "@babel/plugin-transform-runtime",
			            "@babel/plugin-transform-async-to-generator",
			            "@babel/plugin-transform-arrow-functions",
			            "@babel/plugin-transform-destructuring",
			            "@babel/plugin-transform-template-literals",
			            "@babel/plugin-transform-classes",
                        "@babel/plugin-transform-function-name",
                        "@babel/plugin-transform-shorthand-properties"
			            ]
		    }
		  }
		}, 
      ]
    },
  plugins: [
      new HtmlWebpackPlugin({
       	    title:'react-ssr',
       	    favicon:path.resolve(__dirname,'statics/favicon.ico'),
       	    template:path.resolve(__dirname,'./client/index.html'),
       	    filename:'index.html',
       	    inject:'body',
       	    minify:{
       	    	collapseWhitespace:true,
       	    	removeComments:true,
       	    	removeAttributeQuotes:true
       	    }
       }),
    ],
  resolve:{
  	  modules:['node_modules/'],
  	  extensions:['.js','jsx','.json']
  }
};