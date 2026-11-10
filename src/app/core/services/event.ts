import { Injectable } from '@angular/core';
import { ReminderEvent } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private events: ReminderEvent[] = [
    {
      id: 1,
      title: 'Birthday Celebration',
      description: 'Birthday party',
      date: '2026-11-15',
      time: '18:00',
      category: 'Personal',
      isReminderEnabled: true
    },
    {
      id: 2,
      title: 'Project Review',
      description: 'Review project progress',
      date: '2026-11-10',
      time: '10:00',
      category: 'Work',
      isReminderEnabled: false
    }
  ];

  getEvents(): ReminderEvent[] {
    return this.events;
  }

  toggleReminder(eventId: number): void {
    const event = this.events.find(event => event.id === eventId);
    if (event) {
      event.isReminderEnabled = !event.isReminderEnabled;
    }
  }
}


