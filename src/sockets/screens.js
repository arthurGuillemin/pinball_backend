import { WebSocketServer } from "ws";
import { getState, startGame, registerHit, losesBall } from "../game/state.js";

const screensWss = new WebSocketServer({ noServer: true });

const broadcast = (data) => {
  screensWss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
};

screensWss.on("connection", (ws) => {
  console.log("debug : co sur le /screensq");

  ws.send(JSON.stringify({ type: "state_update", state: getState() }));

  ws.on("message", (msg) => {
    const data = JSON.parse(msg.toString());
    if (data.type === "start_game") {
      const state = startGame(data.playerName);
      broadcast({ type: "state_update", state });
    }
    if (data.type === "hit") {
      const state = registerHit(data.points);
      broadcast({ type: "state_update", state });
    }
    if (data.type === "ball_lost") {
      const state = losesBall();
      broadcast({ type: "state_update", state });
      if (!state.isRunning) {
        broadcast({ type: "game_over", state });
      }
    }
  });

  ws.on("close", () => console.log("deco de /screeen"));
});

export default screensWss;
