const path = require('path')

const mode = process.env.NODE_ENV

module.exports = {
  entry: './client/index.js',
  output: {
    path: path.join(__dirname, '/public', 'dist'),
    filename: 'bundle.js',
  },
  mode: mode,
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.jsx?$/,
        exclude: /node_modules/,
      },
      {
        loader: 'style-loader!css-loader',
        test: /\.css$/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [

  ],
  devtool: 'source-map',
}
