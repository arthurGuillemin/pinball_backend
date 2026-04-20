
import mqtt from 'mqtt';


const PROF_MQTT_SERVER_LINK = "mqtt://captain.dev0.pandor.cloud:1884";
const MY_MQTT_SERVER_LINK = "mqtt://batna.freemyip.com:1883";
const LOCAL_MQTT_SERVER_LINK = "mqtt://localhost:1883";


const MQTT_TOPIC = "Pinball/Younes";



const mqttClient = mqtt.connect(LOCAL_MQTT_SERVER_LINK,
    {
        reconnectPeriod: 1000
    }
);


mqttClient.on("connect", () => {
    mqttClient.subscribe(MQTT_TOPIC, (err) => {
        if (!err) {
            console.log("subscribed to this topic --> " + MQTT_TOPIC);
            mqttClient.publish("Client Say", "Hello mqtt");
        }
    });
});


mqttClient.on("message", (topic, message) => {
    const telemetry = JSON.parse(message.toString());
    console.log(telemetry);

});

mqttClient.on('error', (err) => {
    console.log("ERROR");
});

mqttClient.on('close', () => {
    console.log('Connection closed');

});

mqttClient.on('reconnect', () => {
    console.log('Reconnecting...');
});

mqttClient.on('offline', () => {
    console.log('offline');
});