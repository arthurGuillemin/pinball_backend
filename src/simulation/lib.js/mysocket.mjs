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

export default MySocket;