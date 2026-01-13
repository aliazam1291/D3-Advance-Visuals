const fs = require('fs');
const path = require('path');

function randInt(min, max) { return Math.floor(Math.random()*(max-min+1))+min }
function randChoice(arr){ return arr[randInt(0, arr.length-1)] }
function dateNDaysAgo(n){ const d = new Date(); d.setDate(d.getDate()-n); return d.toISOString().slice(0,10) }
function fmtDate(d){ return d.toISOString().slice(0,10) }

const out = (p, obj) => {
  const full = path.join(__dirname, '..', 'data', p);
  const dir = path.dirname(full);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(full, JSON.stringify(obj, null, 2));
}

// Parameters
const DAYS = 120;
const HUB_COUNT = 10;
const VEHICLE_COUNT = 140;
const CAMPAIGNS = 30;

// Hubs
const hubs = Array.from({length:HUB_COUNT}).map((_,i)=>({ id:`hub-${i+1}`, name:`Hub ${i+1}`, lat: 37 + Math.random(), lon: -122 + Math.random() }));

// Fleet: vehicles & trips
const statuses = ['idle','in_transit','charging','maintenance','offline','decommissioned'];
const vehicles = Array.from({length:VEHICLE_COUNT}).map((_,i)=>({
  id: `veh-${1000+i}`,
  vin: `VIN${100000+i}`,
  hub: randChoice(hubs).id,
  status: randChoice(statuses),
  speed_kmh: Number((Math.random()*120).toFixed(1)),
  fuel_pct: randInt(5,100),
  delay_min: randInt(0,240),
  health_score: Number((Math.random()*100).toFixed(0))
}));

const trips = [];
const tripsByDayHub = {}; // for heatmap: date -> hub -> count
for (const v of vehicles){
  const n = randInt(10,60);
  for(let i=0;i<n;i++){
    const startDaysAgo = randInt(1,DAYS);
    const durationH = randInt(1,36);
    const distance = Number((Math.random()*500).toFixed(1));
    const date = dateNDaysAgo(startDaysAgo);
    const hub = randChoice(hubs).id;
    trips.push({
      id:`trip-${v.id}-${i+1}`,
      vehicle_id: v.id,
      date,
      start: date,
      end: date,
      distance_km: distance,
      avg_speed_kmh: Number((distance / Math.max(1,durationH)).toFixed(1)),
      from_hub: hub,
      to_hub: randChoice(hubs).id,
      status: randChoice(['completed','delayed','cancelled','in_progress']),
      delay_min: randInt(0,240)
    });
    tripsByDayHub[date] = tripsByDayHub[date] || {};
    tripsByDayHub[date][hub] = (tripsByDayHub[date][hub] || 0) + 1;
  }
}

// speed distribution histogram
const speedBuckets = Array.from({length:12}).map((_,i)=>({ bucket: `${i*10}-${i*10+9}`, count: 0 }));
for (const t of trips){
  const b = Math.min(11, Math.floor(t.avg_speed_kmh / 10));
  speedBuckets[b].count++;
}

out('fleet/hubs.json', hubs);
out('fleet/vehicles.json', vehicles);
out('fleet/trips.json', trips);
out('fleet/trip_density_by_day_hub.json', tripsByDayHub);
out('fleet/speed_histogram.json', speedBuckets);

// Ecommerce: orders across days with categories and hubs
const categories = ['electronics','home','beauty','fashion','sports','toys','groceries','auto'];
const couriers = ['DHL','UPS','USPS','FastShip','QuickCouriers'];
const orders = [];
const dailySalesByCategory = {}; // date -> {category: revenue}
for (let i=0;i<1200;i++){
  const daysAgo = randInt(0,DAYS-1);
  const date = dateNDaysAgo(daysAgo);
  const category = randChoice(categories);
  const amount = Number((Math.random()*1500 + 5).toFixed(2));
  const hub = randChoice(hubs).id;
  const status = randChoice(['delivered','shipped','returned','processing','cancelled']);
  orders.push({ id:`order-${100000+i}`, date, amount, category, status, hub, courier: randChoice(couriers), refund_amount: 0, sla_breach: Math.random() < 0.08 });
  dailySalesByCategory[date] = dailySalesByCategory[date] || {};
  dailySalesByCategory[date][category] = (dailySalesByCategory[date][category] || 0) + amount;
}

