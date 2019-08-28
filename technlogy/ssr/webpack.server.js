const path = require('path');
var nodeExternals = require('webpack-node-externals');
module.exports = {
	target:'node',
	externals: [nodeExternals()],
	mode:'development',
	entry: ["./server.js"],
	output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'server')
    },
     module: {
      rules: [{
          test: /\.css?$/,
          use: ['isomorphic-style-loader', {
            loader: 'css-loader',
            options: {
              modules: true
            }
           }]
        },
        {
		  test: /\.(js|jsx)$/,
		  exclude: /(node_modules|bower_components)/,
		  use: {
		    loader: 'babel-loader',
		    options: {
		      presets: ['@babel/preset-env','@babel/preset-react'],
			  plugins: ["react-hot-loader/babel","@babel/plugin-transform-runtime","@babel/plugin-transform-async-to-generator","@babel/plugin-transform-arrow-functions","@babel/plugin-transform-destructuring","@babel/plugin-transform-template-literals","@babel/plugin-transform-classes","@babel/plugin-transform-function-name","@babel/plugin-transform-shorthand-properties","@babel/plugin-syntax-import-meta","@babel/plugin-syntax-dynamic-import",]
		   }
		}
	  }]
	},
	node:{
		fs:"empty",
		net:"empty"
	}
};