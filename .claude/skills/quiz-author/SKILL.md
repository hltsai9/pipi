---
name: quiz-author
description: Author quiz content for this project's quiz site under quizzes/ — add a topic, add a collection, rewrite/balance options, or audit topics for design problems. Triggers on phrases like "add a quiz on X", "make a quiz about X", "audit the quizzes", "rewrite the options".
---

# Quiz Author

The site lives at the repo root: `index.html`, `app.js`, `styles.css`, and a
`quizzes/` folder holding one file per topic plus `data-collections.js`. Topics
self-register; collections via `registerCollection({...})`.

There are two registration APIs:

- **`registerQuiz`** — flat list of multiple-choice questions. Used by the
  `llms` and `gpus` collections.
- **`registerStructuredQuiz`** — sectioned by learning purpose
  (priming / comprehension / application / transfer_synthesis), with mixed
  question types (`multiple_choice`, `flashcard`, `open_ended`) and a
  `difficulty` label. Used by the `deep-dive` and `tooling` collections.

Pick the API based on which collection you're authoring into.

This skill covers four operations:

- **A. Add a topic** to an existing collection.
- **B. Add a collection** (new top-level tab).
- **C. Rewrite or balance** an existing topic's choices.
- **D. Audit** all topics for design problems.

All four end with the same verification step: run `node quizzes/.audit.js`
and report 0 errors before declaring success.

## Always: question design rules

These rules are non-negotiable for any choice you author or rewrite. The
audit script enforces them.

1. **Length balance.** The correct answer must not be the longest option by
   a noticeable margin. Heuristic: each option within ~1.4× the average
   length of the others. Trim the correct answer or beef up distractors
   with realistic, on-topic detail until lengths are comparable.

2. **Distractor quality.** Distractors must be plausible and on-topic —
   wrong for a real reason a learner could mistake. Avoid joke options
   ("CPUs are analog", "GPUs run only on USB"). A reader who doesn't know
   the answer should genuinely have to reason between options.

3. **Position variety.** Vary the correct `answer` index across the file.
   Aim for a roughly even spread across 0/1/2/3 within a topic; never put
   the correct answer at the same index in every question. The audit warns
   if any single index gets >50% of a topic's questions.

4. **Always 4 choices.** Unless the user explicitly asks otherwise.

5. **Question count.** 5–7 questions per topic by default. Go bigger if
   the topic warrants it. Cover fundamentals, common misconceptions, and
   one or two specifics.

6. **Explanations.** Always present, naming the correct concept and briefly
   addressing why a tempting wrong answer is wrong.

7. **Use today's actual date.** Set `createdAt` (and `updatedAt` on
   creation) to today's ISO 8601 timestamp. If unsure, run `date -u`
   before writing the file — never guess.

### Worked example

A length-balanced, position-varied question:

    {
      q: "What does softmax produce, given a vector of raw scores?",
      choices: [
        "A vector of values in [0, 1] that sum to 1, scaled by exp",
        "A vector of values in [-1, 1] centered around the input mean",
        "A vector of binary indicators marking the largest input score",
        "A vector of integer ranks of the inputs from lowest to highest"
      ],
      answer: 0,
      explanation: "Softmax exponentiates and normalizes, yielding a probability distribution. The bounded [-1, 1] form describes tanh, not softmax."
    }

All four options are within a few characters of each other; the correct
answer is at index 0 (vary across the file); each distractor describes a
real-but-different operation a learner could plausibly confuse.

## Mix of question intents

Aim for a healthy mix across the question set, not all the same flavor:

- **Recall / definition** — names, formulas, what something is.
- **Explanation** — why a mechanism works the way it does.
- **Contrast** — how X differs from a similar Y.
- **Application** — apply the concept to a small novel scenario.
- **Synthesis** — connect to another topic, or what changes if a key
  assumption is altered.

A 5-question topic should have at least 3 of these flavors.

## A. Add a topic

### A1. Pick a collection

Read `quizzes/data-collections.js` and skim the topic titles already in each
collection. Propose the best fit to the user with a one-line rationale.
If two are plausible, ask. If none fit, switch to flow B.

### A2. Pick a slug, glance at neighbors

Filename: `quizzes/<collection>-<kebab-slug>.js`, matching the existing
naming pattern (e.g. `llms-rag.js`, `llms-nn-attention.js`). Read one
existing file in the same collection first to align tone, icon style,
and description voice with the rest.

### A3. Write the file

Apply the design rules and intent mix as you write. Use the schema for
the collection you're targeting.

