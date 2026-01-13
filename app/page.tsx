import { KPICard } from '@/charts/KPICard';
import { LineChart } from '@/charts/LineChart';
import { BarChart } from '@/charts/BarChart';
import { MultiLineChart } from '@/charts/MultiLineChart';
import analyticsKPIs from '@/data/analytics/kpis.json';

export default function Home() {
  const stats = [
    { title: 'Total Orders', value: '12,543', unit: 'orders', change: 12.5, icon: '📦', color: 'accent' as const },
    { title: 'Revenue', value: '$2.4M', unit: 'USD', change: 8.2, icon: '💰', color: 'success' as const },
    { title: 'Conversion Rate', value: '3.24%', change: 2.1, icon: '📈', color: 'warning' as const },
    { title: 'Avg. Order Value', value: '$192', unit: 'USD', change: -1.5, icon: '🛒', color: 'accent' as const },
  ];

  const lineData = analyticsKPIs.map((d, i) => ({ x: i, y: d.revenue }));

  const barData = analyticsKPIs.map((d) => ({
    label: d.date.slice(5),
    value: d.orders,
  }));

  const multiLineData = analyticsKPIs.map((d) => ({
    date: d.date,
    revenue: d.revenue,
    cost: d.cost,
    profit: d.revenue - d.cost,
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="section-title">Welcome back, Ali 👋</h1>
        <p className="section-subtitle">Here's what's happening with your business today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <KPICard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart data={lineData} title="Revenue Trend" width={500} height={300} />
        <BarChart data={barData} title="Daily Orders" width={500} height={300} />
      </div>

      <div className="lg:col-span-2">
        <MultiLineChart
          data={multiLineData}
          keys={['revenue', 'cost', 'profit']}
          title="Financial Overview"
          width={1000}
          height={350}
          colors={['var(--chart-1)', 'var(--chart-2)', 'var(--chart-5)']}
        />
      </div>
    </div>
  );
}
