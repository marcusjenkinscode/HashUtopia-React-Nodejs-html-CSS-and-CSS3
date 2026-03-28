import React from 'react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  children: React.ReactNode;
  className?: string;
}

const variants = {
  success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  error: 'bg-red-500/20 text-red-400 border-red-500/30',
  info: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  default: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className = '' }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
    {children}
  </span>
);
