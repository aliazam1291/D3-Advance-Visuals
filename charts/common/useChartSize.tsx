import { useEffect, useState, RefObject } from 'react';

export function useChartSize(ref: RefObject<HTMLElement | null>, defaultHeight = 300, aspect?: number) {
  const [size, setSize] = useState({ width: 600, height: defaultHeight });

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current as HTMLElement;

    const compute = () => {
      const width = Math.max(320, el.clientWidth || 600);
      const height = aspect ? Math.round(width * aspect) : defaultHeight;
      setSize({ width, height });
    };

    compute();

    const ro = new ResizeObserver(() => {
      compute();
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, defaultHeight, aspect]);

  return size;
}
