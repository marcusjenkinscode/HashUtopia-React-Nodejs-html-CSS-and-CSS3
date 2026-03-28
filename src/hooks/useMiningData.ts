import { useEffect, useState } from 'react';
import { useMiningStore } from '../stores/miningStore';
import { useWebSocket } from './useWebSocket';
import { HASH_UNITS } from '../types';
import type { CoinSymbol } from '../types';

export function useMiningData() {
  const { selectedCoin, stats, setRigs } = useMiningStore();
  const { on } = useWebSocket();
  const [liveHashrate, setLiveHashrate] = useState<string>('0');
  const [liveUnit, setLiveUnit] = useState<string>(HASH_UNITS[selectedCoin]);

  useEffect(() => {
    const off = on('mining:hash', (data) => {
      const coin = (data.coin as CoinSymbol) ?? selectedCoin;
      setLiveHashrate(String(data.hash ?? '0'));
      setLiveUnit(HASH_UNITS[coin] ?? HASH_UNITS[selectedCoin]);
    });
    return off;
  }, [on, selectedCoin]);

  // Initialize demo rigs
  useEffect(() => {
    setRigs([
      { id: '1', name: 'Rig Alpha', coin: 'BTC', hashrate: 85.3, status: 'active', temperature: 72, efficiency: 95, earnings24h: 0.0012 },
      { id: '2', name: 'Rig Beta', coin: 'ETC', hashrate: 420, status: 'active', temperature: 68, efficiency: 92, earnings24h: 0.85 },
      { id: '3', name: 'Rig Gamma', coin: 'XMR', hashrate: 9800, status: 'idle', temperature: 55, efficiency: 88, earnings24h: 0.42 },
    ]);
  }, [setRigs]);

  return { liveHashrate, liveUnit, stats, selectedCoin };
}
