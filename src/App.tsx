import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardLayout } from './components/templates/DashboardLayout';
import { LoginPage } from './features/auth/LoginPage';
import { useAuthStore } from './stores/authStore';

const HomePage = lazy(() => import('./features/dashboard/HomePage').then((m) => ({ default: m.HomePage })));
const MiningPage = lazy(() => import('./features/mining/MiningPage').then((m) => ({ default: m.MiningPage })));
const TradingPage = lazy(() => import('./features/trading/TradingPage').then((m) => ({ default: m.TradingPage })));
const WalletPage = lazy(() => import('./features/wallet/WalletPage').then((m) => ({ default: m.WalletPage })));
const AdminPage = lazy(() => import('./features/admin/AdminPage').then((m) => ({ default: m.AdminPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      retry: 1,
    },
  },
});

const Loading = () => (
  <div className="flex items-center justify-center h-48 text-slate-500">
    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Suspense fallback={<Loading />}>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<HomePage />} />
                      <Route path="/mining" element={<MiningPage />} />
                      <Route path="/trading" element={<TradingPage />} />
                      <Route path="/wallet" element={<WalletPage />} />
                      <Route path="/admin" element={<AdminPage />} />
                    </Routes>
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
