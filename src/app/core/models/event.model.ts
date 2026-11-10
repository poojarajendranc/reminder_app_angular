// Model corresponding to the event
export interface ReminderEvent {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    category: string;
    isReminderEnabled: boolean;
}

export type EventPriority = 'Low' | 'Medium' | 'High';

export interface Event {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  eventDate: string;
  eventTime: string;
  category: string;
  priority: EventPriority;
  reminderEnabled: boolean;
  createdAt: string;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  eventDate: string;
  eventTime: string;
  category: string;
  priority: EventPriority;
  reminderEnabled: boolean;
}

export interface UpdateEventRequest extends CreateEventRequest {}
