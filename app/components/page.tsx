'use client';

import { useState } from 'react';
import { KPICard } from '@/charts/KPICard';
import { LineChart } from '@/charts/LineChart';
import { BarChart } from '@/charts/BarChart';
import { MultiLineChart } from '@/charts/MultiLineChart';
import { Histogram } from '@/charts/Histogram';
import { Heatmap } from '@/charts/Heatmap';

interface ComponentShowcaseProps {
  title: string;
  component: React.ReactNode;
  code: string;
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6 p-4 bg-[var(--bg-tertiary)] rounded-lg overflow-x-auto border border-[var(--border)]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-[var(--text-secondary)]">TSX Code</span>
        <button
          onClick={handleCopy}
          className="btn btn-secondary text-xs py-1 px-2 h-auto"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="text-xs text-[var(--text-secondary)] overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function ComponentCard({ title, component, code }: ComponentShowcaseProps) {
  return (
    <div className="bento-item">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="mb-6 p-4 bg-[var(--bg-tertiary)] rounded-lg min-h-[350px] flex items-center justify-center overflow-x-auto">
        {component}
      </div>
      <CodeBlock code={code} />
    </div>
  );
}

export default function ComponentsPage() {
  const sampleLineData = [
    { x: 0, y: 100 },
    { x: 1, y: 150 },
    { x: 2, y: 120 },
    { x: 3, y: 180 },
    { x: 4, y: 160 },
    { x: 5, y: 200 },
  ];

  const sampleBarData = [
    { label: 'Jan', value: 400 },
    { label: 'Feb', value: 320 },
    { label: 'Mar', value: 480 },
    { label: 'Apr', value: 560 },
    { label: 'May', value: 490 },
  ];

  const sampleMultiLineData = [
    { date: '2025-01-01', revenue: 1000, cost: 600, profit: 400 },
    { date: '2025-01-02', revenue: 1200, cost: 700, profit: 500 },
    { date: '2025-01-03', revenue: 1100, cost: 650, profit: 450 },
    { date: '2025-01-04', revenue: 1400, cost: 800, profit: 600 },
    { date: '2025-01-05', revenue: 1300, cost: 750, profit: 550 },
  ];

  const sampleHistogramData = Array.from({ length: 100 }, () => ({
    value: Math.random() * 100,
  }));

  const sampleHeatmapData = [
    { row: 'A', column: 'X', value: 65 },
    { row: 'A', column: 'Y', value: 75 },
    { row: 'B', column: 'X', value: 85 },
    { row: 'B', column: 'Y', value: 55 },
    { row: 'C', column: 'X', value: 95 },
    { row: 'C', column: 'Y', value: 45 },
  ];

  const components: ComponentShowcaseProps[] = [
    {
      title: 'KPI Card',
      component: (
        <KPICard
          title="Total Revenue"
          value="$2.4M"
          unit="USD"
          change={12.5}
          icon="💰"
          color="success"
        />
      ),
      code: `<KPICard
  title="Total Revenue"
  value="$2.4M"
  unit="USD"
  change={12.5}
  icon="💰"
  color="success"
/>`,
    },
    {
      title: 'Line Chart',
      component: (
        <LineChart
          data={sampleLineData}
          title="Trend"
          width={450}
          height={250}
          color="var(--accent)"
        />
      ),
      code: `<LineChart
  data={[
    { x: 0, y: 100 },
    { x: 1, y: 150 },
    // ... more data points
  ]}
  width={600}
  height={300}
  color="var(--accent)"
/>`,
    },
    {
      title: 'Bar Chart',
      component: (
        <BarChart
          data={sampleBarData}
          title="Sales"
          width={450}
          height={250}
          color="var(--accent-secondary)"
        />
      ),
      code: `<BarChart
  data={[
    { label: 'Jan', value: 400 },
    { label: 'Feb', value: 320 },
    // ... more data
  ]}
  width={600}
  height={300}
/>`,
    },
    {
      title: 'Multi-Line Chart',
      component: (
        <MultiLineChart
          data={sampleMultiLineData}
          keys={['revenue', 'cost', 'profit']}
          width={450}
          height={250}
          colors={['var(--chart-1)', 'var(--chart-2)', 'var(--chart-5)']}
        />
      ),
      code: `<MultiLineChart
  data={[
    { date: '2025-01-01', revenue: 1000, cost: 600 },
    // ... more data
  ]}
  keys={['revenue', 'cost']}
  width={600}
  height={300}
/>`,
    },
    {
      title: 'Histogram',
      component: (
        <Histogram
          data={sampleHistogramData}
          width={450}
          height={250}
          bins={20}
          color="var(--accent)"
        />
      ),
      code: `<Histogram
  data={[
    { value: 45 },
    { value: 52 },
    // ... more data
  ]}
  width={600}
  height={300}
  bins={20}
/>`,
    },
    {
      title: 'Heatmap',
      component: (
        <Heatmap
          data={sampleHeatmapData}
          width={450}
          height={250}
        />
      ),
      code: `<Heatmap
  data={[
    { row: 'A', column: 'X', value: 65 },
    { row: 'B', column: 'Y', value: 85 },
    // ... more data
  ]}
  width={600}
  height={300}
/>`,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="section-title">Component Library</h1>
        <p className="section-subtitle">
          Copy-paste ready D3.js chart components. Simply copy the code and paste into your project.
        </p>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-3">📦 Installation</h3>
        <div className="bg-[var(--bg-tertiary)] rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
          npm install d3
        </div>
        <p className="text-[var(--text-secondary)] text-sm">
          All components require D3.js. Simply import the component from{' '}
          <code className="bg-[var(--bg-tertiary)] px-2 py-1 rounded">@/charts</code> and use it with your data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {components.map((comp, idx) => (
          <ComponentCard key={idx} {...comp} />
        ))}
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
        {[
          {
            icon: '🎨',
            title: 'Themable',
            desc: 'Full dark/light theme support with CSS variables',
          },
          {
            icon: '⚡',
            title: 'Animated',
            desc: 'Smooth animations on load and data changes',
          },
          {
            icon: '📱',
            title: 'Responsive',
            desc: 'Beautiful on all screen sizes',
          },
          {
            icon: '🎯',
            title: 'Accessible',
            desc: 'Built with accessibility in mind',
          },
          {
            icon: '⚙️',
            title: 'Customizable',
            desc: 'Configure colors, sizes, and behavior',
          },
          {
            icon: '🚀',
            title: 'Production Ready',
            desc: 'Used in enterprise applications',
          },
        ].map((feature, idx) => (
          <div key={idx} className="bento-item text-center">
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h3 className="font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-[var(--text-secondary)]">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