#### `registerQuiz` (used by `llms` and `gpus`)

    registerQuiz({
      collection: "llms",
      key: "rag",                              // unique within collection
      title: "Retrieval-Augmented Generation",
      icon: "R",                               // single letter or symbol
      description: "One-line summary shown on the topic card.",
      createdAt: "2026-04-26T18:00:00Z",
      updatedAt: "2026-04-26T18:00:00Z",
      questions: [
        {
          q: "Question stem ending with a question mark or colon?",
          choices: ["A …", "B …", "C …", "D …"],
          answer: 2,
          explanation: "Why correct is correct, and why a tempting wrong answer is wrong."
        }
        // 5–7 questions
      ]
    });

#### `registerStructuredQuiz` (used by `deep-dive`)

Required structure: four sections (`priming`, `comprehension`,
`application`, `transfer_synthesis`), each with its own questions.
Question type per section:

- **Priming** (3–5) — type `open_ended`. Pre-study reflection prompts;
  no answer key, no scoring.
- **Comprehension** (5–10) — type `flashcard`. Front (`question`) and
  back (`answer`); 1–3 sentences max on the back.
- **Application** (4–8) — type `multiple_choice`. Same MC design rules
  apply (length balance, position variety, plausible distractors,
  explanation).
- **Transfer / Synthesis** (2–4) — mix of `flashcard` and
  `multiple_choice`; pick whichever fits each question.

Every question must have a `difficulty` of `easy`, `medium`, or `hard`.

    registerStructuredQuiz({
      collection: "deep-dive",
      key: "rag",
      title: "Retrieval-Augmented Generation",
      icon: "R",
      description: "...",
      createdAt: "2026-04-26T18:00:00Z",
      updatedAt: "2026-04-26T18:00:00Z",
      sections: [
        { category: "priming", questions: [
          { type: "open_ended",
            question: "Before reading: what would you guess RAG does?",
            difficulty: "easy" }
        ]},
        { category: "comprehension", questions: [
          { type: "flashcard",
            question: "What does RAG stand for?",
            answer: "Retrieval-Augmented Generation.",
            difficulty: "easy" }
        ]},
        { category: "application", questions: [
          { type: "multiple_choice",
            question: "When would you choose RAG over fine-tuning?",
            options: ["…", "…", "…", "…"],
            correct_option: "C",
            explanation: "Why C; why one tempting wrong answer is wrong.",
            difficulty: "medium" }
        ]},
        { category: "transfer_synthesis", questions: [
          { type: "flashcard",
            question: "How does RAG relate to in-context learning?",
            answer: "Both supply external info via the prompt; RAG retrieves it dynamically.",
            difficulty: "hard" }
        ]}
      ]
    });

### A4. Wire it into `index.html`

Add one `<script defer>` line in the appropriate collection block. A new
file inherits the current highest `?v=` already present in the file. If
you also edit existing quiz files, bump every `?v=` (including `app.js`
and `styles.css`) so browsers refetch.

### A5. Verify

Run `node quizzes/.audit.js`. Re-author until 0 errors.

## B. Add a collection

1. Add a `registerCollection({key, title, description})` call to
   `quizzes/data-collections.js`.
2. Suggest 2–3 starter topics for the collection and run flow A for each.
3. Verify with `node quizzes/.audit.js`.

## C. Rewrite or balance an existing topic

Use when the user says options feel telegraphed, distractors feel weak,
correct answer is always at one position, etc.

1. Read the file.
2. For each question, identify which design rule it violates and rewrite
   the choices accordingly. Keep the question stem and explanation intact
   unless the explanation references a specific (now-changed) wording.
3. Bump `updatedAt` to today's ISO 8601 timestamp.
4. Bump the file's `?v=` query string in `index.html`.
5. Verify with `node quizzes/.audit.js`.

## D. Audit

Run `node quizzes/.audit.js`. The script reports:

- Schema problems (missing fields, invalid `answer` index, fewer than 4
  choices, fewer than 5 questions) — errors.
- Length-tell flags — errors.
- Position imbalance per topic (>50% of answers at one index) — warnings.

If the user asked for a pure audit, report findings and stop. If they
asked for a fix, proceed with flow C on the offending files.

## Reporting back to the user

Summarize: which files changed, how many questions added or edited, the
audit result, and to hard-refresh the page if anything that affects the
browser changed (HTML or quiz data).

## Version control

This project's branch instructions require committing and pushing each
change to the designated feature branch. When work is complete:

- Stage only the files this skill touched.
- Write a focused commit message.
- Push to the designated feature branch.
- Don't open a PR unless the user asks.

## Out of scope

- Don't modify `app.js` or `styles.css` unless explicitly asked.
- Don't create README/documentation files.
