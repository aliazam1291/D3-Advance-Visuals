import { KPICard } from '@/charts/KPICard'
import { LineChart } from '@/charts/LineChart'
import { DonutChart } from '@/charts/DonutChart'
import { BarChart } from '@/charts/BarChart'
import { MultiLineChart } from '@/charts/MultiLineChart'
import { Heatmap } from '@/charts/Heatmap'
import socialData from '@/data/social/social_metrics.json'

export default function SocialPage() {
  type Platform = keyof typeof socialData.platforms
  const platforms = Object.keys(socialData.platforms || {}) as Platform[]

  const latest = platforms.map((p) => {
    const arr = socialData.platforms[p]
    const last = arr?.[arr.length - 1] || { followers: 0, reach: 0, engagement: 0 }
    return { platform: p, ...last }
  })

  const totalFollowers = latest.reduce((s, l) => s + l.followers, 0)
  const totalReach = latest.reduce((s, l) => s + l.reach, 0)
  const avgEngagement = Number((latest.reduce((s, l) => s + l.engagement, 0) / Math.max(1, latest.length)).toFixed(2))

  // KPI Data Array (Matching Analytics Style)
  const stats = [
    { title: "Followers", value: totalFollowers.toLocaleString(), icon: "👥", color: "accent" },
    { title: "Reach", value: totalReach.toLocaleString(), icon: "📣", color: "info" },
    { title: "Engagement", value: `${avgEngagement}%`, icon: "❤️", color: "success" },
    { title: "Platforms", value: platforms.length, icon: "📱", color: "warning" },
  ];

  const days = socialData.platforms[platforms[0]] || []
  const growthSeries = days.map((d, i) => {
    let sum = 0
    for (const p of platforms) sum += socialData.platforms[p]?.[i]?.followers || 0
    return { x: d.date, y: sum }
  })

  const reachMulti = days.map((d, i) => {
    const row: any = { date: d.date }
    for (const p of platforms) row[p] = socialData.platforms[p]?.[i]?.reach || 0
    return row
  })

  const donutData = latest.map((l) => ({ label: l.platform, value: l.followers }))
  const campaignsBar = (socialData.campaigns || [])
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10)
    .map((c) => ({ label: c.name, value: c.impressions }))

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">Social Media</h1>
        <p className="text-[var(--text-secondary)]">Platform growth, audience reach, and campaign impact</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <KPICard key={i} {...s} />
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bento-item">
          <LineChart data={growthSeries} title="Followers Growth" />
        </div>

        
          <DonutChart data={donutData} />
        

        <div className="lg:col-span-3 ">
          <MultiLineChart data={reachMulti} keys={platforms} title="Reach by Platform" />
        </div>

        <div className="lg:col-span-2 ">
          <BarChart data={campaignsBar} title="Top Campaigns" />
        </div>


           {/* You can add a summary or a secondary small chart here */}
           <div className="flex flex-col justify-center h-full text-center p-4">
              <span className="text-4xl mb-2">🚀</span>
              <p className="text-sm text-[var(--text-muted)]">Active campaigns are up 12% this month.</p>
         
        </div>
      </div>
    </div>
  )
}