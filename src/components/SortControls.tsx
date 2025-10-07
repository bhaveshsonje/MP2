import styles from "./SortControls.module.css";

export type SortKey = "name" | "area";
export type SortDir = "asc" | "desc";

type Props = {
  sortKey: SortKey;
  sortDir: SortDir;
  onChange: (key: SortKey, dir: SortDir) => void;
  total: number;
};

export default function SortControls({ sortKey, sortDir, onChange, total }: Props) {
  return (
    <div className={styles.row} role="group" aria-label="Sort controls">
      <label htmlFor="sortKey">Sort by</label>
      <select
        id="sortKey"
        className={styles.sel}
        value={sortKey}
        onChange={(e) => onChange(e.target.value as SortKey, sortDir)}
      >
        <option value="name">Name</option>
        <option value="area">Area (Cuisine)</option>
      </select>

      <button
        type="button"
        className={styles.btn}
        aria-pressed={sortDir === "asc"}
        onClick={() => onChange(sortKey, "asc")}
        aria-label="Ascending"
        title="Ascending"
      >
        ↑ ASC
      </button>

      <button
        type="button"
        className={styles.btn}
        aria-pressed={sortDir === "desc"}
        onClick={() => onChange(sortKey, "desc")}
        aria-label="Descending"
        title="Descending"
      >
        ↓ DESC
      </button>

      <div className={styles.spacer} />
      <span>{total} item(s)</span>
    </div>
  );
}
