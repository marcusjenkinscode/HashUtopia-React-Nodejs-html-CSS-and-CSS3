import React from 'react';
import { Card } from '../atoms/Card';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, unit, change, icon }) => (
  <Card className="flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</span>
      {icon && <span className="text-indigo-400">{icon}</span>}
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold text-slate-100">{value}</span>
      {unit && <span className="text-sm text-slate-500">{unit}</span>}
    </div>
    {change !== undefined && (
      <span className={`text-xs font-medium ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
        {change >= 0 ? '+' : ''}{change.toFixed(2)}%
      </span>
    )}
  </Card>
);
