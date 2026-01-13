import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

/**
 * Custom hook for D3 visualizations
 * Provides a ref to SVG element and handles D3 operations
 */
export function useD3<T>(
  callback: (svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>) => void,
  deps?: React.DependencyList
) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (ref.current) {
      callback(d3.select(ref.current));
    }
  }, deps);

  return ref;
}

export default useD3;
