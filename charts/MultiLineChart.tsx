'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useChartSize } from './common/useChartSize';

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
  width,
  height = 300,
  colors = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
  ],
}: MultiLineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const size = useChartSize(wrapperRef, height, 0.42);
  const computedWidth = width || size.width;
  const [activeKeys, setActiveKeys] = useState(() => new Set(keys));

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const innerWidth = computedWidth - margin.left - margin.right;
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
      .attr('width', computedWidth)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Grid (slightly stronger in light mode)
    g.append('g')
      .attr('opacity', 0.18)
      .call(
        d3.axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      );

    // Lines
    keys.forEach((key, idx) => {
      if (!activeKeys.has(key)) return;
      const line = d3
        .line<MultiLineData>()
        .x((_, i) => xScale(i))
        .y((d) => yScale((d[key] as number) || 0))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', colors[idx % colors.length])
        .attr('stroke-width', 2)
        .attr('d', line)
        .attr('opacity', 0.95);
    });

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat((d) => `${d}`))
      .style('color', 'var(--text-secondary)');

    // Y axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .style('color', 'var(--text-secondary)');

    // Tooltip overlay
    const tooltip = tooltipRef.current;
    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .attr('pointer-events', 'all')
      .on('mousemove', function (event) {
        const [mx] = d3.pointer(event);
        const idx = Math.min(data.length - 1, Math.max(0, Math.round(xScale.invert(mx))));
        const row = data[idx];
        if (!tooltip) return;
        tooltip.style.opacity = '1';
        const rect = wrapperRef.current!.getBoundingClientRect();
        tooltip.style.left = `${rect.left + margin.left + xScale(idx)}px`;
        tooltip.style.top = `${rect.top + margin.top + yScale((row[keys[0]] as number) || 0)}px`;
        tooltip.innerHTML = keys
          .filter((k) => activeKeys.has(k))
          .map((k, i) => `<div><span style="display:inline-block;width:10px;height:10px;background:${colors[i % colors.length]};margin-right:6px;border-radius:2px"></span><strong>${k}</strong>: ${(row[k] as number) || 0}</div>`)
          .join('');
      })
      .on('mouseout', () => { if (tooltip) tooltip.style.opacity = '0'; });
  }, [data, keys, computedWidth, height, colors, activeKeys]);

  return (
    <div className="bento-item" ref={wrapperRef}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}

      <div className="chart-legend mb-3">
        {keys.map((k, i) => (
          <div key={k} className="item" onClick={() => {
            const s = new Set(activeKeys);
            if (s.has(k)) s.delete(k); else s.add(k);
            setActiveKeys(s);
          }} style={{ cursor: 'pointer' }}>
            <span className="swatch" style={{ background: colors[i % colors.length] }} />
            <span>{k}</span>
          </div>
        ))}
      </div>

      <div style={{ position: 'relative' }}>
        <svg ref={svgRef} />
        <div ref={tooltipRef} className="chart-tooltip" style={{ opacity: 0 }} />
      </div>
    </div>
  );
}
