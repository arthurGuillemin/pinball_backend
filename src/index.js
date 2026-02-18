import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
})

app.use(express.json())

const PORT = process.env.PORT || 3000


// test route
app.get('/', (req, res) => {
  res.json({ status: 'server is on' })
})

httpServer.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`)
})