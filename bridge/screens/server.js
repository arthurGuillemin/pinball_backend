import { WebSocketServer } from 'ws';

PORT = 8080;


var Client = {
    "tab": {},
    addSocket: function (obj) {
        console.log("Client Connected id", obj.id);
        if (!this.tab[obj.id]) {
            this.tab[obj.id] = [];
        }
        if (this.tab[obj.id].includes(obj.socket)) {
            console.log("socket exist deja ");
        } else {
            this.tab[obj.id].push(obj.socket);
        }
        //debug.log(this.tab);
    },
    removeBySocket: function (socket) {
        var idClient;
        for (var key in this.tab) {
            var tab = this.tab[key];
            const index = this.tab[key].indexOf(socket);
            if (index > -1) { // only splice array when item is found
                idClient = key;
                this.tab[key].splice(index, 1); // 2nd parameter means remove one item only
            }
        }
        console.log("Disconnect id " + idClient);
        if (this.tab[idClient] && !this.tab[idClient].length) {
            delete this.tab[idClient];
        }
        //debug.log(this.tab);
        return idClient;
    },
    send(message) {
        let to = message.to;
        let socketList = this.tab[to];
        if (!socketList) {
            return false;
        }
        socketList.forEach(sock => {
            sock.send(JSON.stringify(message));
        });
    }
}


//const WebSocket = require("ws");
//const wss = new WebSocket.Server({ port: 8080 });

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
    ws.on("message", (msg) => {
        var message = JSON.parse(msg);
        console.log(message);
        if (message.handShake) {
            message.socket = ws;
            Client.addSocket(message);
            return
        }
        if (message.to) {
            Client.send(message);
            return;
        }
    })
    ws.on('close', () => {
        var disconnectdClient = Client.removeBySocket(ws);
        //console.log("Deconnection depuis client ", disconnectdClient);
    });
});

console.log("WebSocket Server on ws://localhost:"+PORT);