'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  icon?: React.ReactNode;
  color?: 'accent' | 'success' | 'warning' | 'danger';
}

export function KPICard({
  title,
  value,
  unit,
  change,
  icon,
  color = 'accent',
}: KPICardProps) {
  const colorMap = {
    accent: 'from-[var(--accent)] to-[var(--accent-secondary)]',
    success: 'from-[var(--accent-success)] to-[#06b6d4]',
    warning: 'from-[var(--accent-warning)] to-[#f97316]',
    danger: 'from-[var(--accent-danger)] to-[#ef4444]',
  };

  return (
    <div className="bento-item group relative overflow-hidden">
      {/* Glow effect on hover */}
      <div className="absolute -inset-2 bg-gradient-to-r from-[var(--accent)] via-[var(--accent-secondary)] to-transparent opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10" />
      
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[var(--text-secondary)] text-sm font-semibold mb-3 uppercase tracking-wide">
            {title}
          </p>
          <div className="flex items-end gap-2">
            <span className={`text-4xl font-black gradient-text`}>
              {value}
            </span>
            {unit && (
              <span className="text-[var(--text-muted)] text-xs mb-2 font-medium uppercase">
                {unit}
              </span>
            )}
          </div>
          {change !== undefined && (
            <p
              className={`text-sm mt-4 font-semibold flex items-center gap-1 ${
                change >= 0
                  ? 'text-[var(--accent-success)]'
                  : 'text-[var(--accent-danger)]'
              }`}
            >
              <span className="text-lg">{change >= 0 ? '↗' : '↘'}</span>
              {change >= 0 ? '+' : ''}{Math.abs(change)}% vs last month
            </p>
          )}
        </div>
        {icon && (
          <div
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-2xl opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 shadow-lg group-hover:shadow-2xl`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
