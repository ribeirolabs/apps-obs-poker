import { WebSocketServer, WebSocket } from "ws";
import { getInititalTables, State, Table } from "./state";

const server = new WebSocketServer({
  port: 6969,
});

const state = new State();

console.log("Listening...");

const clients: Set<WebSocket> = new Set();

function sendUpdate() {
  console.log("sending update", state.tables);
  for (const client of Array.from(clients)) {
    client.send(
      JSON.stringify({
        type: "update_tables",
        tables: state.tables,
      }),
    );
  }
}

server.on("connection", (ws) => {
  console.log("connected");

  clients.add(ws);

  ws.send(
    JSON.stringify({
      type: "update_tables",
      tables: state.tables,
    }),
  );

  ws.on("error", () => {
    ws.close();
  });

  ws.on("close", () => {
    console.log("disconnected");
    clients.delete(ws);
  });

  ws.on("message", (raw) => {
    const message = raw.toString();

    try {
      const data = JSON.parse(message);

      if (data.type === "rename_table") {
        state.rename(data.id, data.name);
        sendUpdate();
      } else if (data.type === "toggle_table_stage") {
        state.toggleStage(data.id, data.stage);
        sendUpdate();
      } else {
        console.error("Unkown message", data);
      }
    } catch (e) {
      console.error("Invalid message", raw);
    }
  });
});
