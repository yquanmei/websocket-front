import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.common.js",
        format: "cjs", // CommonJS 模块化方案
      },
      {
        file: "dist/index.esm.js",
        format: "esm", // ES6 模块化方案
      },
      {
        file: "dist/index.amd.js",
        format: "amd", // AMD 模块化方案
      },
      {
        file: "dist/index.umd.js",
        format: "umd", // UMD 模块化方案
        name: "WebSocketFront", // UMD 模块化方案需要指定全局变量名称
        globalObject: "this",
      },
    ],
    plugins: [typescript(), terser()],
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
