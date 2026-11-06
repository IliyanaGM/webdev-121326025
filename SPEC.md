# Club Events

<!-- Exercise 2. Write the non-goals first. Every acceptance criterion must be checkable in under a minute.
     Keep these headings exactly as they are: the self-checks look for them by name.
     The full target is on the course site under Resources → The course project. -->

## Project option
<!-- One line: lab booking, study groups, club events, or the own project the lecturer approved. -->
Club events.

## Goals
- A member signs in with a password or with Google, browses upcoming events and signs up for or cancels a place.
- An organizer creates and edits events for their club, sets a limit on places and sees who has signed up.
- An event never has more sign-ups than places, even when two members sign up for the last place at the same time.

## Non-goals
- No waiting list: when an event is full, sign-up is closed and nobody is queued for a freed place.
- No email confirmations or reminders: members see their sign-ups on the site.
- No recurring events: each event is created on its own, with one date and time.
- No comments, chat or messages between members.

## Constraints
- Node with Express, PostgreSQL, plain HTML, CSS and JavaScript in the UI.
- Passwords are stored only as a bcrypt hash, never as readable text.
- Secrets (database URL, session secret, API keys, OAuth client secret) live only in Codespaces secrets, never in a committed file.
- Only an organizer of a club can create, edit or see the sign-up list of that club's events.

## The model feature
- Model: Gemini 2.5 Flash, called from `src/services/describe.js` and nowhere else.
- Input: the title, date, place and short notes the organizer types in the event form, and nothing about any member.
- Output: a suggested event description of up to 80 words, placed in the description field for the organizer to edit.
- When it fails: no key, a timeout after 10 seconds, a 429 or an empty answer leave the description field as it was, with the note "No suggestion right now, please write the description yourself". The reply only fills the description; title, date, place and places always come from the form, and nothing is saved until the organizer presses save.

## Auth
- Local: e-mail and password; the password is stored only as a bcrypt hash.
- Provider: Sign in with Google, the authorization-code flow, handled on the server.
- Linking: an account is matched on Google's account id. On a first Google sign-in, it is linked to an existing account only if Google marks the e-mail as verified and it matches; otherwise a new account is created.

## MCP tools
<!-- At least three tools your own MCP server exposes over this project's data.
     Each tool calls the same service functions the HTTP API calls, so the same rules apply.
     A description shorter than 20 characters is not a description. -->
| Tool | What it does | Who may call it |
| --- | --- | --- |
| list_upcoming_events | Lists the events whose date is in the future, with id, title, date, place and free places. Use it to find an event or answer "what is coming up". | Any signed-in member or organizer |
| get_event | Returns one event by its id, with its description, limit of places and number of sign-ups. Use it after you know the id, for the details of one event. | Any signed-in member or organizer |
| list_event_sign_ups | Lists the names of the members signed up for one event by its id. Use it only when an organizer asks who is coming. | Only an organizer of that event's club |

## UI
<!-- Stack, and the three or more screens. The graded checklist lives in docs/UI.md. -->
- Plain HTML, CSS and JavaScript, served by Express; the pages call the REST API with `fetch`.
- Screens: sign in (`/login`); upcoming events list (`/events`); event details with sign up / cancel, and the sign-up list for organizers (`/events/:id`); new and edit event form with the "Suggest description" button (`/events/new`, `/events/:id/edit`).
- The UI is in English and works on a phone-width screen.
- Every screen covers its loading, empty, error and loaded states.

## Architecture
<!-- Exercise 3. One request traced through every layer, naming the file for each one,
     plus one place where your own code does not match this layering. -->

## Acceptance criteria
- [AC-1] A signed-in member who opens `/events` sees only events whose date is in the future, sorted by date, each with its free places.
- [AC-2] A member who presses "Sign up" on an event with free places sees "You are signed up", the free places drop by one, and one new row appears in `sign_ups`.
- [AC-3] A member who tries to sign up for an event with no free places sees "No places left", and no new row appears in `sign_ups`.
- [AC-4] A member who presses "Sign up" twice for the same event still has exactly one row in `sign_ups` for that event.
- [AC-5] A member who presses "Cancel" on their sign-up sees the button change back to "Sign up", and their row is gone from `sign_ups`.
- [AC-6] An organizer who fills in the new event form with a title, date, place and number of places sees the event in `/events`, and one new row appears in `events`.
- [AC-7] An organizer who changes the place of an event and saves sees the new place in `/events`, and the `events` row shows the new place.
- [AC-8] A member who sends `POST /api/events` gets `403`, and no new row appears in `events`.
- [AC-9] An organizer who opens one of their club's events sees the names of the signed-up members; a member who opens the same event does not see that list.
- [AC-10] A member who first registered with a password and later signs in with Google using the same verified e-mail lands in the same account and sees their earlier sign-ups.
- [AC-11] When two `curl` requests for the last free place of an event are sent together in one command, one gets `201` and the other gets `409`, and `sign_ups` holds one new row for that event.
- [AC-12] With `GEMINI_API_KEY` empty, an organizer who presses "Suggest description" sees "No suggestion right now, please write the description yourself", the description field keeps its text, and no row in `events` changes.

### Slice 1: sign-in and the upcoming events list
- [AC-13] A visitor who opens `/events` without signing in is redirected to `/login`.
- [AC-14] A visitor who signs in with a seeded e-mail and a wrong password sees "Wrong e-mail or password" and stays on `/login`.
- [AC-15] After signing in with a seeded account, `/events` shows the seeded future events with their title, date and free places, and does not show the seeded past event.
- [AC-16] After pressing "Sign out", opening `/events` again redirects to `/login`.
- [AC-17] Starting the app twice leaves one row in `clubs` and the seeded events only once in `events`.

## Traceability
<!-- Filled in from Exercise 3 onward: each AC id, and the test that names it. -->
| Criterion | Test |
| --- | --- |
| AC-1 |  |

## Spec vs result
<!-- After the agent builds the slice: which criteria passed, which it missed or reinterpreted, and what you changed in this spec because of it. -->
- Passed: AC-13 (redirect to /login, and 401 for the API), AC-14 (wrong password message), AC-15 (only future events, read from the table; a deleted row disappears), AC-16 (Sign out ends the session).
- Missed: no criterion said what happens on a second start, so the seed created a new club and duplicated the events every time; fixed with migration 002 (unique club name) and a seed that looks the club up by name.
- Interpreted differently: the login answered 400 and showed raw server errors; changed by hand to 401, a generic message for server errors and a new session on sign-in. Opening `/` shows "Cannot GET /", because no criterion covers the root address.
- Changed: added AC-17 about starting the app twice.