import esp32Wss from "./hardware.js";
import { URL } from "node:url";
export function setupWebSockets(httpServer) {
  httpServer.on("upgrade", (request, socket, head) => {
    const pathname = new URL(request.url, "http://localhost").pathname;

    if (pathname === "/esp32") {
      esp32Wss.handleUpgrade(request, socket, head, (ws) => {
        esp32Wss.emit("connection", ws, request);
      });
    } else {
      socket.destroy();
    }
  });
}
