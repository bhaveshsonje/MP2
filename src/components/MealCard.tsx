import { Link } from "react-router-dom";
import type { MealLite } from "../types";
import styles from "./MealCard.module.css";

type Props = { item: MealLite };

export default function MealCard({ item }: Props) {
  return (
    <Link className={styles.card} to={`/meal/${item.idMeal}`} aria-label={`Open details for ${item.strMeal}`}>
      {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
      <img className={styles.thumb} src={item.strMealThumb ?? ""} alt={`Image of ${item.strMeal}`} />
      <div className={styles.body}>
        <h3 className={styles.title}>{item.strMeal}</h3>
        <div className={styles.meta}>
          {item.strArea ? item.strArea : "Unknown area"}
          {item.strCategory ? ` • ${item.strCategory}` : ""}
        </div>
      </div>
    </Link>
  );
}
