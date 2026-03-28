import React, { useState } from 'react';
import { AdminTicketManager } from './AdminTicketManager';
import { StatCard } from '../molecules/StatCard';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';

const MOCK_USERS = [
  { id: '1', username: 'alice', email: 'alice@example.com', role: 'miner', status: 'active', joined: '2026-01-15' },
  { id: '2', username: 'bob', email: 'bob@example.com', role: 'user', status: 'active', joined: '2026-02-20' },
  { id: '3', username: 'charlie', email: 'charlie@example.com', role: 'admin', status: 'active', joined: '2025-12-01' },
];

type AdminTab = 'overview' | 'tickets' | 'users';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-100">Admin Dashboard</h2>
        <Badge variant="warning">Admin</Badge>
      </div>

      <div className="flex gap-2">
        {(['overview', 'tickets', 'users'] as AdminTab[]).map((tab) => (
          <Button key={tab} variant={activeTab === tab ? 'primary' : 'ghost'} size="sm" onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Users" value="1,247" change={5.2} />
            <StatCard label="Active Miners" value="342" change={2.1} />
            <StatCard label="Open Tickets" value="8" />
            <StatCard label="24h Revenue" value="$12,450" change={8.3} />
          </div>
          <Card>
            <h3 className="text-sm font-semibold text-slate-400 mb-3">System Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'API Gateway', status: 'operational' },
                { name: 'Mining Engine', status: 'operational' },
                { name: 'Market Data', status: 'operational' },
                { name: 'Payment Gateway', status: 'degraded' },
                { name: 'WebSocket', status: 'operational' },
                { name: 'Database', status: 'operational' },
              ].map((svc) => (
                <div key={svc.name} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <span className="text-sm text-slate-300">{svc.name}</span>
                  <Badge variant={svc.status === 'operational' ? 'success' : 'warning'}>{svc.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'tickets' && <AdminTicketManager />}

      {activeTab === 'users' && (
        <Card>
          <h3 className="text-sm font-semibold text-slate-400 mb-3">User Management</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-white/10">
                  <th className="pb-2 pr-4">User</th>
                  <th className="pb-2 pr-4">Role</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2 pr-4">Joined</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 last:border-0">
                    <td className="py-3 pr-4">
                      <div className="font-medium text-slate-200">{user.username}</div>
                      <div className="text-xs text-slate-600">{user.email}</div>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={user.role === 'admin' ? 'warning' : user.role === 'miner' ? 'info' : 'default'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant="success">{user.status}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-slate-500">{user.joined}</td>
                    <td className="py-3">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
