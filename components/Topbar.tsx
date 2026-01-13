'use client'

import { ThemeSwitcher } from './ThemeSwitcher'
import { useLayout } from './layout/LayoutContext'

export function Topbar() {
  const { collapsed } = useLayout()

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--bg-card)] backdrop-blur px-4 sm:px-6 transition-all duration-300"
      style={{
        marginLeft: collapsed ? '5rem' : '16rem',
      }}
    >
      <div>
        <h1 className="font-semibold text-[var(--text-main)]">Dashboard</h1>
        <p className="text-xs text-[var(--text-muted)]">Welcome back</p>
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <div className="w-9 h-9 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold">
          A
        </div>
      </div>
    </header>
  )
}
