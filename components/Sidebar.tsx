'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Overview', icon: '📊' },
  { href: '/fleet', label: 'Fleet', icon: '🚗' },
  { href: '/ecommerce', label: 'Fulfillment', icon: '📦' },
  { href: '/analytics', label: 'Analytics', icon: '📈' },
  { href: '/components', label: 'Components', icon: '⚙️' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`glass-dark fixed left-0 top-0 h-screen border-r border-[var(--border)] transition-all duration-300 ${
      collapsed ? 'w-20' : 'w-64'
    } z-40`}>
      {/* Logo */}
      <div className="p-6 border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] via-[var(--accent-secondary)] to-[var(--accent-tertiary)] flex items-center justify-center text-black font-black text-lg shadow-lg">
                D3
              </div>
              <div className="flex flex-col">
                <span className="font-black gradient-text text-lg">Visuals</span>
                <span className="text-xs text-[var(--text-muted)]">Analytics</span>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-[var(--accent)]/10 transition-colors text-[var(--accent)]"
            aria-label="Toggle sidebar"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative group ${
                isActive
                  ? 'bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent-secondary)]/10 border border-[var(--accent)] text-[var(--accent)] shadow-lg shadow-[var(--accent)]/20'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title={collapsed ? item.label : undefined}
            >
              {/* Hover glow */}
              {!isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/0 to-[var(--accent)]/0 group-hover:from-[var(--accent)]/10 group-hover:to-transparent rounded-xl transition-colors duration-300" />
              )}
              <span className="text-xl relative z-10">{item.icon}</span>
              {!collapsed && <span className="font-semibold relative z-10">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="absolute bottom-6 left-4 right-4 p-4 rounded-xl bg-gradient-to-br from-[var(--accent)]/10 to-[var(--accent-secondary)]/5 border border-[var(--accent)]/20 text-xs text-[var(--text-muted)]">
          <p className="font-bold text-[var(--text-secondary)] mb-2 gradient-text">D3 Visuals</p>
          <p className="text-xs leading-relaxed">Enterprise-grade data visualization platform for modern analytics</p>
        </div>
      )}
    </aside>
  );
}
