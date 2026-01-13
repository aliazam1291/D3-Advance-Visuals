export function StatCard({
  label,
  value,
  unit,
  trend,
}: {
  label: string;
  value: string | number;
  unit?: string;
  trend?: { value: number; direction: 'up' | 'down' };
}) {
  return (
    <div className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
      <p className="text-xs font-medium text-[var(--text-muted)] mb-2">{label}</p>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-bold text-[var(--text-primary)]">{value}</span>
        {unit && <span className="text-xs text-[var(--text-muted)]">{unit}</span>}
      </div>
      {trend && (
        <p
          className={`text-xs font-medium ${
            trend.direction === 'up' ? 'text-[var(--accent-success)]' : 'text-[var(--accent-danger)]'
          }`}
        >
          {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
        </p>
      )}
    </div>
  );
}
