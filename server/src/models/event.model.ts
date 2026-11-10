export interface CreateEventInput {
  title: string;
  description?: string;
  eventDate: string;
  eventTime: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  reminderEnabled: boolean;
}

export interface UpdateEventInput extends CreateEventInput {}

export interface Event {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  eventDate: string;
  eventTime: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  reminderEnabled: boolean;
  createdAt: Date;
}
