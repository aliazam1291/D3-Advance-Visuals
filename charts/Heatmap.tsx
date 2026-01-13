'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useChartSize } from './common/useChartSize';

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
  width,
  height = 300,
  colorScheme = d3.interpolateViridis,
}: HeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const size = useChartSize(wrapperRef, height, 0.45);
  const computedWidth = width || size.width;

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const margin = { top: 20, right: 20, bottom: 40, left: 100 };
    const innerWidth = computedWidth - margin.left - margin.right;
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
      .padding(0.05);

    const yScale = d3
      .scaleBand()
      .domain(rows)
      .range([0, innerHeight])
      .padding(0.05);

    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, maxValue || 1])
      .range(['var(--bg-tertiary)', 'var(--chart-1)']);

    const g = svg
      .attr('width', computedWidth)
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
      .attr('opacity', 0.9)
      .attr('class', 'cursor-pointer transition-opacity')
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('opacity', 1).attr('stroke', 'rgba(0,0,0,0.06)').attr('stroke-width', 1);
        const tooltip = tooltipRef.current;
        if (tooltip && wrapperRef.current) {
          tooltip.style.opacity = '1';
          const rect = wrapperRef.current.getBoundingClientRect();
          const x = (xScale(d.column) || 0) + xScale.bandwidth() / 2;
          const y = (yScale(d.row) || 0) + yScale.bandwidth() / 2;
          tooltip.style.left = `${rect.left + margin.left + x}px`;
          tooltip.style.top = `${rect.top + margin.top + y}px`;
          tooltip.innerHTML = `<strong>${d.row}</strong><div>${d.column}: ${d.value}</div>`;
        }
      })
      .on('mouseleave', function () {
        d3.select(this).attr('opacity', 0.9).attr('stroke', null);
        const tooltip = tooltipRef.current;
        if (tooltip) tooltip.style.opacity = '0';
      });

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
  }, [data, computedWidth, height, colorScheme]);

  return (
    <div className="bento-item" ref={wrapperRef}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div style={{ position: 'relative' }}>
        <svg ref={svgRef} />
        <div ref={tooltipRef} className="chart-tooltip" style={{ opacity: 0 }} />
      </div>
    </div>
  );
}
