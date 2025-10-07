import { ChangeEvent } from "react";
import styles from "./SearchBar.module.css";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChange, placeholder }: Props) {
  const onInput = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value);

  return (
    <div className={styles.wrap}>
      <input
        className={styles.input}
        type="text"
        value={value}
        onChange={onInput}
        placeholder={placeholder ?? "Search meals…"}
        aria-label="Search"
      />
      {value && (
        <button className={styles.reset} onClick={() => onChange("")} aria-label="Clear search">
          Clear
        </button>
      )}
    </div>
  );
}
