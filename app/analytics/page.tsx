import { KPICard } from "@/charts/KPICard";
import { MultiLineChart } from "@/charts/MultiLineChart";
import { LineChart } from "@/charts/LineChart";
import { Heatmap } from "@/charts/Heatmap";
import analytics from "@/data/analytics/revenue.json";
import traffic from "@/data/analytics/traffic_heatmap.json";

export default function AnalyticsPage() {
  const totalRevenue = analytics.reduce((s, d) => s + d.revenue, 0);
  const totalCost = analytics.reduce((s, d) => s + d.cost, 0);
  const profitMargin = Math.round(((totalRevenue - totalCost) / totalRevenue) * 100);

  const stats = [
    { title: "Revenue", value: `$${(totalRevenue / 1000).toFixed(0)}K`, icon: "💰", color: "success" },
    { title: "Cost", value: `$${(totalCost / 1000).toFixed(0)}K`, icon: "💸", color: "danger" },
    { title: "Margin", value: `${profitMargin}%`, icon: "📈", color: "success" },
    { title: "Days", value: analytics.length, icon: "📅", color: "accent" },
  ];

  const revenueLine = analytics.map((d) => ({ x: d.date, y: d.revenue }));
  const channels = ["online", "retail", "partners"];
  const multiLine = analytics.map((d) => ({ date: d.date, ...d.channels }));

  const heatmap = Object.entries(traffic).flatMap(([date, arr]) =>
    arr.map((v, i) => ({ row: `H${i}`, column: date, value: v }))
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Analytics</h1>
        <p className="text-[var(--text-secondary)]">Revenue, cost, channel performance and traffic</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <KPICard key={i} {...s} />
        ))}
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bento-item">
          <LineChart data={revenueLine} title="Daily Revenue" />
        </div>

        <div className="bento-item">
          <MultiLineChart data={multiLine} keys={channels} title="Revenue Channels" />
        </div>

        <div className="lg:col-span-3 bento-item">
          <Heatmap data={heatmap} />
        </div>
      </div>

      {/* Extra density */}
      <div className="bento-item">
        <MultiLineChart data={multiLine} keys={channels} title="Channel Growth (Detailed View)" />
      </div>
    </div>
  );
}
