import { WebSocketServer } from 'ws';
import mqtt from "mqtt"; // import namespace "mqtt"


// import { add, subtract } from './add.mjs';
// console.log(add(5, 3)); // 8


let client = mqtt.connect("mqtt://captain.dev0.pandor.cloud:1884"); // create a client
const topic = "classroom/Younes";
const clientsList = [];
const PORT = 8080;

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

    clientsList.forEach((ws) => {
        ws.send(JSON.stringify(telemetry));
    });
});

client.on("disconnect", function (e) {
    console.log("disconnection")
})

client.on("error", function (e) {
    console.log("my error")
})



const wss = new WebSocketServer({ port: PORT });
console.log("WebSocket Server on ws://localhost:" + PORT);

wss.on("connection", (ws) => {
    console.log("Client Connected");
    clientsList.push(ws);
});


