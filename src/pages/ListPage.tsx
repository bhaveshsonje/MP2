import { useEffect, useMemo, useState } from "react";
import { searchMealsByName } from "../api/meals";
import type { Meal, MealLite } from "../types";
import { useDebounce } from "../hooks/useDebounce";
import { useResults } from "../context/ResultsContext";

import SearchBar from "../components/SearchBar";
import SortControls, { SortDir, SortKey } from "../components/SortControls";
import MealCard from "../components/MealCard";

import styles from "./ListPage.module.css";

const DEFAULT_QUERY = "chicken";

function toLite(m: Meal): MealLite {
  return {
    idMeal: m.idMeal,
    strMeal: m.strMeal,
    strMealThumb: m.strMealThumb ?? null,
    strArea: m.strArea ?? null,
    strCategory: m.strCategory ?? null,
  };
}

export default function ListPage() {
  const { setCollection } = useResults();

  const [query, setQuery] = useState(DEFAULT_QUERY);
  const debouncedQuery = useDebounce(query, 350);

  const [raw, setRaw] = useState<MealLite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    document.title = "MP2 • List";
  }, []);

  // Fetch when debounced query changes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await searchMealsByName(debouncedQuery || "a"); // 'a' tends to return many meals
        const lite = results.map(toLite);
        if (!cancelled) setRaw(lite);
      } catch (e) {
        if (!cancelled) setError("Failed to load meals. Try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  // Sort client-side
  const sorted = useMemo(() => {
    const arr = [...raw];
    const cmp = (a: MealLite, b: MealLite) => {
      const safe = (v: string | null | undefined) => (v ?? "").toLowerCase();
      let left = "", right = "";
      if (sortKey === "name") { left = safe(a.strMeal); right = safe(b.strMeal); }
      else if (sortKey === "area") { left = safe(a.strArea); right = safe(b.strArea); }
      const r = left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" });
      return sortDir === "asc" ? r : -r;
    };
    arr.sort(cmp);
    return arr;
  }, [raw, sortKey, sortDir]);

  // Push collection to context for Detail PREV/NEXT
  useEffect(() => {
    setCollection(sorted, "list");
  }, [sorted, setCollection]);

  return (
    <main className={styles.page}>
      <h1>List View</h1>

      {error && <div className={styles.err}>{error}</div>}

      <SearchBar value={query} onChange={setQuery} placeholder="Search meals by name (e.g., chicken, beef, pasta)..." />

      <SortControls
        sortKey={sortKey}
        sortDir={sortDir}
        onChange={(k, d) => { setSortKey(k); setSortDir(d); }}
        total={sorted.length}
      />

      {loading ? (
        <p className={styles.empty}>Loading…</p>
      ) : sorted.length === 0 ? (
        <p className={styles.empty}>No results.</p>
      ) : (
        <section className={styles.grid} aria-live="polite">
          {sorted.map(item => (
            <MealCard key={item.idMeal} item={item} />
          ))}
        </section>
      )}
    </main>
  );
}
