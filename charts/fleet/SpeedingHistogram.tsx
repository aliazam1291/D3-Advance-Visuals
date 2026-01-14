"use client";
import * as d3 from "d3";
import { useEffect, useRef } from "react";
import vehicles from "@/data/fleet/vehicles.json";

export default function SpeedHistogram() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const speeds = vehicles.map(v => v.speed_kmh);
    const width = 400;
    const height = 250;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const x = d3.scaleLinear()
      .domain([0, 80])
      .range([40, width - 20]);

    const bins = d3.bin().domain(x.domain() as [number, number]).thresholds(8)(speeds);

    const y = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length)!])
      .range([height - 40, 20]);

    svg.append("g")
      .attr("transform", `translate(0,${height - 40})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .attr("transform", `translate(40,0)`)
      .call(d3.axisLeft(y));

    svg.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", d => x(d.x0!))
      .attr("y", d => y(d.length))
      .attr("width", d => x(d.x1!) - x(d.x0!) - 2)
      .attr("height", d => height - 40 - y(d.length))
      .attr("fill", "#22c55e");

  }, []);

  return (
    <>
      <h3 className="font-semibold mb-2">Speed Distribution</h3>
      <svg ref={ref} />
    </>
  );
}
