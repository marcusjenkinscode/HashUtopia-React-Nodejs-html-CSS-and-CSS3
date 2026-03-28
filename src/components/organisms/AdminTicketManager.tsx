import React, { useState, useCallback } from 'react';
import DOMPurify from 'dompurify';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import type { SupportTicket } from '../../types';

const MOCK_TICKETS: SupportTicket[] = [
  {
    id: 'T001',
    subject: 'Mining rig not showing correct hashrate',
    status: 'open',
    priority: 'high',
    userId: 'user1',
    createdAt: '2026-03-28T10:00:00Z',
    updatedAt: '2026-03-28T10:00:00Z',
    messages: [
      { id: 'm1', ticketId: 'T001', authorId: 'user1', authorRole: 'user', content: 'My BTC rig shows MH/s instead of TH/s', createdAt: '2026-03-28T10:00:00Z' },
    ],
  },
  {
    id: 'T002',
    subject: 'Cannot withdraw funds',
    status: 'pending',
    priority: 'urgent',
    userId: 'user2',
    createdAt: '2026-03-27T14:00:00Z',
    updatedAt: '2026-03-28T09:00:00Z',
    messages: [
      { id: 'm2', ticketId: 'T002', authorId: 'user2', authorRole: 'user', content: 'Withdrawal button is disabled', createdAt: '2026-03-27T14:00:00Z' },
    ],
  },
  {
    id: 'T003',
    subject: 'Account verification pending',
    status: 'resolved',
    priority: 'medium',
    userId: 'user3',
    createdAt: '2026-03-26T08:00:00Z',
    updatedAt: '2026-03-27T12:00:00Z',
    messages: [],
  },
];

const RichTextEditor: React.FC<{ value: string; onChange: (val: string) => void; placeholder?: string }> = ({
  value,
  onChange,
  placeholder = 'Write your reply...',
}) => {
  const handleFormat = useCallback((tag: string) => {
    const textarea = document.getElementById('reply-textarea') as HTMLTextAreaElement | null;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);
    const newText = value.slice(0, start) + `<${tag}>${selected}</${tag}>` + value.slice(end);
    onChange(newText);
  }, [value, onChange]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 p-1 border border-white/10 rounded-t-lg bg-white/5">
        {['b', 'i', 'u'].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleFormat(tag)}
            className="w-7 h-7 rounded text-xs font-bold text-slate-400 hover:bg-white/10 hover:text-slate-200 transition-colors"
          >
            {tag === 'b' ? 'B' : tag === 'i' ? 'I' : 'U'}
          </button>
        ))}
        <div className="w-px bg-white/10 mx-1" />
        <button
          type="button"
          onClick={() => onChange(value + '\n• ')}
          className="px-2 h-7 rounded text-xs text-slate-400 hover:bg-white/10 hover:text-slate-200 transition-colors"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => onChange(value + '\n> ')}
          className="px-2 h-7 rounded text-xs text-slate-400 hover:bg-white/10 hover:text-slate-200 transition-colors"
        >
          Quote
        </button>
      </div>
      <textarea
        id="reply-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className="w-full rounded-b-lg border border-t-0 border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 resize-none"
      />
      {value.trim() && (
        <div className="text-xs text-slate-500">
          Preview:{' '}
          <span
            className="text-slate-400"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value) }}
          />
        </div>
      )}
    </div>
  );
};

const priorityVariants = {
  low: 'default' as const,
  medium: 'info' as const,
  high: 'warning' as const,
  urgent: 'error' as const,
};

const statusVariants = {
  open: 'error' as const,
  pending: 'warning' as const,
  resolved: 'success' as const,
  closed: 'default' as const,
};

