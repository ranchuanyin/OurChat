class WebSocketModule {
    constructor(url) {
        this.url = url;
        this.socket = new WebSocket(url);

        // 监听 WebSocket 事件
        this.socket.addEventListener('open', this.handleOpen.bind(this));
        this.socket.addEventListener('message', this.handleMessage.bind(this));
        this.socket.addEventListener('close', this.handleClose.bind(this));
        this.socket.addEventListener('error', this.handleError.bind(this));
    }

    // 处理连接建立事件
    handleOpen(event) {
        console.log('WebSocket连接已建立', event);
    }

    // 处理接收到消息事件
    handleMessage(event) {
        console.log('收到消息:', event.data);
    }

    // 处理连接关闭事件
    handleClose(event) {
        console.log('WebSocket连接已关闭', event);
    }

    // 处理错误事件
    handleError(event) {
        console.error('WebSocket错误', event);
    }

    // 发送消息
    sendMessage(message) {
        this.socket.send(message);
    }

    // 关闭连接
    close() {
        this.socket.close();
    }
}

// 在模块中创建连接对象并导出
const ws = new WebSocketModule('ws://127.0.0.1:58080/webSocket');
export { ws };