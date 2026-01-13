import { ReactNode } from 'react';

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 transition-all duration-300 hover:border-[var(--accent)] ${
        className || ''
      }`}
    >
      {children}
    </div>
  );
}
