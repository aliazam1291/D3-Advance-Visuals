'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

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
  width = 600,
  height = 300,
  color = 'var(--accent)',
}: BarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
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
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(
        d3.axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      );

    // Bars
    g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(d.label) || 0)
      .attr('width', xScale.bandwidth())
      .attr('fill', color)
      .attr('opacity', 0)
      .attr('y', innerHeight)
      .attr('height', 0)
      .transition()
      .duration(500)
      .delay((_, i) => i * 50)
      .attr('y', (d) => yScale(d.value))
      .attr('height', (d) => innerHeight - yScale(d.value))
      .attr('opacity', 1);

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .style('color', 'var(--text-muted)')
      .selectAll('text')
      .attr('font-size', '12px');

    // Y axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .style('color', 'var(--text-muted)');
  }, [data, width, height, color]);

  return (
    <div className="bento-item">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <svg ref={svgRef} />
    </div>
  );
}
