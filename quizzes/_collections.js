/* Declares the collections (top-level tabs) shown on the home screen.
 * The display order matches the order of registerCollection() calls below. */

registerCollection({
  key: "llms",
  title: "LLMs",
  description: "Each quiz has multiple-choice questions with explanations after every answer."
});

registerCollection({
  key: "gpus",
  title: "GPUs",
  description: "Architecture, how GPUs differ from CPUs, and how they evolved into AI accelerators."
});

registerCollection({
  key: "deep-dive",
  title: "Deep Dive",
  description: "Structured study sets — priming, comprehension, application, and synthesis — mixing flashcards, multiple choice, and open-ended reflection."
});

registerCollection({
  key: "tooling",
  title: "Tooling",
  description: "Developer tooling — the day-to-day surface area of building with Claude and modern AI dev environments."
});
