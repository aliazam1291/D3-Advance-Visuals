'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface AxisProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scale: any;
  orientation: 'top' | 'bottom' | 'left' | 'right';
  tickSize?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tickFormat?: (d: any) => string;
}

export default function Axis({
  scale,
  orientation,
  tickSize = 6,
  tickFormat,
}: AxisProps) {
  const gRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!gRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let axis: any;

    switch (orientation) {
      case 'bottom':
        axis = d3.axisBottom(scale);
        break;
      case 'top':
        axis = d3.axisTop(scale);
        break;
      case 'left':
        axis = d3.axisLeft(scale);
        break;
      case 'right':
        axis = d3.axisRight(scale);
        break;
    }

    if (tickFormat) {
      axis.tickFormat(tickFormat);
    }

    d3.select(gRef.current).call(axis);
  }, [scale, orientation, tickSize, tickFormat]);

  return <g ref={gRef} />;
}
