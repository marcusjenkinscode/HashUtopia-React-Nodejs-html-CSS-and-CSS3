import React, { useEffect, useState } from 'react';
import { useMiningStore } from '../../stores/miningStore';
import { useMiningData } from '../../hooks/useMiningData';
import { CoinSelector } from '../molecules/CoinSelector';
import { HashDisplay } from '../molecules/HashDisplay';
import { StatCard } from '../molecules/StatCard';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { HASH_UNITS } from '../../types';
import type { CoinSymbol } from '../../types';

export const MiningDashboard: React.FC = () => {
  const { selectedCoin, setSelectedCoin, rigs } = useMiningStore();
  const { liveHashrate, liveUnit } = useMiningData();
  const [blockFound, setBlockFound] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.05) {
        setBlockFound(true);
        setTimeout(() => setBlockFound(false), 3000);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-100">Mining Command Center</h2>
        {blockFound && (
          <Badge variant="success">🎉 Block Found!</Badge>
        )}
      </div>

      <CoinSelector selected={selectedCoin} onChange={setSelectedCoin} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Live Hashrate" value={liveHashrate} unit={liveUnit} />
        <StatCard label="Active Rigs" value={rigs.filter((r) => r.status === 'active').length} unit="/ total" />
        <StatCard label="24h Earnings" value="0.0234" unit="BTC" change={2.4} />
        <StatCard label="Network Diff" value="87.4T" change={-0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {rigs.map((rig) => (
          <Card key={rig.id} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">{rig.name}</span>
              <Badge variant={rig.status === 'active' ? 'success' : rig.status === 'error' ? 'error' : 'default'}>
                {rig.status}
              </Badge>
            </div>
            <HashDisplay coin={rig.coin} hashrate={rig.hashrate} animated={rig.status === 'active'} />
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
              <span>Temp: <span className={`font-medium ${rig.temperature > 80 ? 'text-red-400' : 'text-slate-300'}`}>{rig.temperature}°C</span></span>
              <span>Efficiency: <span className="font-medium text-slate-300">{rig.efficiency}%</span></span>
              <span>24h: <span className="font-medium text-emerald-400">+{rig.earnings24h} {rig.coin}</span></span>
            </div>
          </Card>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-400 mb-3">Hash Rate Reference</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.entries(HASH_UNITS) as [CoinSymbol, string][]).map(([coin, unit]) => (
            <Card key={coin} className="text-center py-3">
              <div className="text-lg font-bold text-indigo-400">{coin}</div>
              <div className="text-sm text-slate-400 font-mono">{unit}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
