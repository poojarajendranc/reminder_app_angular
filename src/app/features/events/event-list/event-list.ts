import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-event-list',
  imports: [DatePipe, RouterLink],
  templateUrl: './event-list.html',
  styleUrl: './event-list.scss',
})
export class EventList implements OnInit {
  private eventService = inject(EventService);
  private cdr = inject(ChangeDetectorRef);

  events: Event[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.eventService.getEvents().subscribe({
      next: (response) => {
        console.log('API response:', response);

        this.events = response.data ?? [];

        console.log('Events assigned:', this.events);

        this.isLoading = false;
        this.cdr.markForCheck();


      },
      error: (error) => {
        console.log("2-----------------")
        this.errorMessage =
          error.error?.message ?? 'Failed to load events';
        this.isLoading = false;
      },
    });
  }

  deleteEvent(eventId: number): void {
    const confirmed = window.confirm(
      'Are you sure you want to delete this event?'
    );

    if (!confirmed) {
      return;
    }

    this.eventService.deleteEvent(eventId).subscribe({
      next: () => {
        this.events = this.events.filter(
          event => event.id !== eventId
        );

        this.cdr.markForCheck();
      },

      error: error => {
        window.alert(
          error.error?.message ?? 'Failed to delete event.'
        );
      }
    });
  }

}
