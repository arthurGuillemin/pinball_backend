import { WebSocketServer } from 'ws';
import debug from "./debug.mjs";

const PORT = 8080;


var Client = {
    "table": {},
    addSocket: function (obj) {
        if (!obj.from) {
            return false;
        }
        let socketId = obj.from.trim().toLowerCase();
        if (!this.table[socketId]) {
            this.table[socketId] = [];
        }
        if (this.table[socketId].includes(obj.socket)) {
            console.log("socket exist deja ");
        } else {
            this.table[socketId].push(obj.socket);
        }
        debug.log(this.table);
    },
    findBySocket: function (socket) {
        let result = {};
        for (var key in this.table) {
            let table = this.table[key];
            const index = this.table[key].indexOf(socket);
            if (index > -1) { // only splice array when item is found
                result.idClient = key;
                result.index = index;
                return result;
            }
        }
        return false;
    },
    removeBySocket: function (socket) {
        let loc = this.findBySocket(socket);
        this.table[loc.idClient].splice(loc.index, 1);
        if (this.table[loc.idClient] && !this.table[loc.idClient].length) {
            delete this.table[loc.idClient];
        }
        debug.log(this.table);
        return loc.idClient;
    },
    send(message) {
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

wss.on("connection", (ws) => {
    ws.on("message", (msg) => {
        let message = JSON.parse(msg);
        console.log(message);
        if (message.handShake) {
            message.socket = ws;
            Client.addSocket(message);
            return;
        }
        if (message.to) {
            Client.send(message);
            return;
        }
    })
    ws.on('close', () => {
        var disconnectdClient = Client.removeBySocket(ws);
        console.log("Client Disconnected ", disconnectdClient);
    });
});

console.log("WebSocket Server Listen on ws://localhost:" + PORT);