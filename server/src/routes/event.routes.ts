import { Router } from 'express';

import { authMiddleware } from '../middlewares/auth.middleware.js';

import {
  createEventController,
  getEventsController,
  getEventByIdController,
  updateEventController,
  deleteEventController,
} from '../controllers/event.controller.js';

const router = Router();

// All event routes require authentication
router.use(authMiddleware);

router.post('/', createEventController);
router.get('/', getEventsController);
router.get('/:id', getEventByIdController);
router.put('/:id', updateEventController);
router.delete('/:id', deleteEventController);

export default router;
