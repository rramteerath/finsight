module.exports = {
	entry: "./app/App.js",
	output: {
		path: './public',
		filename: "bundle.js",
		publicPath: '/'
	},
	devServer: {
		inline: true,
		contentBase: './public'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel',
				query: {
					presets: ['react', 'es2015']
				}
			},
			{
				// indentedSyntax required for .sass file. Not needed for .scss files
       	test: /\.sass$/,
       	loader: "style!css!sass?indentedSyntax"
       }
		]
	}
}
