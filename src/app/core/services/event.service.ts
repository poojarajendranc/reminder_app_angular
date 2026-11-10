import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environments';

import {
  Event,
  CreateEventRequest,
  UpdateEventRequest,
} from '../models/event.model';

import { ApiResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/events`;

  getEvents(): Observable<ApiResponse<Event[]>> {
    return this.http.get<ApiResponse<Event[]>>(this.apiUrl);
  }

  getEventById(id: number): Observable<ApiResponse<Event>> {
    return this.http.get<ApiResponse<Event>>(`${this.apiUrl}/${id}`);
  }

  createEvent(
    input: CreateEventRequest
  ): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(this.apiUrl, input);
  }

  updateEvent(
    id: number,
    input: UpdateEventRequest
  ): Observable<ApiResponse<Event>> {
    return this.http.put<ApiResponse<Event>>(
      `${this.apiUrl}/${id}`,
      input
    );
  }

  deleteEvent(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}

