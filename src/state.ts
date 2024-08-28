import { checkPrime } from "crypto";
import { useCallback, useEffect, useState } from "react";

export type Table = {
  id: string;
  position: number;
  name: string;
  state: "ITM" | "BUBBLE" | "NONE";
};

const MAIN_TABLES = 6;

export function generateEmptyTables(): Table[] {
  return Array.from({ length: MAIN_TABLES }, (_, i) => {
    return {
      id: `MAIN_TABLE_${i + 1}`,
      position: i + 1,
      name: `Table ${i + 1}`,
      state: "NONE",
    };
  });
}

export function useTables() {
  const [tables, setTables] = useState<Table[]>(generateEmptyTables);
  const [channel] = useState(() => new WebSocket("ws://localhost:6969"));
  const [ready, setReady] = useState(false);

  const renameTable = useCallback((id: string, name: string) => {
    setTables((existing) => {
      const next = [...existing];
      for (const table of next) {
        if (table.id === id) {
          table.name = name;
        }
      }
      return next;
    });
  }, []);

  useEffect(() => {
    channel.addEventListener("open", () => {
      setReady(true);
      channel.send(
        JSON.stringify({
          type: "update_tables",
          tables,
        }),
      );
    });
  }, [channel]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    channel.send(
      JSON.stringify({
        type: "update_tables",
        tables,
      }),
    );

    function onMessage(message: MessageEvent<any>) {
      try {
        const data = JSON.parse(message.data);
        console.log("received", data);
        if (data.type === "joined") {
          channel.send(
            JSON.stringify({
              type: "update_tables",
              tables,
            }),
          );
        }
      } catch (e) {
        console.error("invalid message");
      }
    }

    channel.addEventListener("message", onMessage);
    return () => channel.removeEventListener("message", onMessage);
  }, [ready, channel, tables]);

  useEffect(() => {}, [channel]);

  const updateTableState = useCallback((id: string, state: Table["state"]) => {
    setTables((existing) => {
      const next = [...existing];
      for (const table of next) {
        if (table.id === id) {
          table.state = state;
        }
      }
      return next;
    });
  }, []);

  return {
    tables,
    renameTable,
    updateTableState,
  };
}
