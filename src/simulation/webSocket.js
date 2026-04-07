

import { WebSocketServer } from 'ws';
import debug from "./lib.js/debug.mjs";
import MySocket from './lib.js/mysocket.mjs';


const PORT = 8080;

const wss = new WebSocketServer({ port: PORT });


wss.on("connection", (wsocket) => {
    wsocket.on("message", (msg) => {
        let message = JSON.parse(msg);
        console.log(message);
        switch (message.type) {
            case "handshake":
                message.socket = wsocket;
                MySocket.addSocket(message);
                debug.log(MySocket.table);
                break;
            case "message": {
                MySocket.sendTo(message);
                break;
            }
        }

    })
    wsocket.on('close', () => {
        MySocket.removeBySocket(wsocket);
        debug.log(MySocket.table);
    });
});



wss.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Error: Port ${PORT} is already in use.`);
        // Action: Exit or try another port
        process.exit(1);

    } else if (err.code === 'EACCES') {
        console.error(`Error: Permission denied for port ${PORT}.`);
        process.exit(1);
    } else {

        throw err;
    }
});

console.log("WebSocket Server Listen on ws://localhost:" + PORT);

