import { useState, useEffect } from "react";

/**
 * Debounces a value by the given delay.
 * Returns the debounced value that only updates after `delay` ms of inactivity.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500)
 */
export default function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
