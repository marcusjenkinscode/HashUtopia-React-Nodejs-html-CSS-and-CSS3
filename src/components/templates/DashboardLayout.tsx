import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUiStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../atoms/Button';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/mining', label: 'Mining', icon: '⛏️' },
  { path: '/trading', label: 'Trading', icon: '📈' },
  { path: '/wallet', label: 'Wallet', icon: '💰' },
  { path: '/admin', label: 'Admin', icon: '⚙️' },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { sidebarOpen, toggleSidebar } = useUiStore();
  const { user, logout } = useAuthStore();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a1a]">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b border-white/10 bg-[#0a0a1a]/95 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button onClick={toggleSidebar} className="text-slate-400 hover:text-slate-200 p-1 rounded transition-colors">
            ☰
          </button>
          <Link to="/" className="font-bold text-lg bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            HashUtopia
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 hidden sm:block">{user?.email ?? 'demo@hashutopia.io'}</span>
          <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-52 shrink-0 border-r border-white/10 bg-[#0a0a1a] flex flex-col py-4">
            <nav className="flex flex-col gap-1 px-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200
                    ${location.pathname === item.path
                      ? 'bg-indigo-600/20 text-indigo-400 font-medium'
                      : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}
                  `}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* Footer — z-50, isolation: isolate, AI demo section visible */}
      <footer
        className="relative z-50 border-t border-white/10 bg-[#0a0a1a]"
        style={{ isolation: 'isolate' }}
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          {/* AI Trading Demo Section */}
          <div className="relative z-40 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-indigo-400">AI Trading Agent Demo</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  GPT-4 powered natural language trading strategies • WASM backtesting
                </p>
              </div>
              <Button variant="secondary" size="sm">Try Demo</Button>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>© 2026 HashUtopia v3.0 — Production-Ready React Rebuild</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-slate-400 transition-colors">API</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
