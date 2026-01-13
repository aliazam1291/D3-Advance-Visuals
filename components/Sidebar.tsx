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
    <aside className={`glass-dark fixed left-0 top-0 h-screen border-r transition-all duration-300 ${
      collapsed ? 'w-20' : 'w-64'
    } z-40`}>
      {/* Logo */}
      <div className="p-6 border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] flex items-center justify-center text-black font-bold text-sm">
                D3
              </div>
              <span className="font-bold gradient-text">Visuals</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
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
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-[var(--accent)]/20 border border-[var(--accent)] text-[var(--accent)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span className="text-xl">{item.icon}</span>
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="absolute bottom-6 left-4 right-4 p-4 rounded-lg bg-[var(--bg-tertiary)]/50 border border-[var(--border)] text-xs text-[var(--text-muted)]">
          <p className="font-semibold text-[var(--text-secondary)] mb-2">D3 Advanced Visuals</p>
          <p>Enterprise-grade data visualization library</p>
        </div>
      )}
    </aside>
  );
}
