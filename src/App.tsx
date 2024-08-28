import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Table, generateEmptyTables, useTables } from "./state";

function App() {
  const { tables, renameTable, updateTableState } = useTables();

  return (
    <div className="p-4">
      <div>
        <h2 className="font-bold text-3xl mb-4">Tables</h2>
        <ul className="grid grid-cols-3 grid-rows-2 gap-2">
          {tables.map((table) => {
            return (
              <li key={table.id} className="bg-zinc-950 rounded-lg p-4">
                <div className="flex gap-2 items-center justify-between">
                  <input
                    type="text"
                    defaultValue={table.name}
                    onChange={(e) => renameTable(table.id, e.target.value)}
                    onFocus={(e) => e.target.setSelectionRange(0, -1)}
                    className="font-bold text-xl hover:bg-white/5 rounded flex-1 cursor-pointer p-2"
                  />

                  <div className="text-white/50 font-bold">
                    {table.position}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateTableState(
                        table.id,
                        table.state === "ITM" ? "NONE" : "ITM",
                      )
                    }
                    className={twMerge(
                      "font-semibold px-6 py-2 rounded text-sm tracking-wide",
                      table.state === "ITM"
                        ? "bg-green-400 text-black"
                        : "bg-zinc-900",
                    )}
                  >
                    ITM
                  </button>
                  <button
                    onClick={() =>
                      updateTableState(
                        table.id,
                        table.state === "BUBBLE" ? "NONE" : "BUBBLE",
                      )
                    }
                    className={twMerge(
                      "font-semibold px-6 py-2 rounded text-sm tracking-wide",
                      table.state === "BUBBLE"
                        ? "bg-green-400 text-black"
                        : "bg-zinc-900",
                    )}
                  >
                    BUBBLE
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
