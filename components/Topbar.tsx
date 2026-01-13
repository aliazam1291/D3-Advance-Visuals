'use client';

import { ThemeSwitcher } from './ThemeSwitcher';

export function Topbar() {
  return (
    <header className="glass-dark fixed top-0 right-0 left-64 border-b h-16 flex items-center justify-between px-8 z-30 transition-all duration-300">
      <div className="flex items-center gap-4 flex-1">
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] flex items-center justify-center text-black font-bold cursor-pointer hover:shadow-lg hover:shadow-[var(--accent)]/50 transition-all">
          A
        </div>
      </div>
    </header>
  );
}
