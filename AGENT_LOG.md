# Agent log

One entry per agent session, newest at the bottom. Be honest: what went wrong is the useful part.

<!-- Copy this block for each session:

## YYYY-MM-DD · <short title>
- Goal:
- Delegated:
- Checkpoints:
- Went wrong:
- Changed by hand:

-->

## 2026-10-22 · Exercise 1: connecting Gemini and the description experiment
- Goal: Connect my MCP server to Gemini CLI and test how the tool description affects tool choice.
- Delegated: Asked "What does lecture 7 cover?" without naming the tool, once with the normal description and once with a vague one.
- Checkpoints: /mcp showed my-project connected with find_lecture and list_files; Gemini called find_lecture(number: 7) and the answer came from my server.
- Went wrong: Login first asked for an API key instead of Google sign-in.
- Changed by hand: Changed the find_lecture description to "A tool about the course." and then restored it.

## 2026-11-05 · Exercise 2: checking AGENTS.md
- Goal: Check that the agent reads AGENTS.md.
- Delegated: Asked it to quote the "Always ask before" list and the commands word for word.
- Checkpoints: Compared the answer with the file.
- Went wrong: Nothing; it listed all nine lines and the three commands correctly.
- Changed by hand: Nothing.

## 2026-11-05 · Exercise 2: first attempt at the slice 1 plan
- Goal: A plan for slice 1.
- Delegated: A plan only, no code.
- Checkpoints: None; it never produced a plan.
- Went wrong: Hit the usage limit on gemini-3.8-flash; switched to gemma-4-31b-it, which ran for 11 minutes with no result.
- Changed by hand: Stopped the session; /stats was not recorded.

## 2026-11-06 · Exercise 2: slice 1 plan and step 1 (database)
- Goal: Plan slice 1, then build the tables with seed data.
- Delegated: The plan, then the migrations, the seed and the server start.
- Checkpoints: Read the plan; read every file before it was written; ran npm start; opened the tables in Neon.
- Went wrong: The plan included tests and in-memory sessions (removed them); it read files it did not need (checks for exercises 3 to 5); it asked to print DATABASE_URL (declined); the codespace has no PostgreSQL; "type": "module" was missing; the seed created a new club and duplicated the events on every start.
- Changed by hand: Moved the database to Neon with DATABASE_URL in Codespaces secrets; added "type": "module" to package.json; added mcp-server/package.json with "type": "commonjs", because "type": "module" broke the exercise 1 MCP server.

## 2026-11-06 · Exercise 2: fixing the duplicated seed
- Goal: Starting the app must not create a new club and new events each time.
- Delegated: Migration 002 with UNIQUE on clubs.name, and a seed.js change.
- Checkpoints: Read both changes before they were written; deleted the duplicate club in Neon; ran npm start twice and checked the tables.
- Went wrong: Nothing; after two starts there is one club and four events.
- Changed by hand: Deleted club 2 (and events 5 to 8) in the Neon SQL Editor.

## 2026-11-06 · Exercise 2: slice 1 step 2, sign-in (first session)
- Goal: The sign-in layers.
- Delegated: userRepository, authService, requireAuth, authRoutes, login.html.
- Checkpoints: Read every file before it was written.
- Went wrong: Gemini froze while choosing an external editor; I closed the terminal; /stats was not recorded.
- Changed by hand: authRoutes.js (401 instead of 400, a generic message for server errors, session.regenerate, only userId in the session); requireAuth.js (req.originalUrl instead of req.path).

## 2026-11-06 · Exercise 2: slice 1 step 2, sign-in (login.html and server.js)
- Goal: The sign-in page, and wiring the sessions and routes into server.js.
- Delegated: login.html with a waiting state and error messages; express-session with connect-pg-simple; /login, /events, /api/auth.
- Checkpoints: Read login.html and server.js before they were written; checked with grep that SESSION_SECRET comes from the environment; curl to /events (302) and /api/auth/me (401); signed in with a wrong and a right password; signed out.
- Went wrong: It tried to run npm test, which only checks the MCP server (declined); its instructions said to set SESSION_SECRET=test-secret in the command instead of using the secrets already in the environment.
- Changed by hand: Nothing in this session.

## 2026-11-06 · Exercise 2: slice 1 step 3, upcoming events list
- Goal: GET /api/events and the /events screen.
- Delegated: Only future events, free places, the page behind requireAuth (not in public/), the four states, the Sign out button.
- Checkpoints: Read the files before they were written; signed in and saw three events without the past one; deleted a row in Neon and it disappeared from the screen; Sign out.
- Went wrong: It tried to run checks/ex3.mjs (exercise 3, declined) and npm start inside the session (declined); eventService returned the free places twice (freePlaces and free_places).
- Changed by hand: Removed free_places; added a redirect to /login on 401 in events.html.