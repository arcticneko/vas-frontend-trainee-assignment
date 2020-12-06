module.exports = {
  mode: 'development',
  output: {
    filename: 'banner.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env']
        },
      },
    ],
  },
};