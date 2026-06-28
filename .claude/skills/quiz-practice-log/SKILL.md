---
name: quiz-practice-log
description: Record a quiz practice session for this project's quiz site. Use when the user says they practiced/went through/studied/reviewed/did a quiz — e.g. "I practiced the Kubernetes architecture quiz today at 11am", "log that I went through Pods yesterday", "record a practice of Self-Attention". Increments that quiz's practice counter and stores the date and time. Confirms with the user when the quiz can't be confidently identified.
---

# Quiz Practice Log

Records how many times the user has practiced each quiz, plus the date and
time of every session. The data lives in `quizzes/_practice-log.js` and is
shown on each topic card by the site engine (`app.js`).

## Data format

`quizzes/_practice-log.js` sets one global object, keyed by
`"<collection>/<topic-key>"`:

```js
window.__practiceLog = {
  "kubernetes/cluster-architecture": {
    count: 2,
    sessions: [
      { date: "2026-06-27", time: "11:00" },
      { date: "2026-06-28", time: "09:30" }
    ]
  }
};
```

Invariants you must preserve:

- `count` always equals `sessions.length`.
- `date` is ISO `YYYY-MM-DD`; `time` is 24-hour `HH:MM`.
- Keys are exactly `"<collection>/<topic-key>"` using the quiz's real
  `collection` and `key` (not its title).

## Steps

### 1. Parse the request

Extract three things from what the user said:

- **Which quiz** — a title or partial name (e.g. "kubernetes architecture",
  "Pods", "self attention").
  The user is in **Phoenix, Arizona** (timezone `America/Phoenix`, MST /
  UTC−7, no daylight saving). The container clock is UTC, so always read the
  date and time in the user's timezone with `TZ='America/Phoenix'`, never the
  raw UTC clock.

- **The date** — resolve relative words against today *in Phoenix*. Run
  `TZ='America/Phoenix' date +%Y-%m-%d` for "today", and compute
  "yesterday"/explicit dates from it. Never guess the date — always read it
  from the system in that timezone.
- **The time** — normalize to 24-hour `HH:MM`. "11am" → `11:00`,
  "11:30pm" → `23:30`, "noon" → `12:00`. If the user gives no time, use the
  current Phoenix time from `TZ='America/Phoenix' date +%H:%M`, and mention
  that you did so.

### 2. Identify the quiz

List the available quizzes by reading the `collection` and `key` (and
`title`) fields from the files in `quizzes/` (each `*.js` quiz file calls
`registerQuiz`/`registerStructuredQuiz` with those fields; `_collections.js`
lists collection keys/titles). Match the user's phrase against title and key,
case-insensitively, allowing partial matches.

- **Exactly one confident match** → proceed.
- **No match, or multiple plausible matches** → STOP and ask the user with
  the `AskUserQuestion` tool. List the candidate quizzes (title + collection)
  so they can pick, and don't write anything until they confirm. This
  confirmation step is required — never invent or guess a quiz key.

### 3. Update the log

Edit `quizzes/_practice-log.js`:

- If the `"<collection>/<topic-key>"` entry exists, append the new
  `{ date, time }` to its `sessions` array and increment `count`.
- If it doesn't exist, add a new entry with `count: 1` and a one-element
  `sessions` array.
- Keep the object valid JS and keep `count === sessions.length`.

Then bump the cache-busting version on the practice-log script tag in
`index.html` so browsers refetch the updated data instead of serving a
stale cached copy. Find the line
`<script defer src="quizzes/_practice-log.js?v=N"></script>` and increment
`N` by one. (Without this, a normal refresh keeps showing the old count —
only a hard refresh would pick up the change.)

### 4. Verify

Run `node quizzes/.audit.js` and confirm it still reports no errors (the
practice log must not break the bundle). Then sanity-check the file parses:
`node -e "require('./quizzes/_practice-log.js')"` will fail because it uses
`window`, so instead just confirm the audit passed.

### 5. Commit and push

Per this project's branch rules, persist the change (the environment is
ephemeral, so an uncommitted log would be lost):

- Stage only `quizzes/_practice-log.js` and `index.html` (the version bump).
- Commit with a message like
  `Log practice session for <collection>/<key> (<date> <time>)`.
- Push to the designated feature branch with `git push -u origin <branch>`.

Then publish it so the count shows on the live (GitHub Pages) site, which
serves from `main`: open a pull request from the feature branch into `main`
and merge it immediately (practice-log entries are pre-approved by the user
for auto-merge — no need to ask first). Use the GitHub MCP tools
(`create_pull_request` then `merge_pull_request`). If a PR for the branch
already exists, just merge that one. This auto-merge applies only to
practice-log updates; other changes still follow the normal review flow.

### 6. Report back

Confirm to the user: which quiz, the new total count, and the recorded date
and time. Mention that the count shows on the quiz's card after a hard
refresh.

## Examples

- "I practiced the kubernetes architecture quiz today at 11 am"
  → quiz `kubernetes/cluster-architecture`, date = today, time `11:00`,
  count +1.
- "log that I went through Pods yesterday at 9:30pm"
  → quiz `kubernetes/pods`, date = yesterday, time `21:30`, count +1.
- "record that I did the attention quiz"
  → matches `deep-dive/self-attention` (and possibly `llms/self-attention`);
  more than one plausible match, so ask which one before writing.