export const AdminTicketManager: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'open' | 'pending' | 'resolved'>('all');

  const filteredTickets = tickets.filter((t) => filter === 'all' || t.status === filter);

  const submitReply = useCallback(async () => {
    if (!selectedTicket || !replyContent.trim()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));

    const newMessage = {
      id: `m${Date.now()}`,
      ticketId: selectedTicket.id,
      authorId: 'admin',
      authorRole: 'admin' as const,
      content: replyContent.trim(),
      createdAt: new Date().toISOString(),
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? { ...t, messages: [...t.messages, newMessage], status: 'pending' as const, updatedAt: new Date().toISOString() }
          : t
      )
    );
    setSelectedTicket((prev) =>
      prev ? { ...prev, messages: [...prev.messages, newMessage] } : null
    );
    setReplyContent('');
    setIsSubmitting(false);
  }, [selectedTicket, replyContent]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-100">Support Ticket Manager</h2>
        <div className="flex items-center gap-2">
          <Badge variant="error">{tickets.filter((t) => t.status === 'open').length} Open</Badge>
          <Badge variant="warning">{tickets.filter((t) => t.status === 'pending').length} Pending</Badge>
        </div>
      </div>

      <div className="flex gap-2">
        {(['all', 'open', 'pending', 'resolved'] as const).map((f) => (
          <Button key={f} variant={filter === f ? 'primary' : 'ghost'} size="sm" onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-slate-400">Tickets ({filteredTickets.length})</h3>
          {filteredTickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => { setSelectedTicket(ticket); setReplyContent(''); }}
              className={`text-left p-3 rounded-lg border transition-all duration-200 ${
                selectedTicket?.id === ticket.id
                  ? 'border-indigo-500/50 bg-indigo-500/10'
                  : 'border-white/5 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-sm font-medium text-slate-200">{ticket.subject}</span>
                <span className="text-xs text-slate-600 shrink-0">{ticket.id}</span>
              </div>
              <div className="flex gap-2">
                <Badge variant={statusVariants[ticket.status]}>{ticket.status}</Badge>
                <Badge variant={priorityVariants[ticket.priority]}>{ticket.priority}</Badge>
              </div>
              <p className="text-xs text-slate-600 mt-1">{ticket.messages.length} message(s)</p>
            </button>
          ))}
          {filteredTickets.length === 0 && (
            <p className="text-sm text-slate-600 text-center py-4">No tickets found</p>
          )}
        </Card>

        {selectedTicket ? (
          <Card className="flex flex-col gap-4">
            <div>
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-semibold text-slate-200">{selectedTicket.subject}</h3>
                <span className="text-xs text-slate-600">{selectedTicket.id}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <Badge variant={statusVariants[selectedTicket.status]}>{selectedTicket.status}</Badge>
                <Badge variant={priorityVariants[selectedTicket.priority]}>{selectedTicket.priority}</Badge>
              </div>
            </div>

            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {selectedTicket.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg text-sm ${
                    msg.authorRole === 'admin'
                      ? 'bg-indigo-500/10 border border-indigo-500/20 ml-4'
                      : 'bg-white/5 border border-white/10 mr-4'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={msg.authorRole === 'admin' ? 'info' : 'default'}>{msg.authorRole}</Badge>
                    <span className="text-xs text-slate-600">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <p
                    className="text-slate-300"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg.content) }}
                  />
                </div>
              ))}
              {selectedTicket.messages.length === 0 && (
                <p className="text-sm text-slate-600 text-center py-2">No messages yet</p>
              )}
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 mb-2">Reply</h4>
              <RichTextEditor
                value={replyContent}
                onChange={setReplyContent}
                placeholder="Write your reply to the user..."
              />
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={() => { void submitReply(); }}
                  disabled={!replyContent.trim()}
                  loading={isSubmitting}
                  className="flex-1"
                >
                  Send Reply
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setReplyContent('')}
                  disabled={isSubmitting}
                >
                  Clear
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="flex items-center justify-center text-slate-600 min-h-48">
            <p>Select a ticket to view and reply</p>
          </Card>
        )}
      </div>
    </div>
  );
};
