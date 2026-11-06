import bcrypt from 'bcryptjs';
import pool from './db.js';

export async function runSeeds() {
  const client = await pool.connect();
  try {
    // Seed club
    await client.query(`
      INSERT INTO clubs (name) VALUES ('Coding Club')
      ON CONFLICT (name) DO NOTHING;
    `);
    
    const clubRes = await client.query('SELECT id FROM clubs WHERE name = $1', ['Coding Club']);
    const clubId = clubRes.rows[0].id;

    // Seed users (organizer and member) with password "Password123!"
    const passwordHash = await bcrypt.hash('Password123!', 10);

    await client.query(`
      INSERT INTO users (email, password_hash, name, role)
      VALUES 
        ('organizer@example.com', $1, 'Alice Organizer', 'organizer'),
        ('member@example.com', $1, 'Bob Member', 'member')
      ON CONFLICT (email) DO NOTHING;
    `, [passwordHash]);

    // Seed events: 3 future events, 1 past event
    const now = new Date();
    const future1 = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const future2 = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    const future3 = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
    const past1 = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

    const eventsCount = await client.query('SELECT COUNT(*) FROM events WHERE club_id = $1', [clubId]);
    if (parseInt(eventsCount.rows[0].count, 10) === 0) {
      await client.query(`
        INSERT INTO events (club_id, title, description, event_date, place, capacity)
        VALUES 
          ($1, 'Node.js Intro Workshop', 'Learn the basics of Node.js and Express.', $2, 'Room 101', 20),
          ($1, 'Advanced Database Design', 'Deep dive into PostgreSQL indexing and schemas.', $3, 'Lab 3', 15),
          ($1, 'Hackathon Kickoff', 'Build amazing apps in 24 hours.', $4, 'Auditorium', 50),
          ($1, 'Past Meetup: Git Basics', 'Introduction to Git and GitHub.', $5, 'Room 102', 30);
      `, [clubId, future1, future2, future3, past1]);
      console.log('Seeded events successfully.');
    }
  } catch (err) {
    console.error('Seeding failed:', err);
    throw err;
  } finally {
    client.release();
  }
}
