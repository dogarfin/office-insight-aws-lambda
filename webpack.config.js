var path = require('path');
var webpack = require('webpack');
var fs = require('fs');

module.exports = {
  context: __dirname,
  entry: fs.readdirSync(path.join(__dirname, "./lambdas"))
   .filter(filename => /\.js$/.test(filename))
   .map(filename => {
      var entry = {};
      entry[filename.replace(".js", "")] = path.join(
       __dirname,
       "./lambdas/",
       filename
     );
     return entry;
   })
   .reduce((finalObject, entry) => Object.assign(finalObject, entry), {}),
  output: {
    path:  path.resolve(__dirname, './dist/'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  target: "node",
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader'],
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/
      }
    ]
  }
};
