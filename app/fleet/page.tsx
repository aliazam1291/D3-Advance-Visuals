import { KPICard } from '@/charts/KPICard';
import { BarChart } from '@/charts/BarChart';
import { Histogram } from '@/charts/Histogram';
import { MultiLineChart } from '@/charts/MultiLineChart';
import { LineChart } from '@/charts/LineChart';
import { Heatmap } from '@/charts/Heatmap';
import vehicles from '@/data/fleet/vehicles.json';
import trips from '@/data/fleet/trips.json';
import tripDensity from '@/data/fleet/trip_density_by_day_hub.json';

export default function FleetPage() {
  // Calculate KPI data
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter((v) => ['in_transit','in_transit','moving','in_transit'].includes(v.status)).length;
  const avgHealth = Math.round(
    vehicles.reduce((sum, v) => sum + (v.health_score ?? 0), 0) / vehicles.length
  );
  const avgSpeed = Math.round(
    vehicles.reduce((sum, v) => sum + (v.speed_kmh ?? 0), 0) / vehicles.length
  );

  // Group by status
  const statusCounts: Record<string, number> = {};
  vehicles.forEach((v) => { statusCounts[v.status] = (statusCounts[v.status] || 0) + 1; });
  const statusData = Object.entries(statusCounts).map(([label, value]) => ({ label: label.charAt(0).toUpperCase() + label.slice(1), value }));

  // Speed distribution
  const speedData = vehicles.map((v) => ({ value: v.speed_kmh ?? 0 }));

  // Health distribution
  const healthData = vehicles.map((v) => ({ value: v.health_score ?? 0 }));

  // Trips per day (line)
  const tripsByDay: Record<string, number> = {};
  trips.forEach((t: { date: string }) => { tripsByDay[t.date] = (tripsByDay[t.date] || 0) + 1; });
  const tripsSeries = Object.keys(tripsByDay).sort().map(d => ({ x: d, y: tripsByDay[d] }));

  // Top hubs (by total trips)
  const hubCounts: Record<string, number> = {};
  trips.forEach((t: { from_hub: string; to_hub: string }) => { hubCounts[t.from_hub] = (hubCounts[t.from_hub] || 0) + 1; hubCounts[t.to_hub] = (hubCounts[t.to_hub] || 0) + 1; });
  const topHubs = Object.entries(hubCounts).sort((a,b)=>b[1]-a[1]).slice(0,4).map(e=>e[0]);
  // prepare multi-line: rows are last dates
  const dates = Array.from(new Set(trips.map((t:{date:string})=>t.date))).sort();
  const hubMulti = dates.map(date => {
    const row: Record<string, number | string> = { date };
    const td = (tripDensity as Record<string, Record<string, number>>)[date] || {};
    topHubs.forEach(h => row[h] = td[h] || 0);
    return row;
  });

  // Heatmap data from tripDensity (limit to last 30 days and top hubs)
  const lastDates = dates.slice(-30);
  const heatmapData = lastDates.flatMap(d => {
    const td = (tripDensity as Record<string, Record<string, number>>)[d] || {};
    return topHubs.map(h => ({ row: h, column: d, value: td[h] || 0 }));
  });

  const stats = [
    { title: 'Total Vehicles', value: totalVehicles, icon: '🚗', color: 'accent' as const },
    { title: 'Active Vehicles', value: activeVehicles, change: 5.2, icon: '✅', color: 'success' as const },
    { title: 'Avg. Health', value: `${avgHealth}%`, icon: '❤️', color: 'danger' as const },
    { title: 'Avg. Speed', value: `${avgSpeed} km/h`, icon: '⚡', color: 'warning' as const },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-(--border) pb-6">
        <h1 className="text-4xl font-black gradient-text mb-2">Fleet Operations</h1>
        <p className="text-(--text-secondary) text-lg">Real-time fleet monitoring, vehicle tracking, and health analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <KPICard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart data={statusData} title="Vehicles by Status" width={600} height={320} color="var(--accent)" />
        <Histogram data={speedData} title="Speed Distribution" width={600} height={320} color="var(--accent)" bins={15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="card p-6">
          <LineChart data={tripsSeries} title="Trips per day (last 120 days)" />
        </div>
        <div className="card p-6">
          <MultiLineChart data={hubMulti as { date: string; [k: string]: number | string }[]} keys={topHubs} title="Top hub trip counts" />
        </div>
      </div>

      <div className="card p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Trip density (last 30 days)</h3>
        <Heatmap data={heatmapData} width={1000} height={360} />
      </div>

      <div>
        <Histogram data={healthData} title="Fleet Health Distribution" width={1000} height={300} color="var(--accent-success)" bins={20} />
      </div>

      {/* Fleet Table */}
      <div className="bento-item overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Active Fleet</h3>
        <table className="w-full text-sm">
          <thead className="border-b border-(--border)">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-(--text-secondary)">Vehicle ID</th>
              <th className="text-left py-3 px-4 font-semibold text-(--text-secondary)">Hub</th>
              <th className="text-left py-3 px-4 font-semibold text-(--text-secondary)">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-(--text-secondary)">Speed</th>
              <th className="text-left py-3 px-4 font-semibold text-(--text-secondary)">Health</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.slice(0, 10).map((vehicle, idx) => (
              <tr key={idx} className="border-b border-(--border) hover:bg-(--bg-tertiary) transition-colors">
                <td className="py-3 px-4 font-mono text-xs text-(--accent)">{vehicle.id}</td>
                <td className="py-3 px-4">{vehicle.hub}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    vehicle.status === 'in_transit' ? 'bg-(--accent-success)/20 text-(--accent-success)' :
                    vehicle.status === 'idle' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-(--accent-danger)/20 text-(--accent-danger)'
                  }`}>
                    {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4">{vehicle.speed_kmh} km/h</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-(--bg-tertiary) rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-(--accent-danger) to-(--accent-success)"
                        style={{ width: `${vehicle.health_score}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{vehicle.health_score}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
