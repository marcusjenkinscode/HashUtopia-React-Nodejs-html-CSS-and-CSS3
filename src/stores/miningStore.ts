import { create } from 'zustand';
import type { MiningState, MiningRig, CoinSymbol } from '../types';

export const useMiningStore = create<MiningState>((set) => ({
  rigs: [],
  selectedCoin: 'BTC',
  totalHashrate: 0,
  stats: {
    BTC: { hashrate: 0, blocks: 0, earnings: 0 },
    ETC: { hashrate: 0, blocks: 0, earnings: 0 },
    XMR: { hashrate: 0, blocks: 0, earnings: 0 },
    LTC: { hashrate: 0, blocks: 0, earnings: 0 },
  },
  setSelectedCoin: (coin: CoinSymbol) => set({ selectedCoin: coin }),
  updateRig: (id: string, data: Partial<MiningRig>) =>
    set((s) => ({
      rigs: s.rigs.map((r) => (r.id === id ? { ...r, ...data } : r)),
    })),
  setRigs: (rigs: MiningRig[]) => set({ rigs }),
}));
