import { useState, useEffect, useRef } from "react";
import { Table, useTables } from "./state";
import { Link, useParams } from "react-router-dom";

export function OverlayWidget() {
  const { tables } = useTables();
  const params = useParams<{ position: string }>();
  const [active, setActive] = useState<Table | null>(null);

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

  const [tableSlotWidth, setTableSlotWidth] = useState<number>(0);
  const tableSlot = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!active) {
      return;
    }

    function calculateHeight() {
      if (!tableSlot.current) {
        return;
      }

      const rect = tableSlot.current.getBoundingClientRect();
      const width = rect.height * 1.4545;
      setTableSlotWidth(width);
    }

    calculateHeight();

    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, [active]);

  if (!active) {
    return null;
  }

  return (
    <div className="h-screen w-screen aspect-video bg-zinc-900 p-6 flex gap-8 border-2 border-zinc-700">
      <aside className="flex-1 flex flex-col justify-end">
        <div className="bg-zinc-800 p-6">
          <h2 className="text-4xl text-green-400 font-bold uppercase tracking-wider mb-4">
            Tables
          </h2>

          <ul className="text-3xl">
            {tables.map((table) => (
              <li key={table.id}>
                <Link to={`/overlay-widget/${table.position}`}>
                  {table.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="flex-1 flex flex-col justify-stretch gap-4">
        <h1 className="flex-shrink-0 p-2 rounded-lg text-5xl uppercase font-semibold font-mono tracking-wide w-full text-center">
          {active.name}
        </h1>

        <div
          className="relative flex-shrink-0 flex-1 h-full border-2 border-blue-500 bg-purple-400"
          ref={tableSlot}
          data-width={tableSlotWidth}
          style={{
            width: tableSlotWidth,
          }}
        >
          {active.stage === "ITM" ? (
            <div className="bg-green-400 absolute left-2 top-2 text-black font-black text-6xl py-4 px-6 rounded-full tracking-wide">
              ITM
            </div>
          ) : active.stage === "BUBBLE" ? (
            <div className="max-w-40 absolute left-2 top-2 text-black animate-bounce">
              <img src="/bubbles.png" />
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
