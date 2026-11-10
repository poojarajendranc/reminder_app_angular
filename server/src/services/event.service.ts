import {
  createEvent,
  findEventsByUser,
  findEventById,
  updateEvent,
  deleteEvent,
} from '../repositories/event.repository.js';

import { CreateEventInput, UpdateEventInput } from '../models/event.model.js';
import { AppError } from '../utils/app-error.js';

function validateEvent(input: CreateEventInput) {
  if (
    !input.title?.trim() ||
    !input.eventDate ||
    !input.eventTime ||
    !input.category?.trim()
  ) {
    throw new AppError(
      'Title, date, time and category are required',
      400
    );
  }

  if (!['Low', 'Medium', 'High'].includes(input.priority)) {
    throw new AppError('Invalid priority', 400);
  }
}

export async function createUserEvent(
  userId: number,
  input: CreateEventInput
) {
  validateEvent(input);

  return createEvent(userId, {
    ...input,
    title: input.title.trim(),
    category: input.category.trim(),
  });
}

export async function getUserEvents(userId: number) {
  return findEventsByUser(userId);
}

export async function getUserEventById(
  eventId: number,
  userId: number
) {
  const event = await findEventById(eventId, userId);

  if (!Array.isArray(event) || event.length === 0) {
    throw new AppError('Event not found', 404);
  }

  return event[0];
}

export async function updateUserEvent(
  eventId: number,
  userId: number,
  input: UpdateEventInput
) {
  validateEvent(input);

  const existingEvent = await findEventById(eventId, userId);

  if (!Array.isArray(existingEvent) || existingEvent.length === 0) {
    throw new AppError('Event not found', 404);
  }

  await updateEvent(eventId, userId, input);

  return getUserEventById(eventId, userId);
}

export async function deleteUserEvent(
  eventId: number,
  userId: number
) {
  const existingEvent = await findEventById(eventId, userId);

  if (!Array.isArray(existingEvent) || existingEvent.length === 0) {
    throw new AppError('Event not found', 404);
  }

  await deleteEvent(eventId, userId);
}
