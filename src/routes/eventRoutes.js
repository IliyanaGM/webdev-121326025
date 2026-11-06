import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAuth } from '../middleware/requireAuth.js';
import { getUpcomingEvents } from '../services/eventService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/api/events', requireAuth, async (req, res) => {
  try {
    const events = await getUpcomingEvents();
    res.json({ events });
  } catch (err) {
    console.error('Failed to fetch events:', err);
    res.status(500).json({ error: 'Server error, please try again' });
  }
});

router.get('/events', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/events.html'));
});

export default router;
