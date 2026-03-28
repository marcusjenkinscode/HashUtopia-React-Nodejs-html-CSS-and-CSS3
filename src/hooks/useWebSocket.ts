import { useEffect, useRef, useCallback } from 'react';
import type { WebSocketEvent } from '../types';

type EventHandler = (data: Record<string, unknown>) => void;

const WS_URL: string = import.meta.env.VITE_WS_URL ?? 'http://localhost:3001';

export function useWebSocket() {
  const handlersRef = useRef<Map<string, EventHandler[]>>(new Map());
  const wsRef = useRef<WebSocket | null>(null);
  const wsUrlRef = useRef<string>(WS_URL);

  const on = useCallback((event: string, handler: EventHandler) => {
    const handlers = handlersRef.current.get(event) ?? [];
    handlersRef.current.set(event, [...handlers, handler]);
    return () => {
      const remaining = (handlersRef.current.get(event) ?? []).filter((h) => h !== handler);
      handlersRef.current.set(event, remaining);
    };
  }, []);

  const emit = useCallback((event: string, data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: event, data }));
    }
  }, []);

  useEffect(() => {
    // In demo mode, simulate WebSocket events
    const intervals: ReturnType<typeof setInterval>[] = [];

    const simulateEvent = (type: WebSocketEvent['type'], data: Record<string, unknown>) => {
      const handlers = handlersRef.current.get(type) ?? [];
      handlers.forEach((h) => h(data));
    };

    intervals.push(setInterval(() => {
      simulateEvent('mining:hash', {
        coin: 'BTC',
        hash: (Math.random() * 100 + 50).toFixed(2),
        unit: 'TH/s',
        time: Date.now(),
      });
    }, 1000));

    intervals.push(setInterval(() => {
      simulateEvent('market:ticker', {
        pair: 'BTC/USD',
        price: 65000 + Math.random() * 1000 - 500,
        change: (Math.random() * 6 - 3).toFixed(2),
      });
    }, 500));

    return () => intervals.forEach(clearInterval);
  }, []);

  return { on, emit, wsUrl: wsUrlRef.current };
}
