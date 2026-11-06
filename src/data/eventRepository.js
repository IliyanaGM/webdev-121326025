import pool from './db.js';

export async function findAllEventsWithSignUps() {
  const query = `
    SELECT 
      e.id, 
      e.title, 
      e.description,
      e.event_date, 
      e.place, 
      e.capacity,
      e.club_id,
      COUNT(s.id) AS sign_ups_count
    FROM events e
    LEFT JOIN sign_ups s ON e.id = s.event_id
    GROUP BY e.id
    ORDER BY e.event_date ASC;
  `;
  const result = await pool.query(query);
  return result.rows;
}
