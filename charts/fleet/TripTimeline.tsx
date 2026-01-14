"use client";
import * as d3 from "d3";
import { useEffect, useRef } from "react";
import trips from "@/data/fleet/trips.json";

export default function TripTimeline() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const width = 900;
    const height = 200;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    const x = d3.scaleBand()
      .domain(trips.map(t => t.id))
      .range([40, width - 20])
      .padding(0.4);

    svg.append("g")
      .attr("transform", `translate(0,${height - 40})`)
      .call(d3.axisBottom(x));

    svg.selectAll("rect")
      .data(trips)
      .enter()
      .append("rect")
      .attr("x", d => x(d.id)!)
      .attr("y", 60)
      .attr("width", x.bandwidth())
      .attr("height", 40)
      .attr("fill", d => d.status === "delayed" ? "#ef4444" : "#3b82f6");
  }, []);

  return (
    <>
      <h3 className="font-semibold mb-2">Trip Performance</h3>
      <svg ref={ref} />
    </>
  );
}
