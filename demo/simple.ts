/* vue 或 react项目 */
// 简单示例
import Socket from "websocket-front";
const socket = new Socket("ws://127.0.0.1:3001");

setTimeout(() => {
  socket.send("hello world");
}, 1000);
