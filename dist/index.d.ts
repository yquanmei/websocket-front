interface EventParams {
    onMessage?: (event: Event) => void;
    onError?: (error: Event) => void;
    close?: (event: Event) => void;
}
interface StrictVariableParams {
    isReconnect: boolean;
    reconnectTimeout: number;
    reconnectRepeat: number;
    isHeartbeat: boolean;
    pingMsg: string | ArrayBufferLike | Blob | ArrayBufferView;
    pingTimeout: number;
    pongTimeout: number;
}
interface SocketOpts extends EventParams, StrictVariableParams {
}
interface SocketOptions extends EventParams, Partial<StrictVariableParams> {
}
declare class Socket {
    url: string;
    opts: SocketOpts;
    private ws;
    private _reconnectTimer;
    private _manualClose;
    private _repeat;
    private _lockReconnect;
    private _heartbeatTimer;
    private _pongTimer;
    constructor(url: string, options: SocketOptions);
    private _init;
    private _connect;
    private _onopen;
    private _onmessage;
    private _onerror;
    private _onclose;
    private _reconnect;
    private _resetReconnect;
    private _checkHeartbeat;
    private _resetHeartbeat;
    private _startHeartbeat;
    sendMessage: (message: any) => void;
    close: () => void;
}

export { SocketOptions, Socket as default };
