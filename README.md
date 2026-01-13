# D3 Advanced Visuals

> **Enterprise-grade data visualization library** built with D3.js, Next.js, and TypeScript.
> 
> A modern, open-source alternative to Stripe Analytics, Palantir Foundry, and Linear Insights.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/typescript-5.0-blue)
![Next.js](https://img.shields.io/badge/next.js-16.1-black)

---

## 🎯 What This Is

D3 Advanced Visuals is a **production-ready visualization platform** for building modern analytics dashboards. It combines:

- 📊 **Beautiful D3.js Charts** - Line, bar, histogram, heatmap, and more
- 🎨 **Enterprise Design System** - Dark/light themes with glassmorphism
- 🚀 **Copy-Paste Components** - Reusable, themable chart components
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile
- ♿ **Accessible** - Built with WCAG standards in mind
- ⚡ **Blazing Fast** - Optimized with Next.js App Router

---

## ✨ Features

### 🎨 Design System
- **Dark & Light Themes** - Glassmorphism UI with smooth transitions
- **Bento Grid Layouts** - Modern card-based dashboard design
- **Neon Accents** - Glowing elements and smooth gradients
- **Tailwind CSS v4** - Full CSS variable integration

### 📊 Chart Components
- **Line Chart** - Trend visualization with area fills
- **Bar Chart** - Categorical data with animations
- **Multi-Line Chart** - Compare multiple metrics
- **Histogram** - Distribution analysis
- **Heatmap** - 2D data visualization
- **KPI Cards** - Key performance indicators

### 📁 Example Dashboards
- **Overview** - Business metrics and trends
- **Fleet Ops** - Vehicle tracking and health monitoring
- **Fulfillment** - E-commerce order analytics
- **Analytics** - Business performance insights

### 🧩 Component Library
Complete `/components` page with:
- Live component previews
- Copy-paste code snippets
- Feature descriptions
- Usage examples

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/aliazam1291/D3-Advance-Visuals.git
cd d3-advanced-visuals
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

---

## 📖 Usage

### Using Chart Components

#### Line Chart
```tsx
import { LineChart } from '@/charts/LineChart';

export default function MyDashboard() {
  const data = [
    { x: 0, y: 100 },
    { x: 1, y: 150 },
    { x: 2, y: 120 },
  ];

  return (
    <LineChart
      data={data}
      title="Revenue Trend"
      width={600}
      height={300}
      color="var(--accent)"
    />
  );
}
```

#### Bar Chart
```tsx
import { BarChart } from '@/charts/BarChart';

const data = [
  { label: 'January', value: 400 },
  { label: 'February', value: 320 },
  { label: 'March', value: 480 },
];

<BarChart data={data} title="Monthly Sales" width={600} height={300} />
```

#### KPI Card
```tsx
import { KPICard } from '@/charts/KPICard';

<KPICard
  title="Total Revenue"
  value="$2.4M"
  unit="USD"
  change={12.5}
  icon="💰"
  color="success"
/>
```

#### Multi-Line Chart
```tsx
import { MultiLineChart } from '@/charts/MultiLineChart';

const data = [
  { date: '2025-01-01', revenue: 1000, cost: 600, profit: 400 },
  { date: '2025-01-02', revenue: 1200, cost: 700, profit: 500 },
];

<MultiLineChart
  data={data}
  keys={['revenue', 'cost', 'profit']}
  width={800}
  height={400}
/>
```

### Theming

The app automatically supports dark/light themes. Switch themes using the toggle in the top right.

**Custom CSS Variables:**
```css
:root {
  --bg-primary: #0f0f1e;
  --accent: #00d4ff;
  --text-primary: #ffffff;
  /* ... see globals.css for full list */
}

:root.light {
  --bg-primary: #ffffff;
  --accent: #3b82f6;
  --text-primary: #0a0a0a;
}
```

---

## 📊 Component Showcase

Visit `/components` to see all available charts with live previews and copy-paste code.

**Available Components:**
- `KPICard` - Key performance indicators
- `LineChart` - Line chart with gradients
- `BarChart` - Animated bar charts
- `MultiLineChart` - Multi-line comparison
- `Histogram` - Distribution charts
- `Heatmap` - 2D heatmaps

---

## 🏗️ Project Structure

```
d3-advanced-visuals/
├── app/
│   ├── layout.tsx           # Root layout with theme provider
│   ├── page.tsx             # Overview dashboard
│   ├── fleet/page.tsx       # Fleet operations
│   ├── ecommerce/page.tsx   # Fulfillment center
│   ├── analytics/page.tsx   # Business analytics
│   ├── components/page.tsx  # Component showcase
│   └── globals.css          # Theme system
├── charts/
│   ├── KPICard.tsx
│   ├── LineChart.tsx
│   ├── BarChart.tsx
│   ├── MultiLineChart.tsx
│   ├── Histogram.tsx
│   └── Heatmap.tsx
├── components/
│   ├── DashboardLayout.tsx
│   ├── Sidebar.tsx
│   ├── Topbar.tsx
│   ├── ThemeProvider.tsx
│   └── ThemeSwitcher.tsx
├── data/
│   ├── fleet/
│   ├── ecommerce/
│   └── analytics/
├── lib/
│   └── theme.ts            # Theme store (Zustand)
└── package.json
```

---

## 🎨 Design Features

### Dark Theme
- **Black-based background** with subtle gradients
- **Glassmorphism** with blur effects
- **Cyan neon accents** (#00d4ff) with glowing effects
- **Inspired by**: Stripe, Palantir, Vercel

### Light Theme
- **Clean SaaS design** with soft colors
- **Subtle shadows** for depth
- **Blue primary accent** (#3b82f6)
- **Designed for readability** and professional use

### Interactive Elements
- **Hover animations** on charts and cards
- **Smooth theme transitions** (500ms)
- **Responsive grid layouts** (Bento cards)
- **Glassmorphic panels** with backdrop blur

---

## 📱 Responsive Design

All charts and components are fully responsive:
- **Mobile** (< 768px) - Single column layout
- **Tablet** (768px - 1024px) - 2-column layout
- **Desktop** (> 1024px) - Multi-column grids

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16.1 (App Router)
- **Visualization**: D3.js 7.9
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5
- **State Management**: Zustand 5.0
- **Package Manager**: npm/yarn

---

## 📦 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## 🤝 Contributing

This is an open-source project. Contributions welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

This project is free to use for personal and commercial purposes.

---

## 👨‍💻 Author

**Ali Azam Kazmi**
- GitHub: [@aliazam1291](https://github.com/aliazam1291)
- LinkedIn: [Ali Azam Kazmi](https://linkedin.com/in/ali-azam-kazmi)

---

## 🙏 Acknowledgments

- [D3.js](https://d3js.org/) - Data visualization library
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Stripe](https://stripe.com/), [Palantir](https://palantir.com/), [Vercel](https://vercel.com/) - Design inspiration

---

## 📧 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Check existing discussions
- Review the component showcase page

---

## 🗺️ Roadmap

- [ ] Pie/Donut Charts
- [ ] Geographic Maps
- [ ] Network Graphs
- [ ] Real-time Data Streaming
- [ ] Export Charts (SVG/PNG)
- [ ] More theme presets
- [ ] Component storybook
- [ ] API documentation

---

**Made with ❤️ by Ali Azam Kazmi**
