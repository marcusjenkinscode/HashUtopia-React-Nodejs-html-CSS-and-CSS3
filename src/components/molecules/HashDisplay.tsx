import React from 'react';
import { HASH_UNITS } from '../../types';
import type { CoinSymbol } from '../../types';
import { Badge } from '../atoms/Badge';

interface HashDisplayProps {
  coin: CoinSymbol;
  hashrate: number;
  animated?: boolean;
}

export const HashDisplay: React.FC<HashDisplayProps> = ({ coin, hashrate, animated = false }) => {
  const unit = HASH_UNITS[coin];

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-bold text-indigo-400 tabular-nums ${animated ? 'animate-pulse' : ''}`}>
          {hashrate.toFixed(2)}
        </span>
        <span className="text-lg text-slate-400 font-mono">{unit}</span>
      </div>
      <Badge variant="info">{coin} Mining</Badge>
    </div>
  );
};
