import { Request, Response, NextFunction } from 'express';

import {
  createUserEvent,
  getUserEvents,
  getUserEventById,
  updateUserEvent,
  deleteUserEvent,
} from '../services/event.service';

import { successResponse } from '../utils/response.js';

export async function createEventController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const event = await createUserEvent(
      req.user!.userId,
      req.body
    );

    return successResponse(
      res,
      'Event created successfully',
      event,
      201
    );
  } catch (error) {
    next(error);
  }
}

export async function getEventsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.userId;

    const events = await getUserEvents(userId);

    return successResponse(
      res,
      'Events fetched successfully',
      events
    );
  } catch (error) {
    next(error);
  }
}

export async function getEventByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const event = await getUserEventById(
      Number(req.params.id),
      req.user!.userId
    );

    return successResponse(
      res,
      'Event retrieved successfully',
      event
    );
  } catch (error) {
    next(error);
  }
}

export async function updateEventController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const event = await updateUserEvent(
      Number(req.params.id),
      req.user!.userId,
      req.body
    );

    return successResponse(
      res,
      'Event updated successfully',
      event
    );
  } catch (error) {
    next(error);
  }
}

export async function deleteEventController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await deleteUserEvent(
      Number(req.params.id),
      req.user!.userId
    );

    return successResponse(
      res,
      'Event deleted successfully',
      null
    );
  } catch (error) {
    next(error);
  }
}
