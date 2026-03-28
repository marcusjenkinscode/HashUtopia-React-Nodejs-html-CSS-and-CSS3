import React, { useEffect, useState } from 'react';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { StatCard } from '../molecules/StatCard';

interface Ticker {
  pair: string;
  price: number;
  change: number;
  volume: string;
}

const INITIAL_TICKERS: Ticker[] = [
  { pair: 'BTC/USD', price: 65432.10, change: 2.4, volume: '1.2B' },
  { pair: 'ETC/USD', price: 32.45, change: -1.2, volume: '45M' },
  { pair: 'XMR/USD', price: 178.90, change: 0.8, volume: '12M' },
  { pair: 'LTC/USD', price: 89.30, change: 3.1, volume: '78M' },
];

export const TradingDashboard: React.FC = () => {
  const [tickers, setTickers] = useState<Ticker[]>(INITIAL_TICKERS);
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setTickers((prev) =>
        prev.map((t) => ({
          ...t,
          price: t.price * (1 + (Math.random() - 0.5) * 0.002),
          change: t.change + (Math.random() - 0.5) * 0.1,
        }))
      );
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-slate-100">Trading Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tickers.map((ticker) => (
          <StatCard
            key={ticker.pair}
            label={ticker.pair}
            value={ticker.price.toFixed(2)}
            unit="USD"
            change={ticker.change}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-sm font-semibold text-slate-400 mb-4">Price Chart (Live)</h3>
            <div className="h-64 flex items-center justify-center text-slate-600 border border-dashed border-white/10 rounded-lg">
              <div className="text-center">
                <div className="text-4xl mb-2">📈</div>
                <p className="text-sm">Live Chart — TradingView Integration</p>
                <p className="text-xs mt-1">Connect via TradingView widget or Lightweight Charts</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-slate-400">Place Order</h3>
          <div className="flex gap-2">
            <Button
              variant={orderType === 'buy' ? 'primary' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => setOrderType('buy')}
            >
              Buy
            </Button>
            <Button
              variant={orderType === 'sell' ? 'danger' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => setOrderType('sell')}
            >
              Sell
            </Button>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Amount (BTC)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Price (USD)</label>
              <input
                type="number"
                defaultValue="65432.10"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
              />
            </div>
            <Button variant={orderType === 'buy' ? 'primary' : 'danger'} className="w-full mt-2">
              {orderType === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
