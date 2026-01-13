import { DashboardLayout } from '@/components/DashboardLayout'
import { PageHeader } from '@/components/PageHeader'
import { KPICard } from '@/charts/KPICard'
import { LineChart } from '@/charts/LineChart'
import { DonutChart } from '@/charts/DonutChart'
import { BarChart } from '@/charts/BarChart'
import { MultiLineChart } from '@/charts/MultiLineChart'
import { Heatmap } from '@/charts/Heatmap'
import socialData from '@/data/social/social_metrics.json'

export default function Page() {
  type Platform = keyof typeof socialData.platforms
  const platforms = Object.keys(socialData.platforms || {}) as Platform[]

  const latest = platforms.map((p) => {
    const arr = socialData.platforms[p]
    const last = arr?.[arr.length - 1] || { followers: 0, reach: 0, engagement: 0 }
    return { platform: p, ...last }
  })

  const totalFollowers = latest.reduce((s, l) => s + l.followers, 0)
  const totalReach = latest.reduce((s, l) => s + l.reach, 0)
  const avgEngagement = Number(
    (latest.reduce((s, l) => s + l.engagement, 0) / Math.max(1, latest.length)).toFixed(2)
  )

  const days = socialData.platforms[platforms[0]] || []

  const growthSeries = days.map((d, i) => {
    let sum = 0
    for (const p of platforms) sum += socialData.platforms[p]?.[i]?.followers || 0
    return { x: d.date, y: sum }
  })

  const engagementSeries = days.map((d, i) => {
    let sum = 0
    for (const p of platforms) sum += socialData.platforms[p]?.[i]?.engagement || 0
    return { x: d.date, y: Number((sum / platforms.length).toFixed(2)) }
  })

  const reachMulti = days.map((d, i) => {
    const row: any = { date: d.date }
    for (const p of platforms) row[p] = socialData.platforms[p]?.[i]?.reach || 0
    return row
  })

  const donutData = latest.map((l) => ({ label: l.platform, value: l.followers }))

  const campaigns = socialData.campaigns || []
  const campaignsBar = campaigns
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10)
    .map((c) => ({ label: c.name, value: c.impressions }))

  const campaignMetrics = ['impressions', 'clicks', 'conversions'] as const
  const campaignsHeatmap = campaigns.slice(0, 20).flatMap((c) =>
    campaignMetrics.map((m) => ({
      row: c.name,
      column: m,
      value: c[m] || 0,
    }))
  )

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <PageHeader title="Social" subtitle="Platform performance & campaign metrics" />

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard title="Followers" value={totalFollowers} />
          <KPICard title="Reach" value={totalReach} />
          <KPICard title="Engagement" value={`${avgEngagement}%`} />
          <KPICard title="Platforms" value={platforms.length} />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bento-item">
            <LineChart data={growthSeries} title="Followers Growth" />
          </div>

          <div className="bento-item">
            <DonutChart data={donutData} />
          </div>

          <div className="lg:col-span-3 bento-item">
            <MultiLineChart data={reachMulti} keys={platforms} title="Reach by Platform" />
          </div>

          <div className="lg:col-span-2 bento-item">
            <LineChart data={engagementSeries} title="Avg Engagement" />
          </div>

          <div className="bento-item">
            <BarChart data={campaignsBar} title="Top Campaigns" />
          </div>

          <div className="lg:col-span-3 bento-item">
            <Heatmap data={campaignsHeatmap} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
