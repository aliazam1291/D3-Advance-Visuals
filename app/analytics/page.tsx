import { KPICard } from '@/charts/KPICard';
import { MultiLineChart } from '@/charts/MultiLineChart';
import { LineChart } from '@/charts/LineChart';
import { Heatmap } from '@/charts/Heatmap';
import kpis from '@/data/analytics/kpis.json';
import performance from '@/data/analytics/performance.json';

export default function AnalyticsPage() {
  const totalRevenue = kpis.reduce((sum, d) => sum + d.revenue, 0);
  const avgRevenue = Math.round(totalRevenue / kpis.length);
  const totalCost = kpis.reduce((sum, d) => sum + d.cost, 0);
  const profitMargin = Math.round(((totalRevenue - totalCost) / totalRevenue) * 100);

  const stats = [
    { title: 'Total Revenue', value: `$${(totalRevenue / 1000).toFixed(0)}K`, icon: '💰', color: 'success' as const },
    { title: 'Avg Daily Revenue', value: `$${avgRevenue}`, icon: '📊', color: 'accent' as const },
    { title: 'Total Cost', value: `$${(totalCost / 1000).toFixed(0)}K`, icon: '💸', color: 'warning' as const },
    { title: 'Profit Margin', value: `${profitMargin}%`, icon: '📈', color: 'success' as const },
  ];

  const multiLineData = kpis.map((d) => ({
    date: d.date,
    orders: d.orders,
    revenue: d.revenue,
    cost: d.cost,
    profit: d.revenue - d.cost,
  }));

  const revenueLineData = kpis.map((d, i) => ({ x: i, y: d.revenue }));

  // Create heatmap data from performance
  const heatmapData = performance.slice(0, 20).map((p, idx) => ({
    row: `Metric ${Math.floor(idx / 5) + 1}`,
    column: `Week ${(idx % 5) + 1}`,
    value: p.conversion * 100,
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="section-title">Business Analytics</h1>
        <p className="section-subtitle">Comprehensive business metrics and performance indicators</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <KPICard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart data={revenueLineData} title="Daily Revenue" width={500} height={300} color="var(--accent-success)" />
        <div className="bento-item">
          <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
          <div className="space-y-4">
            {performance.slice(0, 5).map((p, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)] text-sm">Conversion Rate Week {idx + 1}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--chart-1)] to-[var(--chart-2)]"
                      style={{ width: `${p.conversion * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{(p.conversion * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <MultiLineChart
          data={multiLineData}
          keys={['revenue', 'cost', 'profit']}
          title="Financial Performance"
          width={1000}
          height={350}
          colors={['var(--chart-1)', 'var(--chart-3)', 'var(--chart-5)']}
        />
      </div>

      <div>
        <Heatmap
          data={heatmapData}
          title="Conversion Performance Matrix"
          width={1000}
          height={350}
        />
      </div>
    </div>
  );
}
