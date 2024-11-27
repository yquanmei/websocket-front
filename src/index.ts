interface EventParams {
  onOpen?: (event: Event) => void;
  onMessage?: (event: Event) => void;
  onError?: (error: Event) => void;
  onClose?: (event: Event) => void;
}

interface StrictVariableParams {
  // 重连
  isReconnect: boolean; // 是否需要重连
  reconnectTimeout: number; // 重连间隔时间
  reconnectRepeat: number; // 重连最多执行的次数
  // 心跳检测
  isHeartbeat: boolean;
  pingMsg: string | ArrayBufferLike | Blob | ArrayBufferView;
  pingTimeout: number;
  pongTimeout: number; // 多长时间没有收到返回的心跳就重启
  protocols?: string[];
}

interface SocketOpts extends EventParams, StrictVariableParams {}

export interface SocketOptions extends EventParams, Partial<StrictVariableParams> {}

enum WebSocketStatus {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

export interface SocketInterface {
  send: (message: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
  close: () => void;
}

class Socket implements SocketInterface {
  url: string;
  opts: SocketOpts;
  // 类里要用的变量
  private ws: WebSocket | null = null;
  private _reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private _manualClose: boolean = false;
  private _repeat: number = Infinity;
  private _lockReconnect: boolean = false;
  private _heartbeatTimer: ReturnType<typeof setTimeout> | null = null;
  private _pongTimer: ReturnType<typeof setTimeout> | null = null;
  constructor(url: string, options: SocketOptions) {
    this.url = url;
    this.opts = {
      protocols: options?.protocols ?? [],
      isReconnect: options?.isReconnect ?? true,
      onOpen: options?.onOpen,
      onMessage: options?.onMessage,
      onError: options?.onError,
      onClose: options?.onClose,
      reconnectTimeout: options?.reconnectTimeout ?? 300, // 重连的时间间隔，默认300毫秒
      reconnectRepeat: options?.reconnectRepeat ?? 3, // 重连次数，默认3，如果是Infinity 则为无数次
      isHeartbeat: options?.isHeartbeat ?? true,
      pingMsg: options?.pingMsg ?? "ping",
      pingTimeout: options?.pingTimeout ?? 30000, // 发送心跳的时间间隔，默认30s
      pongTimeout: options?.pongTimeout ?? 300,
    };

    // 初始化
    this._init();
  }
  private _init = () => {
    this._reconnectTimer = null;
    this._manualClose = false; // 是否是手动关闭
    this._lockReconnect = false;
    this._heartbeatTimer = null;
    this._pongTimer = null;

    this._resetReconnect();
    this._resetHeartbeat();

    this._connect();
    this._onopen();
    this._onmessage();
    this._onerror();
    this._onclose();
  };

  private _connect = () => {
    this.ws = new WebSocket(this.url, this.opts.protocols);
  };

  private _onopen = () => {
    if (!this.ws) return;
    this.ws.onopen = (event) => {
      if (this.opts.isHeartbeat) {
        this._checkHeartbeat();
      }
      if (this.opts.isReconnect) {
        this._repeat = 0;
      }
      if (typeof this.opts?.onOpen !== "function") return;
      this.opts.onOpen(event);
    };
  };

  private _onmessage = () => {
    if (!this.ws) return;
    this.ws.onmessage = (event) => {
      this._checkHeartbeat(); // 如果接收到消息了，说明此前连接正常，重新检测心跳
      if (typeof this.opts?.onMessage !== "function") return;
      this.opts.onMessage(event);
    };
  };

  private _onerror = () => {
    if (!this.ws) return;
    this.ws.onerror = (error) => {
      this._reconnect();
      if (typeof this.opts?.onError !== "function") return;
      this.opts.onError(error);
    };
  };

  private _onclose = () => {
    if (!this.ws) return;
    this.ws.onclose = (event: Event) => {
      if (this.opts.isReconnect && !this._manualClose) {
        this._reconnect(); // 自动重连；
      } else {
        this.ws?.close();
      }
      if (typeof this.opts?.onClose !== "function") return;
      this.opts.onClose(event);
    };
  };
  // ============================ 功能 =============================
  // 重连
  private _reconnect = () => {
    this._resetHeartbeat(); // 清除心跳检测
    if (
      !this.ws ||
      !this.opts.isReconnect ||
      this._lockReconnect ||
      Number(this.opts?.reconnectRepeat) <= this._repeat ||
      this._manualClose
    ) {
      return;
    }
    this._lockReconnect = true; // 可能会被多次触发，所以需要锁
    this._repeat++;
    this._reconnectTimer = setTimeout(() => {
      this._init();
      this._lockReconnect = false;
    }, this.opts?.reconnectTimeout);
  };
  private _resetReconnect = () => {
    if (this._reconnectTimer) clearTimeout(this._reconnectTimer);
  };
  // 检测心跳
  private _checkHeartbeat = () => {
    this._resetHeartbeat();
    this._startHeartbeat();
  };

  // 重置心跳
  private _resetHeartbeat = () => {
    if (this._heartbeatTimer) clearTimeout(this._heartbeatTimer);
    if (this._pongTimer) clearTimeout(this._pongTimer);
  };

  // 开启心跳
  private _startHeartbeat = () => {
    if (!this.opts.isHeartbeat) return;
    this._heartbeatTimer = setTimeout(() => {
      if (this.ws && this.ws.readyState === WebSocketStatus.OPEN) {
        this.ws.send(this.opts.pingMsg);
      } else {
        this.ws?.close();
      }
      this._pongTimer = setTimeout(() => {
        // 超时关闭, 会自动触发重连
        this.ws?.close();
      }, this.opts.pongTimeout);
    }, this.opts.pingTimeout);
  };
  // ============================ 业务api =============================
  // 发送消息
  send = (message) => {
    if (!this.ws) return;
    if (this.ws.readyState === WebSocketStatus.CONNECTING) {
      const sendInterval = setInterval(() => {
        if (!this.ws) return;
        if (this.ws.readyState === WebSocketStatus.OPEN) this.ws?.send(message);
        if (this.ws.readyState !== WebSocketStatus.CONNECTING) clearInterval(sendInterval);
      }, 100);
    }
    if (this.ws.readyState === WebSocketStatus.OPEN) {
      this.ws?.send(message);
    }
  };

  close = () => {
    this._manualClose = true; // 手动关闭
    this.ws?.close();
  };
}

if (typeof window != "undefined") (window as any).Socket = Socket;

export default Socket;
