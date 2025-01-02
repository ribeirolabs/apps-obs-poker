import { useCallback, useEffect, useState } from "react";

export type Table = {
  id: string;
  position: number;
  name: string;
  stage: "ITM" | "BUBBLE" | "NONE";
};

const MAIN_TABLES = 6;

export function getInititalTables(): Table[] {
  return Array.from({ length: MAIN_TABLES }, (_, i) => {
    return {
      id: `MAIN_TABLE_${i + 1}`,
      position: i + 1,
      name: `Table ${i + 1}`,
      stage: "NONE",
    };
  });
}

export class State {
  public tables: Table[];

  constructor() {
    this.tables = getInititalTables();
  }

  protected update(id: string, updater: (table: Table) => void): Table[] {
    for (const table of this.tables) {
      if (table.id === id) {
        updater(table);
      }
    }
    return this.tables;
  }

  public rename(id: string, name: string): Table[] {
    return this.update(id, (table) => {
      table.name = name;
    });
  }

  public toggleStage(id: string, stage: Table["stage"]): Table[] {
    return this.update(id, (table) => {
      table.stage = stage;
    });
  }
}

export function useTables() {
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

    channel.addEventListener("message", onMessage);
    return () => channel.removeEventListener("message", onMessage);
  }, [channel]);

  const renameTable = useCallback((id: string, name: string) => {
    channel.send(
      JSON.stringify({
        type: "rename_table",
        id,
        name,
      }),
    );
  }, []);

  const updateTableStage = useCallback((id: string, stage: Table["stage"]) => {
    channel.send(
      JSON.stringify({
        type: "toggle_table_stage",
        id,
        stage,
      }),
    );
  }, []);

  return {
    tables,
    renameTable,
    updateTableStage,
  };
}
