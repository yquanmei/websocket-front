const ws = require("ws");
const wss = new ws.WebSocketServer({ port: 3001 });
const clients = new Set();

wss.on("connection", onSocketConnect);

function onSocketConnect(ws) {
  clients.add(ws);

  ws.on("message", function (message) {
    const messageString = message.toString();
    if (messageString === "ping" || messageString.includes("ping")) {
      this.send(
        JSON.stringify({
          type: "heartbeat",
          data: "pong",
        })
      );
      return;
    }

    for (let client of clients) {
      client.send(`服务端响应：这是客户端发送过来的消息"${messageString}"`);
    }
  });

  ws.on("close", function () {
    clients.delete(ws);
  });
}
