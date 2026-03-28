import React from 'react';
import type { CoinSymbol } from '../../types';
import { HASH_UNITS } from '../../types';

const COINS: CoinSymbol[] = ['BTC', 'ETC', 'XMR', 'LTC'];

const COIN_COLORS: Record<CoinSymbol, string> = {
  BTC: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  ETC: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  XMR: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
  LTC: 'text-slate-300 border-slate-500/30 bg-slate-500/10',
};

interface CoinSelectorProps {
  selected: CoinSymbol;
  onChange: (coin: CoinSymbol) => void;
}

export const CoinSelector: React.FC<CoinSelectorProps> = ({ selected, onChange }) => (
  <div className="flex gap-2 flex-wrap">
    {COINS.map((coin) => (
      <button
        key={coin}
        onClick={() => onChange(coin)}
        className={`
          flex flex-col items-center px-4 py-2 rounded-lg border text-sm font-medium
          transition-all duration-200
          ${selected === coin ? COIN_COLORS[coin] : 'border-white/10 bg-white/5 text-slate-500 hover:text-slate-300'}
        `}
      >
        <span className="font-bold">{coin}</span>
        <span className="text-xs opacity-70">{HASH_UNITS[coin]}</span>
      </button>
    ))}
  </div>
);
