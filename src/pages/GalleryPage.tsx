import { useEffect, useState } from "react";
import { getCategories, filterMealsByCategory } from "../api/meals";
import type { Category, MealLite } from "../types";
import { useResults } from "../context/ResultsContext";
import MealCard from "../components/MealCard";
import styles from "./GalleryPage.module.css";

export default function GalleryPage() {
  const { setCollection } = useResults();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<string>("Chicken");

  const [meals, setMeals] = useState<MealLite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { document.title = "MP2 • Gallery"; }, []);

  // fetch categories
  useEffect(() => {
    (async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch {
        setCategories([]);
      }
    })();
  }, []);

  // fetch meals when category changes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await filterMealsByCategory(selected);
        if (!cancelled) {
          setMeals(res);
          setCollection(res, "gallery");
        }
      } catch (e) {
        if (!cancelled) setError("Failed to load meals for this category.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selected, setCollection]);

  return (
    <main className={styles.page}>
      <h1>Gallery View</h1>

      {error && <div className={styles.err}>{error}</div>}

      <div className={styles.filters}>
        {categories.length === 0 ? (
          <span>Loading categories…</span>
        ) : (
          categories.map((cat) => (
            <button
              key={cat.strCategory}
              className={styles.filterBtn}
              aria-pressed={selected === cat.strCategory}
              onClick={() => setSelected(cat.strCategory)}
            >
              {cat.strCategory}
            </button>
          ))
        )}
      </div>

      {loading ? (
        <p className={styles.empty}>Loading meals…</p>
      ) : meals.length === 0 ? (
        <p className={styles.empty}>No meals found for {selected}.</p>
      ) : (
        <section className={styles.grid}>
          {meals.map((m) => (
            <MealCard key={m.idMeal} item={m} />
          ))}
        </section>
      )}
    </main>
  );
}
