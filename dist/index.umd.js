(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.WebSocketWeb = factory());
})(this, (function () { 'use strict';

    class Socket {
        url;
        opts;
        ws = null;
        _reconnectTimer = null;
        _manualClose = false;
        _repeat = Infinity;
        _lockReconnect = false;
        _heartbeatTimer = null;
        _pongTimer = null;
        constructor(url, options) {
            this.url = url;
            this.opts = {
                isReconnect: options?.isReconnect || true,
                onMessage: options?.onMessage,
                onError: options?.onError,
                close: options?.close,
                reconnectTimeout: options?.reconnectTimeout || 300,
                reconnectRepeat: options?.reconnectRepeat || Infinity,
                isHeartbeat: options?.isHeartbeat || true,
                pingMsg: options?.pingMsg || "ping",
                pingTimeout: options?.pingTimeout || 30000,
                pongTimeout: options?.pongTimeout || 300,
            };
            this._init();
        }
        _init = () => {
            this._reconnectTimer = null;
            this._manualClose = false;
            this._repeat = 0;
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
        _connect = () => {
            this.ws = new WebSocket(this.url);
        };
        _onopen = () => {
            if (!this.ws)
                return;
            this.ws.onopen = () => {
                this._checkHeartbeat();
            };
        };
        _onmessage = () => {
            if (!this.ws)
                return;
            this.ws.onmessage = (event) => {
                this._checkHeartbeat();
                if (typeof this.opts.onMessage !== "function")
                    return;
                this.opts.onMessage(event);
            };
        };
        _onerror = () => {
            if (!this.ws)
                return;
            this.ws.onerror = (error) => {
                this._reconnect();
                if (typeof this.opts.onError !== "function")
                    return;
                this.opts.onError(error);
            };
        };
        _onclose = () => {
            if (!this.ws)
                return;
            this.ws.onclose = (event) => {
                if (this.opts.isReconnect && !this._manualClose) {
                    this._reconnect();
                }
                else {
                    this.ws?.close();
                }
                if (typeof this.opts.close !== "function")
                    return;
                this.opts.close(event);
            };
        };
        _reconnect = () => {
            this._resetHeartbeat();
            if (!this.ws ||
                !this.opts.isReconnect ||
                this._lockReconnect ||
                Number(this.opts?.reconnectRepeat) <= this._repeat ||
                this._manualClose) {
                return;
            }
            this._lockReconnect = true;
            this._repeat++;
            this._reconnectTimer = setTimeout(() => {
                this._init();
                this._lockReconnect = false;
            }, this.opts?.reconnectTimeout);
        };
        _resetReconnect = () => {
            if (this._reconnectTimer)
                clearTimeout(this._reconnectTimer);
        };
        _checkHeartbeat = () => {
            this._resetHeartbeat();
            this._startHeartbeat();
        };
        _resetHeartbeat = () => {
            if (this._heartbeatTimer)
                clearTimeout(this._heartbeatTimer);
            if (this._pongTimer)
                clearTimeout(this._pongTimer);
        };
        _startHeartbeat = () => {
            if (!this.opts.isHeartbeat || !this.opts.isReconnect)
                return;
            this._heartbeatTimer = setTimeout(() => {
                if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                    this.ws.send(this.opts.pingMsg);
                }
                else {
                    this.ws?.close();
                }
                this._pongTimer = setTimeout(() => {
                    this.ws?.close();
                }, this.opts.pongTimeout);
            }, this.opts.pingTimeout);
        };
        sendMessage = (message) => {
            if (!this.ws)
                return;
            if (this.ws.readyState === WebSocket.CONNECTING) {
                const sendInterval = setInterval(() => {
                    if (!this.ws)
                        return;
                    if (this.ws.readyState === WebSocket.OPEN)
                        this.ws?.send(message);
                    if (this.ws.readyState !== WebSocket.CONNECTING)
                        clearInterval(sendInterval);
                }, 100);
            }
            if (this.ws.readyState === WebSocket.OPEN) {
                this.ws?.send(message);
            }
        };
        close = () => {
            this._manualClose = true;
            this.ws?.close();
        };
    }
    if (typeof window != "undefined")
        window.Socket = Socket;

    return Socket;

}));
