import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { extractIngredients, getMealById } from "../api/meals";
import type { Meal } from "../types";
import { useResults } from "../context/ResultsContext";
import styles from "./DetailPage.module.css";

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { source, items, neighborIds } = useResults();

  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const m = await getMealById(id);
        if (!cancelled) setMeal(m);
      } catch {
        if (!cancelled) setError("Failed to load this item.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    document.title = meal?.strMeal ? `MP2 • ${meal.strMeal}` : "MP2 • Detail";
  }, [meal]);

  const { prevId, nextId } = useMemo(() => {
    if (!id) return { prevId: null as string | null, nextId: null as string | null };
    return neighborIds(id);
  }, [id, neighborIds]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" && prevId) navigate(`/meal/${prevId}`);
      if (e.key === "ArrowRight" && nextId) navigate(`/meal/${nextId}`);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, prevId, nextId]);

  const backHref = source === "gallery" ? "/gallery" : "/";

  return (
    <main className={styles.page}>
      {error && <div className={styles.err}>{error}</div>}

      <p>
        <Link to={backHref}>← Back to {source === "gallery" ? "Gallery" : "List"}</Link>
        {items.length === 0 && <span className={styles.note}>(Prev/Next disabled on direct link)</span>}
      </p>

      {loading || !meal ? (
        <p>Loading…</p>
      ) : (
        <>
          <div className={styles.top}>
            {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
            <img className={styles.img} src={meal.strMealThumb ?? ""} alt={`Image of ${meal.strMeal}`} />
            <div>
              <h1 className={styles.h1}>{meal.strMeal}</h1>
              <div className={styles.meta}>
                {meal.strArea ? meal.strArea : "Unknown area"}
                {meal.strCategory ? ` • ${meal.strCategory}` : ""}
              </div>

              <div className={styles.tags}>
                {(meal.strTags ?? "")
                  .split(",")
                  .map(t => t.trim())
                  .filter(Boolean)
                  .slice(0, 8)
                  .map(tag => (<span className={styles.tag} key={tag}>{tag}</span>))}
              </div>

              <div className={styles.pager} role="group" aria-label="Item navigation">
                <button
                  className={styles.btn}
                  onClick={() => prevId && navigate(`/meal/${prevId}`)}
                  disabled={!prevId}
                  aria-label="Previous item"
                >
                  ◀ Prev
                </button>
                <button
                  className={styles.btn}
                  onClick={() => nextId && navigate(`/meal/${nextId}`)}
                  disabled={!nextId}
                  aria-label="Next item"
                >
                  Next ▶
                </button>
              </div>
            </div>
          </div>

          <section className={styles.section}>
            <h2>Ingredients</h2>
            <ul className={styles.ingList}>
              {extractIngredients(meal).map(({ ingredient, measure }) => (
                <li key={ingredient}>
                  {ingredient} {measure ? `— ${measure}` : ""}
                </li>
              ))}
            </ul>
          </section>

          {meal.strInstructions && (
            <section className={styles.section}>
              <h2>Instructions</h2>
              <p className={styles.instructions}>{meal.strInstructions}</p>
            </section>
          )}
        </>
      )}
    </main>
  );
}
