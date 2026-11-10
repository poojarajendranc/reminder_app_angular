import { pool } from "../config/database";
import { CreateEventInput, UpdateEventInput } from "../models/event.model";


export async function createEvent(
  userId: number,
  input: CreateEventInput
) {
  const [result] = await pool.execute(`INSERT INTO events(user_id, title,description,event_date,event_time,category,priority,reminder_enabled) VALUES (?,?,?,?,?,?,?,?)`,
    [userId, input.title, input.description ?? null,
      input.eventDate, input.eventTime, input.category,
      input.priority, input.reminderEnabled
    ]
  )
  return result;

}


export async function findEventsByUser(userId: number) {
  const [rows] = await pool.execute(
    `SELECT
       id,
       user_id AS userId,
       title,
       description,
       event_date AS eventDate,
       event_time AS eventTime,
       category,
       priority,
       reminder_enabled AS reminderEnabled,
       created_at AS createdAt
     FROM events
     WHERE user_id = ?
     ORDER BY event_date ASC, event_time ASC`,
    [userId]
  );

  return rows;
}

export async function findEventById(
  eventId: number,
  userId: number
) {
  const [rows] = await pool.execute(
    `SELECT 
      id,
      user_id AS userId,
      title,
      description,
      event_date AS eventDate,
      event_time AS eventTime,
      category,
      priority,
      reminder_enabled AS reminderEnabled,
      created_at AS createdAt
      FROM events
      WHERE id = ? AND user_id = ?`,
      [eventId, userId]
  );

  return rows;
}

export async function updateEvent(
  eventId: number,
  userId: number,
  input: UpdateEventInput
) {
  const [result] = await pool.execute(
    `UPDATE events
     SET title = ?,
         description = ?,
         event_date = ?,
         event_time = ?,
         category = ?,
         priority = ?,
         reminder_enabled = ?
     WHERE id = ? AND user_id = ?`,
    [
      input.title,
      input.description ?? null,
      input.eventDate,
      input.eventTime,
      input.category,
      input.priority,
      input.reminderEnabled,
      eventId,
      userId,
    ]
  );

  return result;
}

export async function deleteEvent(
  eventId: number,
  userId: number
) {
  const [result] = await pool.execute(
    `DELETE FROM events
     WHERE id = ? AND user_id = ?`,
    [eventId, userId]
  );

  return result;
}
