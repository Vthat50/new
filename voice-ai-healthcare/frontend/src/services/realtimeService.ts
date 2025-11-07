// Simulated WebSocket service for real-time updates

export type RealtimeEventType =
  | 'new_call'
  | 'call_completed'
  | 'patient_updated'
  | 'friction_detected'
  | 'metric_update'
  | 'alert';

export interface RealtimeEvent {
  type: RealtimeEventType;
  timestamp: Date;
  data: any;
}

type EventCallback = (event: RealtimeEvent) => void;

class RealtimeService {
  private subscribers: Map<RealtimeEventType | 'all', Set<EventCallback>> = new Map();
  private intervalId: NodeJS.Timeout | null = null;
  private isActive: boolean = false;

  start() {
    if (this.isActive) return;

    this.isActive = true;
    console.log('[RealtimeService] Started');

    // Simulate events every 5-15 seconds
    this.intervalId = setInterval(() => {
      this.generateRandomEvent();
    }, Math.random() * 10000 + 5000); // 5-15 seconds
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isActive = false;
    console.log('[RealtimeService] Stopped');
  }

  subscribe(eventType: RealtimeEventType | 'all', callback: EventCallback) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    this.subscribers.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(eventType);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  private emit(event: RealtimeEvent) {
    // Notify type-specific subscribers
    const typeSubscribers = this.subscribers.get(event.type);
    if (typeSubscribers) {
      typeSubscribers.forEach(callback => callback(event));
    }

    // Notify 'all' subscribers
    const allSubscribers = this.subscribers.get('all');
    if (allSubscribers) {
      allSubscribers.forEach(callback => callback(event));
    }
  }

  private generateRandomEvent() {
    const eventTypes: RealtimeEventType[] = [
      'new_call',
      'call_completed',
      'patient_updated',
      'friction_detected',
      'metric_update',
    ];

    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

    let event: RealtimeEvent;

    switch (randomType) {
      case 'new_call':
        event = {
          type: 'new_call',
          timestamp: new Date(),
          data: {
            callId: `CALL-${Date.now()}`,
            patientName: this.generateRandomName(),
            direction: Math.random() > 0.5 ? 'inbound' : 'outbound',
            reason: this.getRandomCallReason(),
          }
        };
        break;

      case 'call_completed':
        event = {
          type: 'call_completed',
          timestamp: new Date(),
          data: {
            callId: `CALL-${Date.now() - 300000}`,
            duration: Math.floor(Math.random() * 600 + 120), // 2-12 minutes
            resolution: Math.random() > 0.2 ? 'resolved' : 'escalated',
            sentiment: Math.random() * 0.4 + 0.6, // 0.6 - 1.0
          }
        };
        break;

      case 'patient_updated':
        event = {
          type: 'patient_updated',
          timestamp: new Date(),
          data: {
            patientId: `PAT-${Math.floor(Math.random() * 1000)}`,
            patientName: this.generateRandomName(),
            field: this.getRandomUpdateField(),
            journeyStage: this.getRandomJourneyStage(),
          }
        };
        break;

      case 'friction_detected':
        event = {
          type: 'friction_detected',
          timestamp: new Date(),
          data: {
            topic: this.getRandomFrictionTopic(),
            severity: this.getRandomSeverity(),
            patientId: `PAT-${Math.floor(Math.random() * 1000)}`,
          }
        };
        break;

      case 'metric_update':
        event = {
          type: 'metric_update',
          timestamp: new Date(),
          data: {
            metric: this.getRandomMetric(),
            value: Math.floor(Math.random() * 100),
            change: (Math.random() * 20 - 10).toFixed(1), // -10 to +10
          }
        };
        break;

      default:
        return;
    }

    this.emit(event);
  }

  private generateRandomName(): string {
    const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Lisa', 'Robert', 'Jennifer'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  }

  private getRandomCallReason(): string {
    const reasons = [
      'Refill Request',
      'Side Effects',
      'Insurance Question',
      'Prior Authorization',
      'Financial Assistance',
      'General Question',
      'Shipping Inquiry',
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  private getRandomUpdateField(): string {
    const fields = [
      'adherence_score',
      'journey_stage',
      'contact_preference',
      'insurance_info',
      'sdoh_risk_score',
    ];
    return fields[Math.floor(Math.random() * fields.length)];
  }

  private getRandomJourneyStage(): string {
    const stages = ['Awareness', 'Start', 'Treatment', 'Established', 'At Risk'];
    return stages[Math.floor(Math.random() * stages.length)];
  }

  private getRandomFrictionTopic(): string {
    const topics = [
      'Prior Authorization Delays',
      'High Out-of-Pocket Costs',
      'Insurance Coverage Issues',
      'Injection Site Reactions',
      'Shipping Delays',
    ];
    return topics[Math.floor(Math.random() * topics.length)];
  }

  private getRandomSeverity(): string {
    const severities = ['low', 'medium', 'high', 'critical'];
    const weights = [0.3, 0.4, 0.2, 0.1]; // Lower chance for critical
    const random = Math.random();
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (random <= sum) return severities[i];
    }
    return 'medium';
  }

  private getRandomMetric(): string {
    const metrics = [
      'total_calls',
      'avg_sentiment',
      'first_call_resolution',
      'avg_handle_time',
      'adherence_rate',
    ];
    return metrics[Math.floor(Math.random() * metrics.length)];
  }
}

// Singleton instance
export const realtimeService = new RealtimeService();
