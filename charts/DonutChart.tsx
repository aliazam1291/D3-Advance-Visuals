'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useChartSize } from './common/useChartSize';

interface Slice {
  label: string;
  value: number;
}

export function DonutChart({
  data,
  width,
  height = 300,
  innerRadius = 60,
  outerRadius = 100,
}: {
  data: Slice[];
  width?: number;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
}) {
  const ref = useRef<SVGSVGElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const size = useChartSize(wrapperRef, height, 1);
  const computedWidth = width || Math.min(size.width, 420);
  const computedHeight = height || computedWidth;

  useEffect(() => {
    if (!data || data.length === 0 || !ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    const g = svg
      .attr('width', computedWidth)
      .attr('height', computedHeight)
      .append('g')
      .attr('transform', `translate(${computedWidth / 2},${computedHeight / 2})`);

    const pieGen = d3.pie<Slice>().value((d) => d.value);
    const arcGen = d3.arc<d3.PieArcDatum<Slice>>().innerRadius(innerRadius).outerRadius(outerRadius).cornerRadius(6);

    const color = d3.scaleOrdinal<string>().domain(data.map((d) => d.label)).range([
      'var(--chart-1)',
      'var(--chart-2)',
      'var(--chart-3)',
      'var(--chart-4)',
      'var(--chart-5)',
      'var(--chart-6)',
    ] as unknown as string[]);

    g.selectAll('path').data(pieGen(data)).enter().append('path')
      .attr('d', (d) => arcGen(d)!)
      .attr('fill', (d) => color(d.data.label))
      .attr('opacity', 0.95)
      .attr('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('transform', 'scale(1.03)');
        const tooltip = tooltipRef.current;
        if (tooltip && wrapperRef.current) {
          const rect = wrapperRef.current.getBoundingClientRect();
          tooltip.style.opacity = '1';
          tooltip.style.left = `${rect.left + rect.width / 2}px`;
          tooltip.style.top = `${rect.top + rect.height / 2}px`;
          tooltip.innerHTML = `<strong>${d.data.label}</strong><div>${d.data.value}</div>`;
        }
      })
      .on('mouseleave', function () {
        d3.select(this).attr('transform', '');
        const tooltip = tooltipRef.current;
        if (tooltip) tooltip.style.opacity = '0';
      });

    // center label
    const total = d3.sum(data, (d) => d.value);
    g.append('text').attr('text-anchor', 'middle').attr('dy', '-0.2em').attr('class', 'text-lg font-semibold').text(() => `${d3.format(',')(total)}`);
    g.append('text').attr('text-anchor', 'middle').attr('dy', '1.1em').attr('class', 'text-sm').style('fill', 'var(--text-muted)').text('total');
  }, [data, computedWidth, computedHeight, innerRadius, outerRadius]);

  return (
    <div className="bento-item" ref={wrapperRef}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <svg ref={ref} />
        <div className="chart-legend">
          {data.map((d, i) => (
            <div key={d.label} className="item"><span className="swatch" style={{ background: `var(--chart-${(i % 6) + 1})` }} />{d.label}</div>
          ))}
        </div>
      </div>
      <div ref={tooltipRef} className="chart-tooltip" style={{ opacity: 0 }} />
    </div>
  );
}
