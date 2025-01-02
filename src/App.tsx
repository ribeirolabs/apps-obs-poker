import { twMerge } from "tailwind-merge";
import { useTables } from "./state";
import { useEffect, useState } from "react";
import { OBS } from "./obs";
import OBSWebSocket from "obs-websocket-js/json";

function App() {
  const { tables, renameTable, updateTableStage } = useTables();
  const [obs] = useState(() => new OBSWebSocket());

  useEffect(() => {
    (async function connect() {
      try {
        console.log("trying to connect");
        await obs.connect(
          "ws://192.168.10.50:4455",
          import.meta.env.VITE_OBS_AUTH,
        );

        console.log("connected to OBS");

        const { sceneItemId } = await obs.call("GetSceneItemId", {
          sceneName: "Table 2",
          sourceName: "Screen",
        });

        const screen = {
          w: 1706,
          h: 1080,
        };

        const h = screen.h / 2;
        const w = Math.round(h * 1.4545);
        console.log({ w, h });

        await obs.call("SetSceneItemTransform", {
          sceneName: "Table 2",
          sceneItemId,
          sceneItemTransform: {
            cropBottom: 0,
            cropLeft: screen.w - w,
            cropRight: 0,
            cropTop: h,
          },
        });
      } catch (e: any) {
        console.error("Unable to connect to OBS", e.code, e.message, e);
      }
    })();

    return () => {
      console.log("diconnecting");
      obs.disconnect();
    };
  }, [obs]);

  return (
    <div className="p-4">
      <div>
        <h2 className="font-bold text-3xl mb-4">Tables</h2>
        <ul className="grid grid-cols-3 grid-rows-2 gap-2">
          {tables.map((table) => {
            return (
              <li key={table.id} className="bg-zinc-950 rounded-lg p-4">
                <div className="flex gap-2 items-center justify-between">
                  <div className="text-white/50 font-bold">
                    {table.position}
                  </div>
                  <input
                    type="text"
                    defaultValue={table.name}
                    onChange={(e) => renameTable(table.id, e.target.value)}
                    onFocus={(e) => e.target.setSelectionRange(0, -1)}
                    className="font-bold text-xl hover:bg-white/5 rounded flex-1 cursor-pointer p-2"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateTableStage(
                        table.id,
                        table.stage === "ITM" ? "NONE" : "ITM",
                      )
                    }
                    className={twMerge(
                      "font-semibold px-6 py-2 rounded text-sm tracking-wide",
                      table.stage === "ITM"
                        ? "bg-green-400 text-black"
                        : "bg-zinc-900",
                    )}
                  >
                    ITM
                  </button>
                  <button
                    onClick={() =>
                      updateTableStage(
                        table.id,
                        table.stage === "BUBBLE" ? "NONE" : "BUBBLE",
                      )
                    }
                    className={twMerge(
                      "font-semibold px-6 py-2 rounded text-sm tracking-wide",
                      table.stage === "BUBBLE"
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
