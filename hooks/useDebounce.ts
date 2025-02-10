import { useState, useEffect } from 'react';

export function useDebounce(value: string, delay: number = 300, charWindow: number = 4) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [lastTriggerLength, setLastTriggerLength] = useState(value.length);

  useEffect(() => {
    if (Math.abs(value.length - lastTriggerLength) >= charWindow) {
      setDebouncedValue(value);
      setLastTriggerLength(value.length);
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, charWindow, lastTriggerLength]);

  return debouncedValue;
}
