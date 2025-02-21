// server.ts
import { parse } from 'url';
import express from "express";
import next from 'next';
import { WebSocketServer } from 'ws';
import Message from './models/Messages';
import mongoose from 'mongoose';

const url = process.env.MONGODB_URI;

const app = express();
const server = app.listen(3000);
const wss = new WebSocketServer({ noServer: true });
const nextApp = next({ dev: process.env.NODE_ENV !== "production" });

/** @type {Map<String,WebSocket>} */
const clients = new Map();

/**
* Code for handling a new websocket connection
* @param {WebSocket} ws
*/
function onConnection(ws) {
  console.log('New client connected');
  ws.onmessage = async (message) => {
    console.log(`Message received: ${message}`);
    try {
      /** @type{import("./lib/types").Messsage */
      const msgJson = JSON.parse(message.data)
      switch (msgJson.event) {
        case "MESSAGE":
          const dbMessage = new Message(msgJson);
          await dbMessage.save()
          const other = clients.get(msgJson.recver)
          
          if (other !== undefined) {
            other.send(msgJson);
          }
          
          break;
        case "REGISTER":
          clients.set(msgJson.sender,ws);
          break;
      }
    } catch(error) {
      console.log(error)
    }
    // clients.forEach((client) => {
    //   if (client !== ws && client.readyState === WebSocket.OPEN && (message.data !== `{"event":"ping"}`)) {
    //   }
    // });
  }
  ws.onclose = () => {
    // clients.delete(ws); // todo figure out how to remove cclient
    console.log('Client disconnected');
  }
}

nextApp.prepare().then(async () => {
  if (url === undefined || url === null || url === '') {
      return;
  }
  await mongoose.connect(url);
  app.use((req, res) => {
    nextApp.getRequestHandler()(req, res, parse(req.url, true));
  });
  wss.on('connection',onConnection)

  server.on("upgrade", (req, socket, head) => {
    const { pathname } = parse(req.url || "/", true);

    // Make sure we all for hot module reloading
    if (pathname === "/_next/webpack-hmr") {
      nextApp.getUpgradeHandler()(req, socket, head);
    }

    // Set the path we want to upgrade to WebSockets
    if (pathname === "/api/ws") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
      });
    }
  });
}).finally(() => {
  console.log("app hosted at http://localhost:3000")
})
