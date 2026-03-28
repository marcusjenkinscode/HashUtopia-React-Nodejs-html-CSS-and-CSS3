import React, { useState } from 'react';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'mining' | 'trade';
  amount: number;
  coin: string;
  status: 'confirmed' | 'pending' | 'failed';
  date: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'mining', amount: 0.0023, coin: 'BTC', status: 'confirmed', date: '2026-03-28' },
  { id: '2', type: 'trade', amount: 0.5, coin: 'ETC', status: 'confirmed', date: '2026-03-27' },
  { id: '3', type: 'deposit', amount: 0.01, coin: 'BTC', status: 'pending', date: '2026-03-27' },
  { id: '4', type: 'withdrawal', amount: 100, coin: 'USD', status: 'confirmed', date: '2026-03-26' },
];

export const WalletDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'send' | 'receive'>('overview');

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-slate-100">Wallet</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { coin: 'BTC', balance: '0.2341', usd: '$15,234.12' },
          { coin: 'ETC', balance: '12.45', usd: '$403.97' },
          { coin: 'XMR', balance: '3.2', usd: '$572.48' },
        ].map((wallet) => (
          <Card key={wallet.coin} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg text-indigo-400">{wallet.coin}</span>
              <Badge variant="success">Connected</Badge>
            </div>
            <div className="text-2xl font-bold text-slate-100">{wallet.balance}</div>
            <div className="text-sm text-slate-500">{wallet.usd}</div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex gap-2 mb-4">
          {(['overview', 'send', 'receive'] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-slate-400">Recent Transactions</h3>
            {MOCK_TRANSACTIONS.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {tx.type === 'deposit' ? '⬇️' : tx.type === 'withdrawal' ? '⬆️' : tx.type === 'mining' ? '⛏️' : '🔄'}
                  </span>
                  <div>
                    <div className="text-sm text-slate-300 capitalize">{tx.type}</div>
                    <div className="text-xs text-slate-600">{tx.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${tx.type === 'withdrawal' ? 'text-red-400' : 'text-emerald-400'}`}>
                    {tx.type === 'withdrawal' ? '-' : '+'}{tx.amount} {tx.coin}
                  </span>
                  <Badge variant={tx.status === 'confirmed' ? 'success' : tx.status === 'pending' ? 'warning' : 'error'}>
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'send' && (
          <div className="flex flex-col gap-4 max-w-md">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Recipient Address</label>
              <input className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/30" placeholder="0x..." />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Amount</label>
              <input type="number" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/30" placeholder="0.00" />
            </div>
            <Button variant="primary">Send</Button>
          </div>
        )}

        {activeTab === 'receive' && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg flex items-center justify-center">
                <span className="text-xs text-white font-mono text-center px-1">QR Code</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Your BTC Address</p>
              <p className="text-sm font-mono text-indigo-400 break-all max-w-xs">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</p>
            </div>
            <Button variant="ghost" size="sm">Copy Address</Button>
          </div>
        )}
      </Card>
    </div>
  );
};
