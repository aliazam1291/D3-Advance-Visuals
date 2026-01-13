'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLayout } from './layout/LayoutContext'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'Overview', icon: '📊' },
  { href: '/fleet', label: 'Fleet', icon: '🚗' },
  { href: '/ecommerce', label: 'Fulfillment', icon: '📦' },
  { href: '/analytics', label: 'Analytics', icon: '📈' },
  
  { href: '/social', label: 'Social', icon: '👥' },
  { href: '/crm', label: 'CRM', icon: '📊' },
  { href: '/components', label: 'Components', icon: '⚙️' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { collapsed, toggle } = useLayout()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          glass-dark fixed top-0 left-0 h-screen z-50
          transition-all duration-300
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          {!collapsed && <span className="font-black gradient-text">D3 Visuals</span>}
          <div className="flex gap-2">
            {/* Collapse button (desktop) */}
            <button
              onClick={toggle}
              className="hidden lg:block p-2 rounded-lg text-[var(--accent)] hover:bg-[var(--accent)]/10"
            >
              {collapsed ? '→' : '←'}
            </button>

            {/* Mobile close */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-2 text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                  isActive
                    ? 'bg-[var(--accent)]/20 text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-30 p-3 rounded-lg bg-[var(--bg-secondary)] lg:hidden"
      >
        ☰
      </button>
    </>
  )
}
