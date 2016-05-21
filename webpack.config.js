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
				test: /\.tsx?$/,
				exclude: /(node_modules|bower_components)/,
				loaders: 'ts-loader'
			},
			{
				// indentedSyntax required for .sass file. Not needed for .scss files
       	test: /\.sass$/,
       	loader: "style!css!sass?indentedSyntax"
       },
			{
				test: /\.less$/,
				loader: "style-loader!css-loader!less-loader"
			},
			{
				test: /\.gif$/,
				loader: "url-loader?mimetype=image/png"
			},
			{
				test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/,
				loader: "url-loader?mimetype=application/font-woff"
			},
			{
				test: /\.(ttf|eot|svg)(\?v=[0-9].[0-9].[0-9])?$/,
				loader: "file-loader?name=[name].[ext]"
			}
		]
	}
}
