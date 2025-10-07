import { useEffect, useState } from "react";

/** Returns a debounced copy of `value` after `delay` ms. */
export function useDebounce<T>(value: T, delay = 300) {
  const [v, setV] = useState<T>(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}
