'use client';

import { useEffect, useRef } from 'react';

interface MultiLineProps {
  data: Array<Record<string, string | number>>;
  width?: number;
  height?: number;
}

export default function MultiLine({ data, width = 800, height = 400 }: MultiLineProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    // D3 visualization logic here
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
}
