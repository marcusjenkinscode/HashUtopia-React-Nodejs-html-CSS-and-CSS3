import React from 'react';
import { StatCard } from '../../components/molecules/StatCard';
import { Card } from '../../components/atoms/Card';
import { Badge } from '../../components/atoms/Badge';
import { useMiningStore } from '../../stores/miningStore';

export const HomePage: React.FC = () => {
  const { rigs } = useMiningStore();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Welcome to HashUtopia v3.0</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Balance" value="$16,210" change={3.2} />
        <StatCard label="Mining Earnings" value="0.023 BTC" change={1.8} />
        <StatCard label="Active Rigs" value={rigs.filter((r) => r.status === 'active').length} />
        <StatCard label="Open Tickets" value="2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-400 mb-4">System Architecture</h3>
          <div className="font-mono text-xs text-slate-500 leading-relaxed whitespace-pre overflow-x-auto">
{`PRESENTATION  → React 18 + TypeScript + Vite
STATE         → Zustand (client) + React Query (server)
REAL-TIME     → Socket.io (WebSocket)
3D VIZ        → React Three Fiber + Three.js
DATA          → PostgreSQL + Redis + Blockchain Nodes
SECURITY      → JWT + MFA + RBAC + AES-256`}
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-slate-400 mb-3">10 Wow Features</h3>
          <div className="flex flex-col gap-1.5">
            {[
              '3D Mining Visualization',
              'AI Trading Agent',
              'Mining Command Center',
              'Gamified Mining (NFTs)',
              'Predictive Analytics',
              'DeFi Connectivity',
              'Native PWA',
              'Personalization',
              'Social Network',
              'Security Center',
            ].map((f, i) => (
              <div key={f} className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-indigo-500 font-bold w-4">{i + 1}.</span>
                {f}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-sm font-semibold text-slate-400 mb-3">Performance Targets</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { metric: 'FCP', target: '<1.0s' },
            { metric: 'TTI', target: '<2.5s' },
            { metric: 'CLS', target: '<0.05' },
            { metric: '3D FPS', target: '60fps' },
            { metric: 'WS Latency', target: '<50ms' },
            { metric: 'Bundle', target: '<200KB' },
          ].map((p) => (
            <div key={p.metric} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
              <span className="text-xs text-slate-500">{p.metric}</span>
              <Badge variant="success">{p.target}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
