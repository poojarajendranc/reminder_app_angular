import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { EventService } from '../../core/services/event.service';
import { Event } from '../../core/models/event.model';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private eventService = inject(EventService);
  private cdr = inject(ChangeDetectorRef);

  events: Event[] = [];
  isLoading = true;

  todayCount = 0;
  upcomingCount = 0;
  completedCount = 0;
  totalCount = 0;

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.eventService.getEvents().subscribe({
      next: response => {
        this.events = response.data ?? [];
        this.calculateStats();
        this.isLoading = false;
        // Refresh Dashboard UI
        this.cdr.markForCheck();

      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();

      }
    });
  }

  calculateStats() {
    const today = new Date().toISOString().split('T')[0];

    this.totalCount = this.events.length;

    this.todayCount = this.events.filter(
      event => event.eventDate === today
    ).length;

    this.upcomingCount = this.events.filter(
      event => event.eventDate > today
    ).length;

    this.completedCount = this.events.filter(
      event => event.eventDate < today
    ).length;
  }

  get upcomingEvents(): Event[] {
    const today = new Date().toISOString().split('T')[0];

    return this.events
      .filter(event => event.eventDate >= today)
      .sort((a, b) => {
        const first = `${a.eventDate} ${a.eventTime}`;
        const second = `${b.eventDate} ${b.eventTime}`;

        return first.localeCompare(second);
      })
      .slice(0, 5);
  }
}
