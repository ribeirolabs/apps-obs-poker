import { WebSocketServer, WebSocket } from "ws";

const server = new WebSocketServer({
  port: 6969,
});

console.log("Listening...");

const clients: Set<WebSocket> = new Set();

server.on("connection", (ws) => {
  console.log("connected");

  clients.add(ws);

  ws.on("error", () => {
    ws.close();
  });

  ws.on("close", () => {
    clients.delete(ws);
  });

  ws.on("message", (raw) => {
    const message = raw.toString();

    try {
      const data = JSON.parse(message);

      console.log("sending", data);

      for (const client of Array.from(clients)) {
        if (client === ws) {
          continue;
        }

        client.send(message);
      }
    } catch (e) {}
  });
});
