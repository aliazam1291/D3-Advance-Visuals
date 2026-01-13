'use client';

import { useEffect, useState } from 'react';
import MultiLine from '@/charts/time/MultiLine';
import Histogram from '@/charts/distribution/Histogram';
import Heatmap from '@/charts/distribution/Heatmap';

export default function OpsDashboard() {
  const [opsData, setOpsData] = useState<any>(null);

  useEffect(() => {
    // Load operational data
    Promise.all([
      fetch('/data/metrics.json').then((res) => res.json()),
      fetch('/data/alarms.json').then((res) => res.json()),
      fetch('/data/trips.json').then((res) => res.json()),
    ])
      .then(([metrics, alarms, trips]) => {
        setOpsData({ metrics, alarms, trips });
      })
      .catch((err) => console.error('Failed to load ops data:', err));
  }, []);

  return (
    <div className="dashboard">
      <h1>Operations Dashboard</h1>
      <div className="charts-grid">
        {opsData && (
          <>
            <section className="chart-section">
              <h2>Metrics Timeline</h2>
              <MultiLine data={opsData.metrics || []} />
            </section>
            <section className="chart-section">
              <h2>Alarm Distribution</h2>
              <Histogram data={opsData.alarms || []} />
            </section>
            <section className="chart-section">
              <h2>Trip Heatmap</h2>
              <Heatmap data={opsData.trips || []} />
            </section>
          </>
        )}
      </div>
    </div>
  );
}
