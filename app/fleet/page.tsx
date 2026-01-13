import { KPICard } from '@/charts/KPICard';
import { BarChart } from '@/charts/BarChart';
import { Histogram } from '@/charts/Histogram';
import vehicles from '@/data/fleet/vehicles.json';

export default function FleetPage() {
  // Calculate KPI data
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter((v) => v.status === 'moving').length;
  const avgHealth = Math.round(
    vehicles.reduce((sum, v) => sum + v.health, 0) / vehicles.length
  );
  const avgSpeed = Math.round(
    vehicles.reduce((sum, v) => sum + v.speed, 0) / vehicles.length
  );

  // Group by status
  const statusCounts: Record<string, number> = {};
  vehicles.forEach((v) => {
    statusCounts[v.status] = (statusCounts[v.status] || 0) + 1;
  });

  const statusData = Object.entries(statusCounts).map(([label, value]) => ({
    label: label.charAt(0).toUpperCase() + label.slice(1),
    value,
  }));

  // Speed distribution
  const speedData = vehicles.map((v) => ({ value: v.speed }));

  // Health distribution
  const healthData = vehicles.map((v) => ({ value: v.health }));

  const stats = [
    { title: 'Total Vehicles', value: totalVehicles, icon: '🚗', color: 'accent' as const },
    { title: 'Active Vehicles', value: activeVehicles, change: 5.2, icon: '✅', color: 'success' as const },
    { title: 'Avg. Health', value: `${avgHealth}%`, icon: '❤️', color: 'danger' as const },
    { title: 'Avg. Speed', value: `${avgSpeed} km/h`, icon: '⚡', color: 'warning' as const },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="border-b border-[var(--border)] pb-6">
        <h1 className="text-4xl font-black gradient-text mb-2">Fleet Operations</h1>
        <p className="text-[var(--text-secondary)] text-lg">Real-time fleet monitoring, vehicle tracking, and health analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <KPICard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart data={statusData} title="Vehicles by Status" width={500} height={300} color="var(--accent)" />
        <Histogram data={speedData} title="Speed Distribution" width={500} height={300} color="var(--accent)" bins={15} />
      </div>

      <div>
        <Histogram data={healthData} title="Fleet Health Distribution" width={1000} height={300} color="var(--accent-success)" bins={20} />
      </div>

      {/* Fleet Table */}
      <div className="bento-item overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Active Fleet</h3>
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border)]">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Vehicle ID</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Driver</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Hub</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Speed</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">Health</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.slice(0, 10).map((vehicle, idx) => (
              <tr key={idx} className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors">
                <td className="py-3 px-4 font-mono text-xs text-[var(--accent)]">{vehicle.vehicleId}</td>
                <td className="py-3 px-4">{vehicle.driver}</td>
                <td className="py-3 px-4">{vehicle.hub}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    vehicle.status === 'moving' ? 'bg-[var(--accent-success)]/20 text-[var(--accent-success)]' :
                    vehicle.status === 'idle' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-[var(--accent-danger)]/20 text-[var(--accent-danger)]'
                  }`}>
                    {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4">{vehicle.speed} km/h</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[var(--accent-danger)] to-[var(--accent-success)]"
                        style={{ width: `${vehicle.health}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{vehicle.health}%</span>
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
