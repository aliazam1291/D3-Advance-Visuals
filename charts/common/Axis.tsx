'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface AxisProps {
  scale: d3.AxisScale<any>;
  orientation: 'top' | 'bottom' | 'left' | 'right';
  tickSize?: number;
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

    let axis: d3.Axis<any>;

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
