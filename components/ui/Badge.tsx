import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'accent' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`stat-pill ${variant} ${className}`.trim()}>
      {children}
    </span>
  );
}
