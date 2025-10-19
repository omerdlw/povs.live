import { useState, useLayoutEffect, useRef } from "react";

export function useComponentSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useRef(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(() => {
      setSize({
        width: element.offsetWidth,
        height: element.offsetHeight,
      });
    });

    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  }, [ref.current]);

  return [ref, size];
}
