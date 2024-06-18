const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: "/chatHub" });

wss.on("connection", (ws) => {
  console.log("New connection established");

  ws.on("message", (message) => {
    const parsedMessage = JSON.parse(message);
    console.log(
      `Received message from ${parsedMessage.user}: ${parsedMessage.message}`
    );

    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            user: parsedMessage.user,
            message: parsedMessage.message,
            signature: parsedMessage.signature,
            publicKey: parsedMessage.publicKey,
          })
        );
      }
    });
  });

  ws.on("close", () => {
    console.log("Connection closed");
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
