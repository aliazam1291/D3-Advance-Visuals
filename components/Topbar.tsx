'use client';

import { ThemeSwitcher } from './ThemeSwitcher';

export function Topbar() {
  return (
    <header className="glass-dark fixed top-0 right-0 left-64 border-b h-16 flex items-center justify-between px-8 z-30 transition-all duration-300 backdrop-blur-xl">
      <div className="flex items-center gap-4 flex-1">
        <div>
          <h1 className="text-xl font-bold gradient-text">Dashboard</h1>
          <p className="text-xs text-[var(--text-muted)]">Welcome back, Ali</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)]/50 border border-[var(--border)]">
          <span className="text-xs text-[var(--text-muted)]">Status:</span>
          <span className="inline-block w-2 h-2 rounded-full bg-[var(--accent-success)] animate-pulse"></span>
          <span className="text-xs font-semibold text-[var(--accent-success)]">Live</span>
        </div>
        <ThemeSwitcher />
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent)] via-[var(--accent-secondary)] to-[var(--accent-tertiary)] flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-lg hover:shadow-[var(--accent)]/50 transition-all duration-300 hover:scale-105">
          A
        </div>
      </div>
    </header>
  );
}
