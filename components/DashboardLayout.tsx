'use client'
import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { LayoutProvider, useLayout } from './layout/LayoutContext'

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <LayoutProvider>
      <DashboardShell>{children}</DashboardShell>
    </LayoutProvider>
  )
}

function DashboardShell({ children }: { children: ReactNode }) {
  const { collapsed } = useLayout()

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">

      <Sidebar />

      <div
        className="flex flex-col flex-1 transition-all duration-300"
        style={{
          marginLeft: collapsed ? '5rem' : '16rem', // 80px or 256px
        }}
      >
        <Topbar />

        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  )
}
