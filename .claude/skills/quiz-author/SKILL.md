---
name: quiz-author
description: Author quiz content for this project's quiz site under quizzes/ — add a topic, add a collection, rewrite/balance options, or audit topics for design problems. Triggers on phrases like "add a quiz on X", "make a quiz about X", "audit the quizzes", "rewrite the options".
---

# Quiz Author

The site lives at the repo root: `index.html`, `app.js`, `styles.css`, and a
`quizzes/` folder holding one file per topic plus `_collections.js`. Topics
self-register via `registerQuiz({...})`; collections via
`registerCollection({...})`.

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

5. **Question count.** Target the framework's ranges below (~20 MCs total)
   for substantial topics. Hard minimum 5. For smaller topics, scale all
   four categories down proportionally but keep them all represented.

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

## Question generation framework

When authoring a topic from scratch, structure the question set by learning
purpose into four categories. This is the canonical generation prompt;
follow it unless the user opts out.

> You are generating a study question set for [TOPIC]. Produce questions
> organized by learning purpose AND format.
>
> **Four question categories**
>
> 1. **Priming** (3–5 questions) — Designed to be answered BEFORE studying.
>    Activate prior knowledge and surface assumptions. Include at least one
>    prediction / hypothesis question. Format: open-ended, no answer key
>    (these are for self-reflection).
>
> 2. **Comprehension** (8–10 questions) — Test understanding of core
>    concepts. Mix factual recall, explanation ("why"), and contrast ("how
>    does X differ from Y"). Format: flashcards.
>
> 3. **Application** (6–8 questions) — Novel scenarios that require
>    applying the concept, not restating it. Avoid textbook examples.
>    Format: multiple choice.
>
> 4. **Transfer / Synthesis** (3–4 questions) — Connect this topic to
>    others, identify edge cases, or explain what changes if a key
>    assumption is altered. Format: mix of flashcards and multiple choice.
>
> **Format specs**
>
> - **Flashcards.** Front: a single clear question, term, or concept.
>   Back: concise answer, 1–3 sentences max — no paragraphs.
>
> - **Multiple choice.** Question stem + four options (A–D). Plausible
>   distractors targeting common misconceptions; no obviously silly
>   options. Correct answer marked. One-sentence explanation of why the
>   correct answer is right AND why at least one tempting wrong answer
>   is wrong.

### Mapping to the current engine

The runtime renders only multiple-choice — no flashcard or open-ended UI
yet. Plan all four categories during generation, then author every
question as multiple-choice in the file. Use the category intents to
drive what each question tests:

- Priming MCs predict ("If you increase X, what happens to Y?")
- Comprehension MCs explain a core mechanism
- Application MCs present novel scenarios
- Synthesis MCs connect topics or alter an assumption

Record the breakdown in a single header comment at the top of the file
(no per-question `category` field — keeps the data clean):

    // 4 priming · 8 comprehension · 6 application · 3 synthesis = 21 MCs

If the user explicitly wants real flashcards or open-ended priming
questions in the UI, propose extending `app.js` first and confirm before
doing that work.

## A. Add a topic

### A1. Pick a collection

Read `quizzes/_collections.js` and skim the topic titles already in each
collection. Propose the best fit to the user with a one-line rationale.
If two are plausible, ask. If none fit, switch to flow B.

### A2. Pick a slug, glance at neighbors

Filename: `quizzes/<collection>-<kebab-slug>.js`, matching the existing
naming pattern (e.g. `llms-rag.js`, `llms-nn-attention.js`). Read one
existing file in the same collection first to align tone, icon style,
and description voice with the rest.

### A3. Plan the question set, then write the file

Plan counts up front using the four-category framework (e.g. 4 priming +
8 comprehension + 6 application + 3 synthesis = 21 MCs) and put them in
the header comment. Apply the design rules as you write.

Schema:

    // 4 priming · 8 comprehension · 6 application · 3 synthesis = 21 MCs
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
        // 5+ questions
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
   `quizzes/_collections.js`.
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
