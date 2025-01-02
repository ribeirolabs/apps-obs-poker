import { useEffect, useState } from "react";
import { Table, getInititalTables } from "./state";

export function TablesWidget() {
  const [tables, setTables] = useState<Table[]>([]);
  const [channel] = useState(() => new WebSocket("ws://localhost:6969"));

  useEffect(() => {
    function onMessage(message: MessageEvent<any>) {
      try {
        const data = JSON.parse(message.data);

        if (data.type === "update_tables") {
          setTables(data.tables);
        }
      } catch (e) {
        console.error("invalid message");
      }
    }

    channel.addEventListener("open", () => {
      channel.send(
        JSON.stringify({
          type: "joined",
        }),
      );
    });

    channel.addEventListener("message", onMessage);
    return () => channel.removeEventListener("message", onMessage);
  }, [channel]);

  return (
    <div className="w-[200px] h-[300px] bg-black p-4 border-2 border-blue-400">
      <h1 className="text-blue-400 text-3xl uppercase mb-4 font-semibold font-mono tracking-wide">
        Tables
      </h1>
      <ul className="text-2xl">
        {tables.map((table) => (
          <li key={table.id}>{table.name}</li>
        ))}
      </ul>
    </div>
  );
}
