var path = require('path');

module.exports = {
  context: __dirname,
  entry: './src',
  output: {
    libraryTarget: 'commonjs2',
    library: 'handler',
    path: path.resolve(__dirname, './dist/'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js']
  },
  target: 'node',
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loaders: ['babel-loader'],
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/
      }
    ]
  }
};
