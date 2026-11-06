# Usage

One row per agent session. In Gemini CLI, type `/stats` before you quit and copy the input and output tokens. Copilot shows credits instead of tokens: write those in the credits column. The free tier charges nothing, so record what the session **would cost at the provider's published list price**, and note once below the table which price list you used. Leave the cost empty for rows that only show credits.

| Date | Tool | Input tokens | Output tokens | Credits (if no tokens) | List-price cost |
|---|---|---|---|---|---|
| 2026-10-22 | Gemini CLI | 26 727 | 84 | | $0.02 |
| 2026-11-05 | Gemini CLI | 14 436 | 180 | | $0.01 |
| 2026-11-05 | Gemini CLI | n/a | n/a | | |
| 2026-11-06 | Gemini CLI | 724 281 | 5 703 | | $0.32 |
| 2026-11-06 | Gemini CLI | 147 654 | 1 446 | | $0.05 |
| 2026-11-06 | Gemini CLI | n/a | n/a | | |
| 2026-11-06 | Gemini CLI | 361 236 | 2 672 | | $0.12 |
| 2026-11-06 | Gemini CLI | 808 136 | 3 629 | | $0.25 |

Prices: Google Gemini API price list (ai.google.dev/gemini-api/docs/pricing), checked 2026-11-06, per 1M tokens: gemini-3.8-flash $0.75 input / $3.75 output, gemini-3.5-flash-lite $0.30 input / $2.50 output. All input tokens are counted at the standard rate, without the cached-input discount.
The two n/a rows are sessions stopped before `/stats` could be recorded. AI Studio's usage page counts by UTC-8 day and only successful requests, so it cannot recover them per session.