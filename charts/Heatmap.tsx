'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface HeatmapData {
  row: string;
  column: string;
  value: number;
}

interface HeatmapProps {
  data: HeatmapData[];
  title?: string;
  width?: number;
  height?: number;
  colorScheme?: (t: number) => string;
}

export function Heatmap({
  data,
  title,
  width = 600,
  height = 300,
  colorScheme = d3.interpolateViridis,
}: HeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const margin = { top: 20, right: 20, bottom: 40, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const rows = Array.from(new Set(data.map((d) => d.row)));
    const columns = Array.from(new Set(data.map((d) => d.column)));
    const values = data.map((d) => d.value);
    const maxValue = Math.max(...values);

    const xScale = d3
      .scaleBand()
      .domain(columns)
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3
      .scaleBand()
      .domain(rows)
      .range([0, innerHeight])
      .padding(0.1);

    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, maxValue])
      .range(['var(--bg-tertiary)', 'var(--accent)']);

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.column) || 0)
      .attr('y', (d) => yScale(d.row) || 0)
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('fill', (d) => colorScale(d.value))
      .attr('opacity', 0.8)
      .attr('class', 'hover:opacity-100 cursor-pointer transition-opacity')
      .append('title')
      .text((d) => `${d.row} - ${d.column}: ${d.value}`);

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .style('color', 'var(--text-muted)')
      .selectAll('text')
      .attr('font-size', '11px');

    // Y axis
    g.append('g')
      .call(d3.axisLeft(yScale))
      .style('color', 'var(--text-muted)')
      .selectAll('text')
      .attr('font-size', '11px');
  }, [data, width, height, colorScheme]);

  return (
    <div className="bento-item">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <svg ref={svgRef} />
    </div>
  );
}
