import path from "path";

export default {
  build: {
    lib: {
      entry: {
        index: "./src/index.ts",
      },
      name: "index.js",
      // outDir: "./dist",
      filename: "index.js",
      // path: path.resolve(__dirname, "dist"),
      // libraryTarget: "umd",
      // globalObject: "this",
      // umdNameDefine: true,
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
