'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useChartSize } from './common/useChartSize';

interface DataPoint {
  x: string | number;
  y: number;
}

interface LineChartProps {
  data: DataPoint[];
  title?: string;
  width?: number;
  height?: number;
  color?: string;
  animated?: boolean;
}

export function LineChart({
  data,
  title,
  width,
  height = 300,
  color = 'var(--accent)',
  animated = true,
}: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const size = useChartSize(wrapperRef, height, 0.42);
  const computedWidth = width || size.width;
  const computedHeight = height || size.height;

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current || !wrapperRef.current) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const innerWidth = computedWidth - margin.left - margin.right;
    const innerHeight = computedHeight - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // gradient id unique
    const gid = `gradient-${Math.random().toString(36).slice(2, 9)}`;

    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, Math.max(...data.map((d) => d.y)) * 1.1])
      .range([innerHeight, 0]);

    const line = d3
      .line<DataPoint>()
      .x((_, i) => xScale(i))
      .y((d) => yScale(d.y))
      .curve(d3.curveMonotoneX);

    const g = svg
      .attr('width', computedWidth)
      .attr('height', computedHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Grid lines (slightly stronger in light mode for readability)
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

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat((d) => `${d}`))
      .style('color', 'var(--text-secondary)');

    // Y axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .style('color', 'var(--text-secondary)');

    // Line path
    const path = g
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2.5)
      .attr('d', line);

    if (animated) {
      const pathLength = (path.node() as SVGPathElement).getTotalLength();
      path
        .attr('stroke-dasharray', pathLength)
        .attr('stroke-dashoffset', pathLength)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);
    }

    // Area under line
    const area = d3
      .area<DataPoint>()
      .x((_, i) => xScale(i))
      .y0(innerHeight)
      .y1((d) => yScale(d.y));

    g.append('path')
      .datum(data)
      .attr('fill', `url(#${gid})`)
      .attr('d', area)
      .attr('opacity', 0.14);

    // Gradient definition
    const defs = svg.append('defs');
    const gradient = defs
      .append('linearGradient')
      .attr('id', gid)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 0.25);
    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', color)
      .attr('stop-opacity', 0);

    // Tooltip overlay
    const tooltip = tooltipRef.current;
    const focus = g.append('g').style('display', 'none');

    focus.append('circle').attr('r', 4).attr('fill', color).attr('stroke', 'white').attr('stroke-width', 1.5);

    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .attr('pointer-events', 'all')
      .on('mouseover', () => focus.style('display', null))
      .on('mouseout', () => {
        focus.style('display', 'none');
        if (tooltip) tooltip.style.opacity = '0';
      })
      .on('mousemove', function (event) {
        const [mx] = d3.pointer(event);
        const idx = Math.min(data.length - 1, Math.max(0, Math.round(xScale.invert(mx))));
        const d = data[idx];
        focus.attr('transform', `translate(${xScale(idx)},${yScale(d.y)})`);
        if (tooltip) {
          tooltip.style.opacity = '1';
          const rect = wrapperRef.current!.getBoundingClientRect();
          tooltip.style.left = `${rect.left + margin.left + xScale(idx)}px`;
          tooltip.style.top = `${rect.top + margin.top + yScale(d.y)}px`;
          tooltip.innerHTML = `<strong>${d3.format(',')(d.y)}</strong><div style="font-size:0.85rem;color:var(--text-secondary)">${d.x}</div>`;
        }
      });
  }, [data, computedWidth, computedHeight, color, animated]);

  return (
    <div className="bento-item relative" ref={wrapperRef}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div className="relative">
        <svg ref={svgRef} />
        <div ref={tooltipRef} className="chart-tooltip" style={{ opacity: 0 }} />
      </div>
    </div>
  );
}
