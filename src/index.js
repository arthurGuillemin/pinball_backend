import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import scoresRouter from "./routes/scores.route.js";
import cors from 'cors'
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
const httpServer = createServer(app);

//cors
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || []
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? allowedOrigins : '*'
}))


//Socket
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? allowedOrigins : '*'
  }
})

app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.json({ status: "server is on" });
});
//scores routes
app.use("/api/scores", scoresRouter);

httpServer.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});


export { app, httpServer } 