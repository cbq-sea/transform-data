// ncapsulates a config for Webpack used to generate UMD builds
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const config = {
  mode: 'production',
  entry: './src/transform',
  externals: {
    // react: 'React',
    // echarts: 'window.echarts',
    // 'prop-types': 'PropTypes',
  },
  // Compile JS files with Babel
  module: {
    rules: [
      { test: /\.js$/, use: { loader: 'babel-loader' }, exclude: /node_modules/ },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]-[hash:base64:5]',
              },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },

  output: {
    library: 'TransformData',
    libraryTarget: 'umd',
  },
  // plugins: [new BundleAnalyzerPlugin()],
}

// If the environment is set to production, compress the output file
if (process.env.NODE_ENV !== 'production') {
  config.optimization = {
    minimize: false,
  }
}

module.exports = config
