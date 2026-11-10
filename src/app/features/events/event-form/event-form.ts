import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { EventService } from '../../../core/services/event.service';
import { CreateEventRequest } from '../../../core/models/event.model';

import { finalize } from 'rxjs';

@Component({
  selector: 'app-event-form',
  imports: [ReactiveFormsModule],
  templateUrl: './event-form.html',
  styleUrl: './event-form.scss',
})
export class EventForm implements OnInit {

  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  eventId: number | null = null;

  isEditMode = false;
  isLoadingEvent = false;
  isSubmitting = false;

  errorMessage = '';

  eventForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
    eventDate: ['', Validators.required],
    eventTime: ['', Validators.required],
    category: ['Personal', Validators.required],
    priority: ['Medium', Validators.required],
    reminderEnabled: [true],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.eventId = Number(id);
      this.isEditMode = true;
      this.loadEvent();
    }
  }

  // Fetch existing event and populate form
  loadEvent(): void {
    if (!this.eventId) return;

    this.isLoadingEvent = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.eventService.getEventById(this.eventId)
      .pipe(
        finalize(() => {
          this.isLoadingEvent = false;
          this.cdr.markForCheck();

        })
      )
      .subscribe({
        next: response => {

          console.log('Full API response:', response);
          console.log('Event data:', response.data);


          const event = response.data;

          this.eventForm.patchValue({
            title: event.title,
            description: event.description ?? '',
            eventDate: event.eventDate?.substring(0, 10),
            eventTime: event.eventTime?.substring(0, 5),


            category: event.category,
            priority: event.priority,
            reminderEnabled:
              event.reminderEnabled });

          console.log('Form values after patch:', this.eventForm.value);

          this.cdr.markForCheck();

        },
        error: error => {
          this.errorMessage =
            error.error?.message ?? 'Failed to load event';
          this.cdr.markForCheck();

        }
      });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const input = this.eventForm.getRawValue() as CreateEventRequest;

    // Choose POST or PUT based on mode
    const request = this.isEditMode && this.eventId
      ? this.eventService.updateEvent(this.eventId, input)
      : this.eventService.createEvent(input);

    request
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/events']);
        },
        error: error => {
          this.errorMessage =
            error.error?.message ?? 'Failed to save event';
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/events']);
  }
}
