import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';
import { DatePipe, SlicePipe } from '@angular/common';
import { Router } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { Event } from '../../core/models/event.model';


interface CalendarDay {
  date: Date;
  dateKey: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
}


@Component({
  selector: 'app-calendar',
  imports: [DatePipe, SlicePipe],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss'
})
export class Calendar implements OnInit {


  private eventService = inject(EventService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);


  events: Event[] = [];


  calendarDays: CalendarDay[] = [];


  selectedDate: string | null = this.formatDate(new Date());


  currentMonth = new Date();


  isLoading = false;
  errorMessage = '';


  ngOnInit(): void {
    this.loadEvents();
  }


  // Fetch events from backend
  loadEvents(): void {
    this.isLoading = true;
    this.errorMessage = '';


    this.eventService.getEvents().subscribe({
      next: response => {
        console.log('Calendar API response:', response.data);
        this.events = response.data;
        this.generateCalendar();

        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: error => {
        this.errorMessage =
          error.error?.message ?? 'Failed to load calendar events';


        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }


  // Generate calendar dates for current month
  generateCalendar(): void {

    console.log('Calendar month:', this.monthTitle);


    console.log(
      'Events:',
      this.events.map(event => ({
        title: event.title,
        eventDate: event.eventDate,
        dateKey: event.eventDate.substring(0, 10)
      }))
    );

    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();


    const firstDay = new Date(year, month, 1);
    const totalDays = new Date(year, month + 1, 0).getDate();


    const startingDay = firstDay.getDay();


    const totalCells =
      startingDay + totalDays <= 35 ? 35 : 42;


    const todayKey = this.formatDate(new Date());


    this.calendarDays = [];


    for (let i = 0; i < totalCells; i++) {


      const date = new Date(
        year,
        month,
        i - startingDay + 1
      );


      const dateKey = this.formatDate(date);


      // const dayEvents = this.events.filter(event =>
      //   event.eventDate.substring(0, 10) === dateKey
      // );



      const dayEvents1 = this.events.filter(event => {
        const eventDate = new Date(event.eventDate);


        const eventDateKey = [
          eventDate.getFullYear(),
          String(eventDate.getMonth() + 1).padStart(2, '0'),
          String(eventDate.getDate()).padStart(2, '0')
        ].join('-');


        return eventDateKey === dateKey;
      });

      const dayEvents = this.events.filter(
        event => event.eventDate.substring(0, 10) === dateKey
      );



      if (dayEvents.length > 0) {
        console.log('Matched calendar date:', dateKey, dayEvents);
      }



      this.calendarDays.push({
        date,
        dateKey,
        dayNumber: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: dateKey === todayKey,
        events: dayEvents
      });
    }
  }


  // Previous month
  previousMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );

    this.selectedDate = null;
    this.generateCalendar();
  }


  // Next month
  nextMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );

    this.selectedDate = null;
    this.generateCalendar();
  }

  // Navigate to current month
  goToToday(): void {
    this.currentMonth = new Date();
    this.selectedDate = this.formatDate(new Date());


    this.generateCalendar();
  }


  // Select calendar date
  selectDate(day: CalendarDay): void {
    this.selectedDate = day.dateKey;
  }


  // Get events belonging to selected date
  // get selectedEvents(): Event[] {
  //   if (!this.selectedDate) {
  //     return [];
  //   }

  //   return this.events.filter(event =>
  //     event.eventDate.substring(0, 10) === this.selectedDate
  //   );
  // }
  get selectedEvents(): Event[] {
    if (!this.selectedDate) {
      return [];
    }


    return this.events.filter(
      event => event.eventDate.substring(0, 10) === this.selectedDate
    );
  }



  // Open Edit Event
  editEvent(eventId: number): void {
    this.router.navigate(['/events/edit', eventId]);
  }


  // Open Create Event
  createEvent(): void {
    this.router.navigate(['/events/create']);
  }


  // Format date as YYYY-MM-DD
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');


    return `${year}-${month}-${day}`;
  }


  // Month heading
  get monthTitle(): string {
    return this.currentMonth.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  }
}
