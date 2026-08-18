import { useState, useEffect } from "react";

/**
 * useDebounce Hook
 * Debounces any fast-changing value (e.g. search inputs)
 * @param {*} value - The input value to debounce
 * @param {number} delay - Debounce delay in milliseconds
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
