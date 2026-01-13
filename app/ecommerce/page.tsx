import { KPICard } from '@/charts/KPICard';
import { BarChart } from '@/charts/BarChart';
import { LineChart } from '@/charts/LineChart';
import { MultiLineChart } from '@/charts/MultiLineChart';
import ecommerce from '@/data/ecommerce/ecommerce.json';
import kpis from '@/data/analytics/kpis.json';

export default function EcommercePage() {
  // Calculate stats
  const totalOrders = ecommerce.length;
  const deliveredOrders = ecommerce.filter((o) => o.status === 'delivered').length;
  const avgValue = Math.round(ecommerce.reduce((sum, o) => sum + o.value, 0) / ecommerce.length);
  const slaCompliance = Math.round(
    (ecommerce.filter((o) => o.slaHours <= 24).length / ecommerce.length) * 100
  );

  // Orders by hub
  const hubCounts: Record<string, number> = {};
  ecommerce.forEach((o) => {
    hubCounts[o.hub] = (hubCounts[o.hub] || 0) + 1;
  });

  const hubData = Object.entries(hubCounts).map(([label, value]) => ({
    label,
    value,
  }));

  // Order values distribution
  const valueData = ecommerce.map((o) => ({ value: o.value / 100 }));

  const stats = [
    { title: 'Total Orders', value: totalOrders, icon: '📦', color: 'accent' as const },
    { title: 'Delivered', value: deliveredOrders, change: 15.3, icon: '✅', color: 'success' as const },
    { title: 'Avg Order Value', value: `$${avgValue}`, icon: '💵', color: 'warning' as const },
    { title: 'SLA Compliance', value: `${slaCompliance}%`, icon: '⏱️', color: 'accent' as const },
  ];

  const lineData = kpis.map((d, i) => ({ x: i, y: d.orders }));

  const multiLineData = kpis.map((d) => ({
    date: d.date,
    orders: d.orders,
    revenue: d.revenue,
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-[var(--border)] pb-6">
        <h1 className="text-4xl font-black gradient-text mb-2">Fulfillment Center</h1>
        <p className="text-[var(--text-secondary)] text-lg">E-commerce order analytics, hub performance, and SLA tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <KPICard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart data={hubData} title="Orders by Hub" width={500} height={300} color="var(--accent)" />
        <LineChart data={lineData} title="Daily Order Trend" width={500} height={300} color="var(--accent-secondary)" />
      </div>

      <div className="lg:col-span-2">
        <MultiLineChart
          data={multiLineData}
          keys={['orders', 'revenue']}
          title="Orders & Revenue"
          width={1000}
          height={350}
          colors={['var(--chart-1)', 'var(--chart-4)']}
        />
      </div>

      {/* Orders Table */}
      <div className="bento-item overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border)]">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Order ID</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Hub</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Value</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">SLA</th>
            </tr>
          </thead>
          <tbody>
            {ecommerce.slice(0, 10).map((order, idx) => (
              <tr key={idx} className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors">
                <td className="py-3 px-4 font-mono text-xs text-[var(--accent)]">{order.orderId}</td>
                <td className="py-3 px-4">{order.hub}</td>
                <td className="py-3 px-4 font-semibold">${order.value}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    order.status === 'delivered' ? 'bg-[var(--accent-success)]/20 text-[var(--accent-success)]' :
                    order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs">
                  <span className={order.slaHours <= 24 ? 'text-[var(--accent-success)]' : 'text-[var(--accent-warning)]'}>
                    {order.slaHours}h
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
