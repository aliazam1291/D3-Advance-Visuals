'use client';

import React from 'react';

export function RadialGauge({ value = 0, size = 160 }: { value: number; size?: number }) {
  const radius = size / 2;
  const stroke = 14;
  const normalized = Math.max(0, Math.min(100, value));
  const circumference = 2 * Math.PI * (radius - stroke / 2);
  const dash = (normalized / 100) * circumference;

  return (
    <div className="bento-item flex flex-col items-center hover:scale-[1.02] transition-transform" title={`${Math.round(normalized)}%`}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id="g1"><stop offset="0%" stopColor="var(--accent)" /><stop offset="100%" stopColor="var(--accent-secondary)" /></linearGradient>
        </defs>
        <g transform={`translate(${radius},${radius})`}>
          <circle r={radius - stroke / 2} fill="none" stroke="var(--bg-panel)" strokeWidth={stroke} />
          <circle
            r={radius - stroke / 2}
            fill="none"
            stroke="url(#g1)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={circumference - dash}
            transform={`rotate(-90)`}
            style={{ transition: 'stroke-dashoffset 800ms ease' }}
          />
        </g>
      </svg>
      <div className="mt-2 text-center">
        <div className="text-2xl font-semibold">{Math.round(normalized)}%</div>
        <div className="text-sm text-(--text-muted)">Conversion rate</div>
      </div>
    </div>
  );
}
