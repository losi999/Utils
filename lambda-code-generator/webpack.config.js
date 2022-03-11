const path = require('path');

module.exports = {
  mode: "production",
  entry: './src/index.ts',
  experiments: {
    topLevelAwait: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [
          /node_modules/
        ]
      }
    ]
  },
  target: 'node',
  externals: [
    {
      // These modules are already installed on the Lambda instance.
      'awslambda': 'awslambda',
      'dynamodb-doc': 'dynamodb-doc'
    },
    /^aws-sdk.*/
  ],
  node: {
    // Allow these globals.
    __filename: false,
    __dirname: false
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    minimize: false,
    chunkIds: 'named',
  },
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'commonjs2'
  }
};
