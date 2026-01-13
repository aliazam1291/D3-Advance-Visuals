import * as d3 from 'd3';

/**
 * Format a number as a compact string
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return d3.format(`,.${decimals}f`)(value);
}

/**
 * Format a number in short notation (1K, 1M, 1B)
 */
export function formatCompact(value: number): string {
  return d3.format('.2s')(value);
}

/**
 * Format a percentage
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return d3.format(`.${decimals}%`)(value);
}

/**
 * Format a date
 */
export function formatDate(date: Date, format: string = '%Y-%m-%d'): string {
  return d3.timeFormat(format)(date);
}

/**
 * Format a time value
 */
export function formatTime(date: Date): string {
  return d3.timeFormat('%H:%M:%S')(date);
}

/**
 * Format bytes to human-readable format
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
