import { WebSocketServer } from 'ws';


import mqtt from "mqtt"; // import namespace "mqtt"
let client = mqtt.connect("mqtt://captain.dev0.pandor.cloud:1884"); // create a client



// const webSocketClients = [];

client.on("connect", () => {
    client.subscribe("classroom/YounesBenaggoun", (err) => {
        if (!err) {
            console.log("subscribed to topic !");
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


const wss = new WebSocketServer({ port: 8080 });
console.log("WebSocket Server on ws://localhost:8080");

wss.on("connection", (ws) => {
    console.log("Client Connected");
    // webSocketClients.push(ws);
});
