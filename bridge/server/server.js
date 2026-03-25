

import { WebSocketServer } from 'ws';
import debug from "./lib/debug.mjs";



const PORT = 8080;

var MySocket = {
    "table": {},
    addSocket: function (obj) {
        let socketId = obj.from.trim().toLowerCase();
        if (!this.table[socketId]) {
            this.table[socketId] = new Set();
        }
        if (this.table[socketId].has(obj.socket)) {
            console.log("socket exist deja ");
        } else {
            this.table[socketId].add(obj.socket);
        }
        debug.log(this.table);
    },
    removeBySocket: function (socket) {
        let idClient;
        for (var key in this.table) {
            let clientWebSock = this.table[key];
            let set = this.table[key];
            if (set.has(socket)) {
                set.delete(socket);
                idClient = key;
                break;
            }
        }
        if (this.table[idClient] && !this.table[idClient].length) {
            delete this.table[idClient];
        }
        debug.log(this.table);
        return idClient;
    },
    sendTo(message) {
        let to = message.to.trim().toLowerCase();
        let socketList = this.table[to];
        if (!socketList) {
            return false;
        }
        socketList.forEach(sock => {
            sock.send(JSON.stringify(message));
        });
    }
}



const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (wsocket) => {

    wsocket.on("message", (msg) => {
        let message = JSON.parse(msg);
        console.log(message);
        switch (message.type) {
            case "handshake":
                message.socket = wsocket;
                MySocket.addSocket(message);
                break;
            case "message": {
                MySocket.sendTo(message);
                break;
            }
        }
    })
    wsocket.on('close', () => {
        var disconnectedClient = MySocket.removeBySocket(wsocket);
    });
});

console.log("WebSocket Server Listen on ws://localhost:" + PORT);

