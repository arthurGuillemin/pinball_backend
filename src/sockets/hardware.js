import { WebSocketServer } from "ws";

const esp32Wss = new WebSocketServer({ noServer: true });

esp32Wss.on("connection", (ws) => {
  console.log("Client co sur /esp32");

  ws.on("message", (msg) => {
    const data = msg.toString();
    console.log("Event ESP32 reçu:", data);

    esp32Wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(data);
      }
    });
  });

  ws.on("close", () => console.log("Client /esp32 déconnecté"));
});

export default esp32Wss;
