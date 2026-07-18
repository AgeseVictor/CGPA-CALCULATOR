import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  gradient?: boolean;
  style?: React.CSSProperties;
}

export function Card({ children, className = '', interactive, gradient, style }: CardProps) {
  return (
    <div
      className={`glass-card ${interactive ? 'interactive' : ''} ${gradient ? 'card-gradient' : ''} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`card-header ${className}`} style={{ padding: 'var(--space-6)', paddingBottom: 0 }}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`card-body ${className}`} style={{ padding: 'var(--space-6)' }}>
      {children}
    </div>
  );
}
