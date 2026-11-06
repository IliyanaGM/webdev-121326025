# Instructions for the agent

Read this file at the start of every session. Keep it short and correct; update it when the project changes.

## Project
<!-- One or two sentences: what the app does and for whom. Link SPEC.md. -->
Club Events is a web app for a student club: organizers publish events with a limited number of places, and members browse upcoming events, sign up and cancel.
See `SPEC.md` for goals, non-goals and acceptance criteria.

## Commands
- Install: `npm install`
- Run: `npm start` (serves http://localhost:3000; migrations and seed data run at start)
- Test: `npm test` (for now it only runs the exercise 1 MCP server check)
- MCP server: `npm run --silent mcp`

## Conventions
- Server code is in `src/` and goes routes → services → data; SQL lives only in `src/data/`. Pages that need no sign-in are in `public/`; pages behind sign-in are in `src/views/` and served by a route with requireAuth, never from `public/`.
- Business rules (free places, who may see or change what) live only in `src/services/`, which both the HTTP API and the MCP tools call; every schema change is a new numbered file in `migrations/`.
- `src/` uses ES modules; `mcp-server/` is CommonJS and has its own `package.json` for that. Do not change either.
- DATABASE_URL and SESSION_SECRET come from Codespaces secrets: never print, log or hardcode them.
- Do not run `npm start` inside an agent session: the server never exits. Tell me to run it.

## Layers
<!-- Fill in the file or folder for each layer. -->
Requests arrive two ways and both end in the same place:

- HTTP route handler → service → data access → database
- MCP tool → **the same service** → data access → database

A route handler reads the request and turns a result into a status code. A service holds the
rules and knows nothing about HTTP or about MCP. Only the data layer writes SQL. An MCP tool
that talks to the database directly is a second, unguarded way into your data: never add one.

- Routes: `src/routes/`; sign-in check: `src/middleware/requireAuth.js`
- Services: `src/services/`
- Data access: `src/data/` (connection in `src/data/db.js`)
- Schema: `migrations/`

## The model feature
<!-- Provider, env var, and the call site. -->
- The provider is named in exactly one file: `src/services/describe.js` (Gemini, key in `GEMINI_API_KEY`).
- The key comes from an environment variable and is never committed or logged.
- Every call has a timeout and a deterministic fallback, so the app still works when the provider is down or rate-limited.
- The model's output is re-checked against real data before anything is saved or shown.
- Tests never call the provider: they pass in a fake client.

## The MCP server
<!-- Where it lives and how it authenticates. -->
- Lives in `mcp-server/`, grew out of Exercise 1.
- Every tool calls a service function; none touches the data layer or the database directly.
- It carries a user, and enforces exactly the same authorization rules as the HTTP API.
- Adding a tool means adding a row to the table in `SPEC.md` too.

## Tests and coverage
- Every acceptance criterion in `SPEC.md` has an id like `AC-3`, and a test whose title contains that id.
- The coverage gate runs in CI: 100% of the service layer, 80% overall.
- A test is evidence. Changing a test so the code passes destroys the evidence.

## Always ask before
- deleting files or folders
- editing a migration that has already run
- installing or removing dependencies
- pushing, tagging or changing CI
- anything that touches secrets or `.env`
- changing an authentication or authorization rule
- adding, renaming or removing an MCP tool
- changing a coverage threshold
- sending user data to a third-party model

## Never
- commit secrets, passwords, API keys or an OAuth client secret
- weaken or delete a test to make it pass
- lower a coverage threshold or switch off a CI job to make the build green
- add an MCP tool that reaches past the service layer
- log a prompt that contains somebody's personal data