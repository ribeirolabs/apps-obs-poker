import { useEffect, useState } from "react";
import { Table, generateEmptyTables } from "./state";
import { useLocation, useParams } from "react-router-dom";

export function ActiveTableWidget() {
  const [tables, setTables] = useState<Table[]>([]);
  const params = useParams<{ position: string }>();
  const [active, setActive] = useState<Table | null>(null);
  const [channel] = useState(() => new WebSocket("ws://localhost:6969"));

  useEffect(() => {
    if (!params.position || tables.length === 0) {
      return;
    }

    const table = tables.find(
      (table) => String(table.position) === params.position,
    );

    if (table) {
      setActive(table);
    }
  }, [params, tables]);

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
    <div className="w-[760px] h-[72px]">
      <h1 className="bg-black p-4 bg-zinc-950/5 -border-2 border-blue-400 text-blue-400 text-3xl uppercase font-semibold font-mono tracking-wide w-full h-full text-center">
        {active?.name ?? "-"}
      </h1>
    </div>
  );
}
