import { ReactNode } from 'react';

export function Tooltip({ children, content }: { children: ReactNode; content: string }) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="invisible group-hover:visible absolute z-10 w-max px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-secondary)] pointer-events-none">
        {content}
      </div>
    </div>
  );
}
