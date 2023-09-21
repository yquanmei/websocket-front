interface EventParams {
    onOpen?: (event: Event) => void;
    onMessage?: (event: Event) => void;
    onError?: (error: Event) => void;
    onClose?: (event: Event) => void;
}
interface StrictVariableParams {
    isReconnect: boolean;
    reconnectTimeout: number;
    reconnectRepeat: number;
    isHeartbeat: boolean;
    pingMsg: string | ArrayBufferLike | Blob | ArrayBufferView;
    pingTimeout: number;
    pongTimeout: number;
    protocols?: string[];
}
interface SocketOpts extends EventParams, StrictVariableParams {
}
interface SocketOptions extends EventParams, Partial<StrictVariableParams> {
}
interface SocketInterface {
    send: (message: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
    close: () => void;
}
declare class Socket implements SocketInterface {
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
    send: (message: any) => void;
    close: () => void;
}

export { SocketInterface, SocketOptions, Socket as default };
