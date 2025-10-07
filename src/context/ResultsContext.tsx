import { createContext, useContext, useMemo, useState, PropsWithChildren } from "react";
import type { MealLite } from "../types";

type Source = "list" | "gallery" | null;

type ResultsState = {
  source: Source;
  items: MealLite[];            // the currently visible collection (after sort/filter)
  setCollection: (items: MealLite[], source: Source) => void;

  // helpers for Detail page
  indexOf: (id: string) => number;
  neighborIds: (currentId: string) => { prevId: string | null; nextId: string | null };
};

const Ctx = createContext<ResultsState | null>(null);

export function ResultsProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<MealLite[]>([]);
  const [source, setSource] = useState<Source>(null);

  const value: ResultsState = useMemo(() => {
    const indexOf = (id: string) => items.findIndex(m => m.idMeal === id);

    const neighborIds = (currentId: string) => {
      const idx = indexOf(currentId);
      if (idx < 0) return { prevId: null, nextId: null };
      const prev = idx > 0 ? items[idx - 1].idMeal : null;
      const next = idx < items.length - 1 ? items[idx + 1].idMeal : null;
      return { prevId: prev, nextId: next };
    };

    return {
      source,
      items,
      setCollection: (arr, src) => { setItems(arr); setSource(src); },
      indexOf,
      neighborIds,
    };
  }, [items, source]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useResults() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useResults must be used within ResultsProvider");
  return ctx;
}
