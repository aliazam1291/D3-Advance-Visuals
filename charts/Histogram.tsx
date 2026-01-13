'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useChartSize } from './common/useChartSize';

interface HistogramData {
  value: number;
}

interface HistogramProps {
  data: HistogramData[];
  title?: string;
  width?: number;
  height?: number;
  bins?: number;
  color?: string;
}

export function Histogram({
  data,
  title,
  width,
  height = 300,
  bins = 20,
  color = 'var(--accent)',
}: HistogramProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const size = useChartSize(wrapperRef, height, 0.35);
  const computedWidth = width || size.width;

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const innerWidth = computedWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);

    const histogram = d3
      .histogram()
      .domain([min, max])
      .thresholds(bins);

    const binned = histogram(values);

    const xScale = d3
      .scaleLinear()
      .domain([min, max])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, Math.max(...binned.map((d) => d.length))])
      .range([innerHeight, 0]);

    const g = svg
      .attr('width', computedWidth)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.selectAll('rect')
      .data(binned)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.x0!))
      .attr('width', (d) => Math.max(0, xScale(d.x1!) - xScale(d.x0!)) - 1)
      .attr('y', (d) => yScale(d.length))
      .attr('height', (d) => innerHeight - yScale(d.length))
      .attr('fill', color)
      .attr('opacity', 0.9)
      .attr('class', 'group cursor-pointer transition-opacity')
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('opacity', 1).attr('stroke', 'rgba(0,0,0,0.06)').attr('stroke-width', 1);
        const tooltip = tooltipRef.current;
        if (tooltip && wrapperRef.current) {
          tooltip.style.opacity = '1';
          const rect = wrapperRef.current.getBoundingClientRect();
          const x = xScale(d.x0!) + (xScale(d.x1!) - xScale(d.x0!)) / 2;
          tooltip.style.left = `${rect.left + margin.left + x}px`;
          tooltip.style.top = `${rect.top + margin.top + yScale(d.length)}px`;
          tooltip.innerHTML = `Count: <strong>${d.length}</strong>`;
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
      .style('color', 'var(--text-muted)');

    // Y axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .style('color', 'var(--text-muted)');
  }, [data, computedWidth, height, bins, color]);

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
