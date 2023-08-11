# websocket-client

前端对原生 WebSocket 的封装，默认支持自动重连，支持心跳检测

# 技术栈

typescript + vite

# 安装

```
yarn add websocket-client

# 或

npm install websocket-client
```

# 使用

## 最简单的连接：支持自动重连，支持心跳检测

```
import WebsocketClient from 'websocket-client';
const socket = new WebsocketClient('ws://127.0.0.1:3001')
```

## 配置项

```
import WebsocketClient from 'websocket-client';
const socket = new WebsocketClient('ws://127.0.0.1:3001', {
  // 重连
  isReconnect: true,
  reconnectTimeout: 300,
  reconnectRepeat: 5,
  // 心跳检测
  isHeartbeat: true
  pingMsg: JSON.stringify({
          messageType: "0",
          content: "ping",
        }),
  pingTimeout: 300,
  pongTimeout: 300,
  // 回调
  onMessage: receiveMessage,
  onError: errorCallback,
  close: closeCallback,
})
const receiveMessage = (message: Event) => {
  console.log('接收到的消息：', message)
}
const errorCallback = (error: Event) => {
  console.log('错误信息', event)
}
const closeCallback = (event: Event) => {
  console.log('关闭了')
}
```

## 方法

```
import WebsocketClient from 'websocket-client';
const socket = new WebsocketClient('ws://127.0.0.1:3001')

// 执行某些操作
socket.sendMessage('发送WebSocket消息');

// 执行某些操作
socket.close()

```

# API

## 第一个参数

|--|--|--|--|
| 名称 | 类型| 描述 | 默认值
|url | string| websocket 地址

## 第二个参数对象

|--|--|--|--|
| 名称 | 类型| 描述 | 默认值
|isReconnect| boolean |是否需要自动重连 | true
|reconnectTimeout| number |自动重连间隔时间 | 300ms
|reconnectRepeat |number |尝试自动重连的次数 | Infinity
|isHeartbeat| boolean| 是否支持心跳检测 | 是
|pingMsg|string| 心跳检测发送给后端的消息 | 'ping'
|pingTimeout| number| 发送心跳检测消息的延迟时间 |30s
|pongTimeout| number |多长时间没有收到返回的心跳就重启|300ms

### 事件

|--|--|--|--|
| 名称 | 类型| 描述 | 默认值
|onMessage | (event:Event) => void | 收到后端返回的消息后的回调
|onError |(error: Event) => void | 收到错误信息后的回调
|close| (event: Event) => void | WebSocket 关闭了的回调

## 方法

|--|--|--|--|
|事件名称|说明|回调函数
|sendMessage|向后端发送消息
|close|关闭 WebSocket
