var n = Object.defineProperty;
var h = (r, t, e) => t in r ? n(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var s = (r, t, e) => (h(r, typeof t != "symbol" ? t + "" : t, e), e);
class a {
  constructor(t, e) {
    s(this, "url");
    s(this, "opts");
    // 类里要用的变量
    s(this, "ws", null);
    s(this, "_reconnectTimer", null);
    s(this, "_manualClose", !1);
    s(this, "_repeat", 1 / 0);
    s(this, "_lockReconnect", !1);
    s(this, "_heartbeatTimer", null);
    s(this, "_pongTimer", null);
    s(this, "_init", () => {
      this._reconnectTimer = null, this._manualClose = !1, this._repeat = 0, this._lockReconnect = !1, this._heartbeatTimer = null, this._pongTimer = null, this._resetReconnect(), this._resetHeartbeat(), this._connect(), this._onopen(), this._onmessage(), this._onerror(), this._onclose();
    });
    s(this, "_connect", () => {
      this.ws = new WebSocket(this.url);
    });
    s(this, "_onopen", () => {
      this.ws && (this.ws.onopen = () => {
        this._checkHeartbeat();
      });
    });
    s(this, "_onmessage", () => {
      this.ws && (this.ws.onmessage = (t) => {
        this._checkHeartbeat(), typeof this.opts.onMessage == "function" && this.opts.onMessage(t);
      });
    });
    s(this, "_onerror", () => {
      this.ws && (this.ws.onerror = (t) => {
        this._reconnect(), typeof this.opts.onError == "function" && this.opts.onError(t);
      });
    });
    s(this, "_onclose", () => {
      this.ws && (this.ws.onclose = (t) => {
        var e;
        this.opts.isReconnect && !this._manualClose ? this._reconnect() : (e = this.ws) == null || e.close(), typeof this.opts.close == "function" && this.opts.close(t);
      });
    });
    // ============================ 功能 =============================
    // 重连
    s(this, "_reconnect", () => {
      var t, e;
      this._resetHeartbeat(), !(!this.ws || !this.opts.isReconnect || this._lockReconnect || Number((t = this.opts) == null ? void 0 : t.reconnectRepeat) <= this._repeat || this._manualClose) && (this._lockReconnect = !0, this._repeat++, this._reconnectTimer = setTimeout(() => {
        this._init(), this._lockReconnect = !1;
      }, (e = this.opts) == null ? void 0 : e.reconnectTimeout));
    });
    s(this, "_resetReconnect", () => {
      this._reconnectTimer && clearTimeout(this._reconnectTimer);
    });
    // 检测心跳
    s(this, "_checkHeartbeat", () => {
      this._resetHeartbeat(), this._startHeartbeat();
    });
    // 重置心跳
    s(this, "_resetHeartbeat", () => {
      this._heartbeatTimer && clearTimeout(this._heartbeatTimer), this._pongTimer && clearTimeout(this._pongTimer);
    });
    // 开启心跳
    s(this, "_startHeartbeat", () => {
      !this.opts.isHeartbeat || !this.opts.isReconnect || (this._heartbeatTimer = setTimeout(() => {
        var t;
        this.ws && this.ws.readyState === WebSocket.OPEN ? this.ws.send(this.opts.pingMsg) : (t = this.ws) == null || t.close(), this._pongTimer = setTimeout(() => {
          var e;
          (e = this.ws) == null || e.close();
        }, this.opts.pongTimeout);
      }, this.opts.pingTimeout));
    });
    // ============================ 业务api =============================
    // 发送消息
    s(this, "sendMessage", (t) => {
      var e;
      if (this.ws) {
        if (this.ws.readyState === WebSocket.CONNECTING) {
          const c = setInterval(() => {
            var i;
            this.ws && (this.ws.readyState === WebSocket.OPEN && ((i = this.ws) == null || i.send(t)), this.ws.readyState !== WebSocket.CONNECTING && clearInterval(c));
          }, 100);
        }
        this.ws.readyState === WebSocket.OPEN && ((e = this.ws) == null || e.send(t));
      }
    });
    s(this, "close", () => {
      var t;
      this._manualClose = !0, (t = this.ws) == null || t.close();
    });
    this.url = t, this.opts = {
      isReconnect: (e == null ? void 0 : e.isReconnect) || !0,
      onMessage: e == null ? void 0 : e.onMessage,
      onError: e == null ? void 0 : e.onError,
      close: e == null ? void 0 : e.close,
      reconnectTimeout: (e == null ? void 0 : e.reconnectTimeout) || 300,
      // 重连的时间间隔，默认300毫秒
      reconnectRepeat: (e == null ? void 0 : e.reconnectRepeat) || 1 / 0,
      isHeartbeat: (e == null ? void 0 : e.isHeartbeat) || !0,
      pingMsg: (e == null ? void 0 : e.pingMsg) || "ping",
      pingTimeout: (e == null ? void 0 : e.pingTimeout) || 3e4,
      // 发送心跳的时间间隔，默认30s
      pongTimeout: (e == null ? void 0 : e.pongTimeout) || 300
    }, this._init();
  }
}
typeof window < "u" && (window.Socket = a);
export {
  a as default
};
