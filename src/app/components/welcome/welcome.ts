import { Component, inject } from '@angular/core';
import { ReminderEvent } from '../../core/models/event.model';
import { EventService } from '../../core/services/event';

@Component({
  imports: [],
  selector: 'app-welcome',
  styleUrl: './welcome.scss',
  templateUrl: './welcome.html',
})
export class Welcome {
  isReminderEnabled = true;

  private eventService = inject(EventService);

  events: ReminderEvent[] = [];

  // constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.events = this.eventService.getEvents()
  }

  toggleReminder(eventId: number): void {
    this.eventService.toggleReminder(eventId)
  }

  onKeyUp(newTitle: string): void {

   
  }

}
