import { KPICard } from '@/charts/KPICard'
import { RadialGauge } from '@/charts/RadialGauge'
import { BarChart } from '@/charts/BarChart'
import { LineChart } from '@/charts/LineChart'
import { MultiLineChart } from '@/charts/MultiLineChart'
import { Heatmap } from '@/charts/Heatmap'
import leads from '@/data/crm/leads.json'
import pipelineMonthly from '@/data/crm/pipeline_monthly.json'

export default function CRMPage() {
  const totalLeads = leads.length
  const converted = leads.filter((l) => l.converted).length
  const conversionRate = totalLeads ? Math.round((converted / totalLeads) * 100) : 0

  // KPI Data Array (Matching Analytics Style)
  const stats = [
    { title: "Leads", value: totalLeads, icon: "🎯", color: "accent" },
    { title: "Converted", value: converted, icon: "✅", color: "success" },
    { title: "Conversion", value: `${conversionRate}%`, icon: "📈", color: "success" },
    { title: "Sources", value: 8, icon: "🌐", color: "info" },
  ];

  const srcMap: Record<string, number> = {}
  leads.forEach((l) => (srcMap[l.source] = (srcMap[l.source] || 0) + 1))
  const sourceArray = Object.entries(srcMap)
    .map(([k, v]) => ({ label: k, value: v }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  const leadsByDay: Record<string, number> = {}
  leads.forEach((l) => (leadsByDay[l.created_at] = (leadsByDay[l.created_at] || 0) + 1))
  const leadSeries = Object.keys(leadsByDay).sort().map((d) => ({ x: d, y: leadsByDay[d] }))

  const stages = Object.keys(pipelineMonthly[0].byStage)
  const pipelineMulti = pipelineMonthly.map((m) => {
    const o: any = { date: m.month }
    stages.forEach((s) => (o[s] = m.byStage[s]))
    return o
  })

  const pipelineHeatmap = pipelineMulti.flatMap((m) =>
    stages.map((s) => ({ row: s, column: m.date, value: m[s] }))
  )

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">CRM Overview</h1>
        <p className="text-[var(--text-secondary)]">Lead acquisition, conversion rates, and pipeline stages</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <KPICard key={i} {...s} />
        ))}
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bento-item">
          <LineChart data={leadSeries} title="New Leads" />
        </div>

        <div className="bento-item">
          <RadialGauge value={conversionRate} />
        </div>

        <div className="lg:col-span-3 bento-item">
          <MultiLineChart data={pipelineMulti} keys={stages} title="Pipeline by Stage" />
        </div>

        <div className="lg:col-span-2 bento-item">
          <Heatmap data={pipelineHeatmap} />
        </div>

        <div className="bento-item">
          <BarChart data={sourceArray} title="Top Sources" />
        </div>

        <div className="lg:col-span-3 bento-item">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[var(--text-muted)]">
                <tr className="text-left">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Source</th>
                  <th className="pb-3">Value</th>
                  <th className="pb-3">Stage</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 10).map((l) => (
                  <tr key={l.id} className="border-t border-[var(--border)]">
                    <td className="py-3">{l.name}</td>
                    <td className="py-3">{l.source}</td>
                    <td className="py-3">${l.value}</td>
                    <td className="py-3">{l.stage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}