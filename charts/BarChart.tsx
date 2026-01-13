'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useChartSize } from './common/useChartSize';

interface BarData {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarData[];
  title?: string;
  width?: number;
  height?: number;
  color?: string;
}

export function BarChart({
  data,
  title,
  width,
  height = 300,
  color = 'var(--accent)',
}: BarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const size = useChartSize(wrapperRef, height, 0.6);
  const computedWidth = width || size.width;

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const innerWidth = computedWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.3);

    const yScale = d3
      .scaleLinear()
      .domain([0, Math.max(...data.map((d) => d.value))])
      .range([innerHeight, 0]);

    const g = svg
      .attr('width', computedWidth)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Grid lines (slightly stronger in light mode)
    g.append('g')
      .attr('class', 'grid')
      .call(
        d3.axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', 'var(--border)')
      .attr('stroke-opacity', 0.9);

    // Bars
    g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.label) || 0)
      .attr('width', xScale.bandwidth())
      .attr('fill', color)
      .attr('opacity', 0.9)
      .attr('y', innerHeight)
      .attr('height', 0)
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('opacity', 1).attr('stroke', 'rgba(0,0,0,0.08)').attr('stroke-width', 1);
        const tooltip = tooltipRef.current;
        if (tooltip) {
          tooltip.style.opacity = '1';
          const rect = wrapperRef.current!.getBoundingClientRect();
          const x = (xScale(d.label) || 0) + xScale.bandwidth() / 2;
          tooltip.style.left = `${rect.left + margin.left + x}px`;
          tooltip.style.top = `${rect.top + margin.top + (yScale(d.value))}px`;
          tooltip.innerHTML = `<strong>${d.label}</strong><div>${d.value}</div>`;
        }
      })
      .on('mouseleave', function () {
        d3.select(this).attr('opacity', 0.9).attr('stroke', null);
        const tooltip = tooltipRef.current;
        if (tooltip) tooltip.style.opacity = '0';
      })
      .transition()
      .duration(500)
      .delay((_, i) => i * 50)
      .attr('y', (d) => yScale(d.value))
      .attr('height', (d) => innerHeight - yScale(d.value));

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .style('color', 'var(--text-secondary)')
      .selectAll('text')
      .attr('font-size', '12px');

    // Y axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .style('color', 'var(--text-secondary)');
  }, [data, computedWidth, height, color]);

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
