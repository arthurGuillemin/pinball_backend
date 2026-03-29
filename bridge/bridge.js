import { WebSocketServer } from 'ws';
import mqtt from "mqtt"; // import namespace "mqtt"

let client = mqtt.connect("mqtt://captain.dev0.pandor.cloud:1884"); // create a client


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

