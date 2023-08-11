export default {
  build: {
    lib: {
      entry: {
        index: "./src/index.ts",
      },
      name: "index.js",
      filename: "index.js",
      libraryTarget: "umd",
    },
  },
  optimization: {
    minimize: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  mode: "production",
};
