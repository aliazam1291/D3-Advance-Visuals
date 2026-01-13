import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[var(--bg-primary)]">
      <Sidebar />
      <Topbar />
      <main className="ml-64 mt-16 p-8 min-h-screen">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
