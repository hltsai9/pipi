---
name: quiz-author
description: Use when authoring quiz content for this project's quiz site (root index.html + app.js + quizzes/ folder, with collections like LLMs and GPUs). Covers four operations - add a topic, add a collection, rewrite/balance existing options, audit topics for design problems. Trigger phrases - "add a topic / quiz / question set", "new quiz on X", "make a quiz about X", "generate a quiz on X", "create a topic for X", "add a collection / category / tab", "audit the quizzes", "audit quiz options", "rewrite the options", "balance the options", "fix the length tell", "rebalance correct-answer positions".
---

# Quiz Author

The site lives at the repo root: `index.html`, `app.js`, `styles.css`, and a
`quizzes/` folder holding one file per topic plus `_collections.js`. Topics
self-register via `registerQuiz({...})`; collections via
`registerCollection({...})`.

This skill covers four operations, each with its own flow below:

- **A. Add a topic** to an existing collection.
- **B. Add a collection** (new top-level tab).
- **C. Rewrite or balance** an existing topic's choices.
- **D. Audit** all topics for design problems.

All four end with the same verification step: run `node quizzes/.audit.js`
and report 0 errors before declaring success.

## Always: question design rules

These rules are non-negotiable for any choice you author or rewrite. They
match the existing content; the audit script enforces them.

1. **Length balance.** The correct answer must not be the longest option by
   a noticeable margin. Heuristic: each option within ~1.4× the average
   length of the others. Either trim the correct answer or beef up
   distractors with realistic, on-topic detail until lengths are comparable.

2. **Distractor quality.** Distractors must be plausible and on-topic —
   wrong for a real reason a learner could mistake. Avoid joke options
   ("CPUs are analog", "GPUs run only on USB"). A reader who doesn't know
   the answer should genuinely have to reason between options.

3. **Position variety.** Vary the correct `answer` index across the file.
   Aim for a roughly even spread across 0/1/2/3 within a topic; never put
   the correct answer at the same index in every question. The audit warns
   if any single index gets >50% of a topic's questions.

4. **Always 4 choices.** Unless the user explicitly asks otherwise.

5. **At least 5 questions per topic.** No upper limit — go bigger if the
   topic warrants it. Cover fundamentals, common misconceptions, and one or
   two specifics.

6. **Explanations.** Always present, naming the correct concept and briefly
   addressing why common wrong answers are wrong.

## A. Add a topic

### A1. Suggest the best collection (deterministic procedure)

Don't silently default — score the topic against existing collections and
surface your reasoning. Steps:

1. **Build the candidate keyword set** from the user's request. Take the
   topic name plus any descriptive phrases they typed. Lowercase, split on
   non-alphanumerics, drop stopwords (`a, an, the, of, in, and, or, for,
   to, with, on, about, is, are, this, that, these, those`) and tokens
   shorter than 3 characters. Result: a set `K`.

2. **Build each collection's vocabulary** by reading
   `quizzes/_collections.js` plus every existing topic file in that
   collection. Concatenate the collection's `title` + `description` and
   every topic's `title` + `description`. Tokenize with the same rule.
   Result per collection: a set `V_c`.

3. **Score** each collection as `|K ∩ V_c|` (count of keywords that overlap).

4. **Decide:**
   - If the top score is `≥ 2` and beats the runner-up by `≥ 1`, propose
     that collection.
   - If the top score is `0` or all collections tie at a low score,
     propose creating a new collection (switch to flow B).
   - Otherwise present the top two and ask the user to pick.

5. **Show your work** to the user — list the matching keywords for the
   proposed collection. Example:

   > "RAG" overlaps with the LLMs collection on `retrieval, generation,
   > augmented, language` (score 4) and with GPUs on nothing (score 0).
   > Proposing `llms`. OK?

Wait for the user's go-ahead before continuing.

### A2. Pick a slug and filename

`quizzes/<collection>-<kebab-slug>.js`. Match the existing naming pattern
(e.g. `llms-rag.js`, `llms-nn-attention.js`).

### A3. Write the file

Schema:

    registerQuiz({
      collection: "llms",
      key: "rag",                                // unique within collection
      title: "Retrieval-Augmented Generation",
      icon: "R",                                 // single letter or symbol
      description: "One-line summary shown on the topic card.",
      createdAt: "2026-04-26T18:00:00Z",         // ISO 8601, today's date
      updatedAt: "2026-04-26T18:00:00Z",
      questions: [
        {
          q: "Question stem ending with a question mark or colon?",
          choices: ["A …", "B …", "C …", "D …"],
          answer: 2,
          explanation: "Why the correct choice is correct, plus context."
        },
        // 5+ questions
      ]
    });

Apply the design rules above as you write.

### A4. Wire it into `index.html`

Add one `<script defer>` line in the appropriate collection block. Use the
highest `?v=` version already present (bump it if you're also touching
existing files). Sort order is independent of script order — it's by
`createdAt`.

### A5. Verify

Run `node quizzes/.audit.js`. Re-author until 0 errors.

## B. Add a collection

1. Add a `registerCollection({key, title, description})` call to
   `quizzes/_collections.js`.
2. Suggest 2–3 starter topics for the collection and run flow A for each
   (separate file per topic).
3. Verify with `node quizzes/.audit.js`.

## C. Rewrite or balance an existing topic

Use when the user says options feel telegraphed, distractors feel weak,
correct answer is always at one position, etc.

1. Read the file.
2. For each question, identify which design rule it violates (length
   imbalance, weak distractor, position monotony) and rewrite the choices
   accordingly. Keep the question stem and explanation intact unless the
   explanation references a specific (now-changed) wording.
3. Bump `updatedAt` on the file to today's ISO 8601 timestamp.
4. Bump the file's `?v=` query string in `index.html` so browsers fetch
   the new version.
5. Verify with `node quizzes/.audit.js`.

## D. Audit

Run `node quizzes/.audit.js`. The script reports:

- Schema problems (missing fields, invalid `answer` index, fewer than 4
  choices, fewer than 5 questions) — errors.
- Length-tell flags — errors.
- Position imbalance per topic (>50% of answers at one index) — warnings.

If the user asked for a pure audit (no fixes), report findings and stop.
If they asked for a fix, proceed with flow C on the offending files.

## Reporting back to the user

When done, tell them: which files changed, how many questions added or
edited, the audit result, and to hard-refresh the page if anything that
affects the browser changed (HTML or quiz data).

## Out of scope

- Don't commit or push. The user directs version control.
- Don't modify `app.js` or `styles.css` unless explicitly asked.
- Don't create README/documentation files.
