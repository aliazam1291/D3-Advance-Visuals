import { KPICard } from '@/charts/KPICard';
import { BarChart } from '@/charts/BarChart';
import { LineChart } from '@/charts/LineChart';
import { MultiLineChart } from '@/charts/MultiLineChart';
import { Heatmap } from '@/charts/Heatmap';
import { Histogram } from '@/charts/Histogram';
import orders from '@/data/ecommerce/orders.json';
import dailySales from '@/data/ecommerce/daily_sales_by_category.json';

export default function EcommercePage() {
  // Calculate stats
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  const avgValue = Math.round(orders.reduce((sum, o) => sum + o.amount, 0) / orders.length);
  const slaCompliance = Math.round((orders.filter((o) => o.status === 'delivered').length / orders.length) * 100);

  // Orders by hub
  const hubCounts: Record<string, number> = {};
  orders.forEach((o) => { hubCounts[o.hub] = (hubCounts[o.hub] || 0) + 1; });
  const hubData = Object.entries(hubCounts).map(([label, value]) => ({ label, value }));


  const stats = [
    { title: 'Total Orders', value: totalOrders, icon: '📦', color: 'accent' as const },
    { title: 'Delivered', value: deliveredOrders, change: 15.3, icon: '✅', color: 'success' as const },
    { title: 'Avg Order Value', value: `$${avgValue}`, icon: '💵', color: 'warning' as const },
    { title: 'SLA Compliance', value: `${slaCompliance}%`, icon: '⏱️', color: 'accent' as const },
  ];

  // daily sales by category -> convert to multi-line (categories as keys)
  const dates = Object.keys(dailySales).sort();
  const dailySalesAny = dailySales as Record<string, Record<string, number>>;
  const categories = Array.from(new Set(dates.flatMap(d => Object.keys(dailySalesAny[d] || {}))));
  const salesMulti = dates.map(date => {
    const row: Record<string, number | string> = { date };
    categories.forEach(c => row[c] = dailySalesAny[date] && dailySalesAny[date][c] ? Math.round(dailySalesAny[date][c]) : 0);
    return row;
  });

  // heatmap: last 30 days x category
  const lastDates = dates.slice(-30);
  const salesHeatmap = lastDates.flatMap(d => categories.map(c => ({ row: c, column: d, value: dailySalesAny[d] && dailySalesAny[d][c] ? Math.round(dailySalesAny[d][c]) : 0 })));

  // total revenue line
  const revenueLine = dates.map(d => ({ x: d, y: categories.reduce((s, c) => s + (dailySalesAny[d][c] || 0), 0) }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-(--border) pb-6">
        <h1 className="text-4xl font-black gradient-text mb-2">Fulfillment Center</h1>
        <p className="text-(--text-secondary) text-lg">E-commerce order analytics, hub performance, and SLA tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <KPICard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart data={hubData} title="Orders by Hub" width={600} height={320} color="var(--accent)" />
        <div>
          <LineChart data={revenueLine} title="Daily Revenue" width={600} height={320} color="var(--accent-secondary)" />
          <div className="mt-6">
            <Histogram data={orders.map(o=>({value:o.amount}))} title="Order value distribution" width={600} height={120} bins={20} />
          </div>
        </div>
      </div>

      <div className="card p-6 mt-6">
        <MultiLineChart data={salesMulti as {date: string; [k:string]: number | string }[]} keys={categories} title="Daily Sales by Category (stacked view: lines)" colors={["var(--chart-1)","var(--chart-2)","var(--chart-3)","var(--chart-4)"]} />
      </div>

      <div className="card p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Sales heatmap (last 30 days)</h3>
        <Heatmap data={salesHeatmap} width={1000} height={360} />
      </div>

      {/* Orders Table */}
      <div className="bento-item overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        <table className="w-full text-sm">
          <thead className="border-b border-(--border)">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-(--text-secondary)">Order ID</th>
              <th className="text-left py-3 px-4 font-semibold text-(--text-secondary)">Hub</th>
              <th className="text-left py-3 px-4 font-semibold text-(--text-secondary)">Value</th>
              <th className="text-left py-3 px-4 font-semibold text-(--text-secondary)">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 10).map((order, idx) => (
              <tr key={idx} className="border-b border-(--border) hover:bg-(--bg-tertiary) transition-colors">
                <td className="py-3 px-4 font-mono text-xs text-(--accent)">{order.id}</td>
                <td className="py-3 px-4">{order.hub}</td>
                <td className="py-3 px-4 font-semibold">${order.amount.toFixed(2)}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    order.status === 'delivered' ? 'bg-(--accent-success)/20 text-(--accent-success)' :
                    order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
