# websocket-front

前端对原生 WebSocket 的封装，默认支持自动重连，支持心跳检测

# 技术栈

typescript + rollup

# 安装

```
yarn add websocket-front

# 或

npm install websocket-front
```

# 使用

## 最简单的连接：支持自动重连，支持心跳检测

```
import Socket from 'websocket-front';
const socket = new Socket('ws://127.0.0.1:3001')
```

## 配置项

```
import Socket from 'websocket-front';
const receiveMessage = (message: Event) => {
  console.log('接收到的消息：', message)
}
const errorCallback = (error: Event) => {
  console.log('错误信息', error)
}
const closeCallback = (event: Event) => {
  console.log('关闭了', event)
}
const socket = new Socket('ws://127.0.0.1:3001', {
  // 重连
  isReconnect: true,
  reconnectTimeout: 300,
  reconnectRepeat: 5,
  // 心跳检测
  isHeartbeat: true,
  pingMsg: JSON.stringify({
          messageType: "0",
          content: "ping",
        }),
  pingTimeout: 300,
  pongTimeout: 300,
  // 回调
  onMessage: receiveMessage,
  onError: errorCallback,
  onClose: closeCallback,
})
```

## 方法

```
import Socket from 'websocket-front';
const socket = new Socket('ws://127.0.0.1:3001')

// 发送消息
socket.send('发送WebSocket消息');

// 关闭WebSocket
socket.close()

```

# API

## 第一个参数

| 名称 | 类型   | 描述           | 默认值 |
| ---- | ------ | -------------- | ------ |
| url  | string | websocket 地址 |

## 第二个参数对象

| 名称             | 类型     | 描述                             | 默认值 |
| ---------------- | -------- | -------------------------------- | ------ |
| isReconnect      | boolean  | 是否需要自动重连                 | true   |
| reconnectTimeout | number   | 自动重连间隔时间                 | 300ms  |
| reconnectRepeat  | number   | 尝试自动重连的次数               | 3      |
| isHeartbeat      | boolean  | 是否支持心跳检测                 | 是     |
| pingMsg          | string   | 心跳检测发送给后端的消息         | 'ping' |
| pingTimeout      | number   | 发送心跳检测消息的延迟时间       | 30s    |
| pongTimeout      | number   | 多长时间没有收到返回的心跳就重启 | 300ms  |
| protocols        | string[] | 指定子协议                       | []     |

### 事件

| 名称      | 类型                   | 描述                       | 默认值 |
| --------- | ---------------------- | -------------------------- | ------ |
| onOpen    | (event:Event) => void  | WebSocket 打开了的回调     |
| onMessage | (event:Event) => void  | 收到后端返回的消息后的回调 |
| onError   | (error: Event) => void | 收到错误信息后的回调       |
| onClose   | (event: Event) => void | WebSocket 关闭了的回调     |

## 方法

| 事件名称 | 说明           | 回调函数 |
| -------- | -------------- | -------- |
| send     | 向后端发送消息 |
| close    | 关闭 WebSocket |

# 兼容性

## 电脑端

| 浏览器  | 支持的版本 |
| ------- | ---------- |
| chrome  | 5+         |
| Edge    | 12+        |
| Safari  | 4+         |
| Firefox | 7+         |
| Opera   | 10+        |
| IE      | 10+        |

## 移动端

| 浏览器              | 支持的版本 |
| ------------------- | ---------- |
| Chrome for Android  | 115+       |
| Safari on IOS       | 4.2 +      |
| Samsung Internet    | 4+         |
| Opera Mobile        | 12.1+      |
| Android Browser     | 4.4+       |
| Firefox for Android | 115+       |
