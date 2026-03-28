export type CoinSymbol = 'BTC' | 'ETC' | 'XMR' | 'LTC';

export const HASH_UNITS: Record<CoinSymbol, string> = {
  BTC: 'TH/s',
  ETC: 'MH/s',
  XMR: 'kH/s',
  LTC: 'MH/s',
};

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'miner' | 'admin';
  balance: number;
  walletAddress?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export interface UiState {
  theme: 'dark' | 'light';
  modalOpen: string | null;
  sidebarOpen: boolean;
  setTheme: (theme: 'dark' | 'light') => void;
  openModal: (id: string) => void;
  closeModal: () => void;
  toggleSidebar: () => void;
}

export interface MiningRig {
  id: string;
  name: string;
  coin: CoinSymbol;
  hashrate: number;
  status: 'active' | 'idle' | 'error';
  temperature: number;
  efficiency: number;
  earnings24h: number;
}

export interface MiningState {
  rigs: MiningRig[];
  selectedCoin: CoinSymbol;
  totalHashrate: number;
  stats: Record<CoinSymbol, { hashrate: number; blocks: number; earnings: number }>;
  setSelectedCoin: (coin: CoinSymbol) => void;
  updateRig: (id: string, data: Partial<MiningRig>) => void;
  setRigs: (rigs: MiningRig[]) => void;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  userId: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  authorId: string;
  authorRole: 'user' | 'admin';
  content: string;
  createdAt: string;
}

export interface MarketTicker {
  pair: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}

export interface WebSocketEvent {
  type: 'mining:hash' | 'mining:block' | 'market:ticker' | 'system:notification';
  data: Record<string, unknown>;
}
