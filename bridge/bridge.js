import { WebSocketServer } from 'ws';




import mqtt from "mqtt"; // import namespace "mqtt"
let client = mqtt.connect("mqtt://captain.dev0.pandor.cloud:1884"); // create a client


import { add, subtract } from './add.mjs';

console.log(add(5, 3)); // 8


const topic = "classroom/Younes";

client.on("connect", () => {
    client.subscribe(topic, (err) => {
        if (!err) {
            console.log("Ecoute sur le topic => " + topic);
        }
    });
});


client.on("message", (topic, message) => {
    const telemetry = JSON.parse(message.toString());
    console.log(telemetry);

    // webSocketClients.forEach((ws) => {
    //     ws.send(JSON.stringify(telemetry));
    // });
});

client.on("disconnect", function (e) {
    console.log("disconnection")
})

client.on("error", function (e) {
    console.log("my error")
})

const wss = new WebSocketServer({ port: 8080 });
console.log("WebSocket Server on ws://localhost:8080");

wss.on("connection", (ws) => {
    console.log("Client Connected");
    // webSocketClients.push(ws);
});


