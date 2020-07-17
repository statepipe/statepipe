const TerserPlugin = require('terser-webpack-plugin');
const pkg = require('./package.json');
const path = require('path');

module.exports = env => {

  const isProd = env.NODE_ENV === "production";
  const version = `${isProd ? pkg.version : 'latest'}`;

  console.log("NODE_ENV",env.NODE_ENV);
  console.log("PROD?",isProd === true);
  console.log("VERSION:",pkg.version);

  const entries = {
    [`statepipe.slim.${version}`] : [
      "./src/bundler/slim.js"
    ],
    [`statepipe.${version}`] : [
      "./src/bundler/stores.js",
      "./src/bundler/slim.js"
    ]
  };
  //[`statepipe.${version}`] : [ "./src/index.js" ],
  //[`statepipe.stores.${version}`] : [ "./src/stores/index.js" ],
  //[`statepipe.plugins.${version}`] : [ "./src/plugins/combo.js" ]
  console.log("about to build entries:");
  console.log(entries);

  const settings = {
    optimization: isProd ?{
      minimize: true,
      minimizer: [new TerserPlugin({
        sourceMap: false,
        terserOptions: {
          warnings: false,
          compress: {},
          mangle: true,
          keep_classnames: true,
          keep_fnames: true,
          safari10: false,
        },
      })],
    } : {},
    watch: env.watch === "yes",
    mode: env.NODE_ENV || "development",
    entry: entries,
    output: {
      path: path.resolve(__dirname, "pages/content/dist"),
      filename: `[name].js`
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: /src/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
  };
  return settings;
};
