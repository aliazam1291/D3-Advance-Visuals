import * as d3 from 'd3';

/**
 * Creates a linear scale with domain and range
 */
export function createLinearScale(
  domain: [number, number],
  range: [number, number]
): d3.ScaleLinear<number, number> {
  return d3.scaleLinear().domain(domain).range(range);
}

/**
 * Creates a time scale
 */
export function createTimeScale(
  domain: [Date, Date],
  range: [number, number]
): d3.ScaleTime<number, number> {
  return d3.scaleTime().domain(domain).range(range);
}

/**
 * Creates a band scale for categorical data
 */
export function createBandScale(
  domain: string[],
  range: [number, number]
): d3.ScaleBand<string> {
  return d3.scaleBand().domain(domain).range(range);
}

/**
 * Creates a color scale
 */
export function createColorScale(domain: number[], scheme: string[] = d3.schemeCategory10): d3.ScaleOrdinal<string, string> {
  return d3.scaleOrdinal().domain(domain.map(String)).range(scheme);
}

/**
 * Creates a continuous color scale
 */
export function createContinuousColorScale(
  domain: [number, number],
  scheme: (t: number) => string
): d3.ScaleLinear<string, string> {
  return d3.scaleLinear<string>().domain(domain).range(['white', 'red']).interpolate(d3.interpolateRgb as any);
}
