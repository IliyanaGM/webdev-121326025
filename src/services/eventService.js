import { findAllEventsWithSignUps } from '../data/eventRepository.js';

export async function getUpcomingEvents() {
  const rows = await findAllEventsWithSignUps();
  const now = new Date();

  const upcoming = rows
    .filter(row => new Date(row.event_date) > now)
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
    .map(row => {
      const freePlaces = row.capacity - parseInt(row.sign_ups_count || 0, 10);
      return {
        id: row.id,
        title: row.title,
        date: row.event_date,
        place: row.place,
        freePlaces: freePlaces >= 0 ? freePlaces : 0
      };
    });

  return upcoming;
}
