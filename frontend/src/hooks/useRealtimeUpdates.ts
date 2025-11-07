import { useEffect, useState } from 'react';
import { realtimeService, RealtimeEvent, RealtimeEventType } from '../services/realtimeService';

export function useRealtimeUpdates(eventType: RealtimeEventType | 'all' = 'all') {
  const [latestEvent, setLatestEvent] = useState<RealtimeEvent | null>(null);
  const [events, setEvents] = useState<RealtimeEvent[]>([]);

  useEffect(() => {
    const unsubscribe = realtimeService.subscribe(eventType, (event) => {
      setLatestEvent(event);
      setEvents(prev => [event, ...prev].slice(0, 50)); // Keep last 50 events
    });

    return () => {
      unsubscribe();
    };
  }, [eventType]);

  return { latestEvent, events };
}

export function useRealtimeService(enabled: boolean) {
  useEffect(() => {
    if (enabled) {
      realtimeService.start();
    } else {
      realtimeService.stop();
    }

    return () => {
      realtimeService.stop();
    };
  }, [enabled]);
}
