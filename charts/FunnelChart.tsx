'use client';

import React from 'react';

export function FunnelChart({ data }: { data: { stage: string; count: number }[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const max = Math.max(...data.map((d) => d.count));

  return (
    <div className="bento-item">
      <h3 className="text-lg font-semibold mb-4">Pipeline</h3>
      <div className="flex flex-col gap-3">
        {data.map((d, i) => {
          const pct = Math.round((d.count / max) * 100);
          return (
            <div key={d.stage} className="flex items-center gap-4 hover:scale-[1.01] transition-transform">
              <div className="w-32 text-sm text-(--text-muted)">{d.stage}</div>
              <div className="flex-1 bg-(--bg-panel) rounded-md h-8 overflow-hidden">
                <div
                  className="h-full rounded-md transition-all duration-700"
                  style={{ width: `${pct}%`, background: `linear-gradient(90deg,var(--chart-3),var(--chart-4))` }}
                />
              </div>
              <div className="w-20 text-right text-sm font-medium">{d.count}</div>
            </div>
          );
        })}
        <div className="mt-2 text-sm text-[var(--text-muted)]">Total: {total}</div>
      </div>
    </div>
  );
}
