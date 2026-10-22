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