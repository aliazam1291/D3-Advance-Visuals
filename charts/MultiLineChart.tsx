'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface MultiLineData {
  date: string | number;
  [key: string]: string | number;
}

interface MultiLineChartProps {
  data: MultiLineData[];
  keys: string[];
  title?: string;
  width?: number;
  height?: number;
  colors?: string[];
}

export function MultiLineChart({
  data,
  keys,
  title,
  width = 600,
  height = 300,
  colors = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
  ],
}: MultiLineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        Math.max(
          ...keys.map((key) =>
            Math.max(...data.map((d) => (d[key] as number) || 0))
          )
        ) * 1.1,
      ])
      .range([innerHeight, 0]);

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Grid
    g.append('g')
      .attr('opacity', 0.1)
      .call(
        d3.axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      );

    // Lines
    keys.forEach((key, idx) => {
      const line = d3
        .line<MultiLineData>()
        .x((_, i) => xScale(i))
        .y((d) => yScale((d[key] as number) || 0));

      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', colors[idx % colors.length])
        .attr('stroke-width', 2)
        .attr('d', line);
    });

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat((d) => `${d}`))
      .style('color', 'var(--text-muted)');

    // Y axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .style('color', 'var(--text-muted)');
  }, [data, keys, width, height, colors]);

  return (
    <div className="bento-item">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <svg ref={svgRef} />
    </div>
  );
}
