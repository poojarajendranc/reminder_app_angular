import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import eventRoutes from './routes/event.routes.js';

import {errorMiddleware} from './middlewares/error.middleware.js'

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.get('/api/health',(_req, res) => {
  res.json({
    success: true,
    message: 'Reminder API is running',
  });
});


app.use(errorMiddleware);

export default app;

