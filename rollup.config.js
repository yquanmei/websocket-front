import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.umd.js",
        format: "umd", // UMD 模块化方案
        name: "WebSocketWeb", // UMD 模块化方案需要指定全局变量名称
      },
    ],
    plugins: [typescript()],
  },
  {
    input: "src/index.ts",
    plugins: [dts()],
    output: {
      format: "umd",
      file: "dist/index.d.ts",
    },
  },
];