out('ecommerce/orders.json', orders);
out('ecommerce/daily_sales_by_category.json', dailySalesByCategory);

// Analytics: revenue/cost/profit per day (stacked revenue by channel)
const channels = ['online','retail','partners'];
const analytics = [];
const trafficHeatmap = {}; // last 30 days, hours 0-23
for (let d=0; d<DAYS; d++){
  const date = dateNDaysAgo(DAYS - 1 - d);
  const base = Math.round(150000 + Math.random()*600000);
  const channelSplit = {
    online: Math.round(base * (0.45 + Math.random()*0.2)),
    retail: Math.round(base * (0.25 + Math.random()*0.15)),
    partners: Math.round(base * (0.15 + Math.random()*0.1)),
  };
  const revenue = channelSplit.online + channelSplit.retail + channelSplit.partners;
  const cost = Math.round(revenue * (0.45 + Math.random()*0.3));
  const profit = revenue - cost;
  analytics.push({ date, revenue, cost, profit, channels: channelSplit });
  // traffic heatmap for recent 30 days
  if (d < 30){
    const hours = Array.from({length:24}).map(()=> Math.round(100 + Math.random()*2000));
    trafficHeatmap[date] = hours;
  }
}

out('analytics/revenue.json', analytics);
out('analytics/traffic_heatmap.json', trafficHeatmap);

// Social: followers/engagement per platform with campaign list
const platforms = ['instagram','twitter','linkedin'];
const social = { platforms: {}, campaigns: [] };
platforms.forEach(p=>{
  let base = Math.round(20000 + Math.random()*50000);
  social.platforms[p] = Array.from({length:DAYS}).map((_,i)=>{
    // gentle growth + noise with spikes
    base = Math.round(base * (1 + (Math.random()*0.01 - 0.002)));
    if (Math.random() < 0.04) base += Math.round(Math.random()*5000);
    return { date: dateNDaysAgo(DAYS - 1 - i), followers: base, reach: Math.round(2000 + Math.random()*80000), engagement: Number((Math.random()*8).toFixed(2)) };
  });
});
social.campaigns = Array.from({length:CAMPAIGNS}).map((_,i)=>({ id:`camp-${i+1}`, name:`Campaign ${i+1}`, platform: randChoice(platforms), start: dateNDaysAgo(randInt(0,DAYS-30)), end: dateNDaysAgo(randInt(0,10)), impressions: Math.round(Math.random()*800000), clicks: Math.round(Math.random()*100000), conversions: Math.round(Math.random()*10000) }));
out('social/social_metrics.json', social);

// CRM: leads and monthly pipeline revenue
const stages = ['lead','qualified','proposal','negotiation','won','lost'];
const leads = Array.from({length:2000}).map((_,i)=>{
  const created = dateNDaysAgo(randInt(0,DAYS));
  const converted = Math.random() < 0.18;
  return { id:`lead-${30000+i}`, created_at: created, name: `Lead ${i+1}`, source: randChoice(['web','ad','referral','event','email']), stage: randChoice(stages), value: Math.round(Math.random()*50000), converted, conversion_date: converted ? dateNDaysAgo(randInt(0,60)) : null };
});

// monthly pipeline: last 6 months
const months = 6;
const pipelineMonthly = Array.from({length:months}).map((_,i)=>{
  const month = new Date(); month.setMonth(month.getMonth() - (months - 1 - i));
  const monthKey = `${month.getFullYear()}-${String(month.getMonth()+1).padStart(2,'0')}`;
  const byStage = {};
  stages.forEach(s => byStage[s] = Math.round(100 + Math.random()*1000));
  return { month: monthKey, byStage };
});

const pipeline = stages.map(s => ({ stage: s, count: leads.filter(l=>l.stage===s).length }));

out('crm/leads.json', leads);
out('crm/pipeline.json', pipeline);
out('crm/pipeline_monthly.json', pipelineMonthly);

console.log('Generated dense datasets for fleet, ecommerce, analytics, social, crm');
