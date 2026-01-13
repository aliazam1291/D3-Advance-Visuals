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
    <div className="bento-item group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[var(--text-secondary)] text-sm font-medium mb-2">
            {title}
          </p>
          <div className="flex items-end gap-2">
            <span className={`text-3xl font-bold gradient-text`}>
              {value}
            </span>
            {unit && (
              <span className="text-[var(--text-muted)] text-sm mb-1">
                {unit}
              </span>
            )}
          </div>
          {change !== undefined && (
            <p
              className={`text-sm mt-3 ${
                change >= 0
                  ? 'text-[var(--accent-success)]'
                  : 'text-[var(--accent-danger)]'
              }`}
            >
              {change >= 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        {icon && (
          <div
            className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-xl opacity-80 group-hover:opacity-100 transition-opacity`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
