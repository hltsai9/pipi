#!/usr/bin/env node
// Static audit for the quiz site.
// Run from the repo root:  node quizzes/.audit.js
//
// Exit code 0 = clean (no errors). Warnings do not affect the exit code.
// Loads app.js + quizzes/*.js in a sandbox, then validates every topic.

"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");

const stubElement = () => ({
  innerHTML: "", textContent: "", value: "", style: {}, options: { length: 0 },
  classList: { add() {}, remove() {}, toggle() {} },
  setAttribute() {}, addEventListener() {}, appendChild() {},
  querySelector() { return stubElement(); },
  querySelectorAll() { return []; }
});
const sandbox = {
  console,
  document: {
    getElementById() { return stubElement(); },
    querySelectorAll() { return []; },
    addEventListener() {},
    createElement() { return stubElement(); }
  }
};
sandbox.window = sandbox;
vm.createContext(sandbox);

const files = [
  path.join(ROOT, "app.js"),
  path.join(ROOT, "quizzes/data-collections.js"),
  ...fs.readdirSync(path.join(ROOT, "quizzes"))
    .filter(f => f.endsWith(".js") && f !== "data-collections.js" && !f.startsWith("."))
    .map(f => path.join(ROOT, "quizzes", f))
];

const source = files.map(f => fs.readFileSync(f, "utf8")).join("\n;\n")
  + ";globalThis.__Q = Quiz;";

try {
  vm.runInContext(source, sandbox, { filename: "audit-bundle" });
} catch (e) {
  console.error("Failed to load quiz files:", e.message);
  process.exit(2);
}

const cols = sandbox.__Q.getCollections();
const errors = [];
const warnings = [];
let total = 0;

for (const ck of Object.keys(cols)) {
  for (const tk of cols[ck].topicOrder) {
    const t = cols[ck].topics[tk];
    const where = `${ck}/${tk}`;
    const positionCounts = [0, 0, 0, 0];

    if (t.questions.length < 5) {
      errors.push(`${where}: ${t.questions.length} questions (minimum 5)`);
    }

    let mcCount = 0;
    for (const [i, q] of t.questions.entries()) {
      total++;
      const tag = `${where} Q${i + 1}`;
      const type = q.type || "multiple_choice";

      if (typeof q.q !== "string" || !q.q.trim()) {
        errors.push(`${tag}: missing question text`);
      }

      if (type === "multiple_choice") {
        mcCount++;
        if (!Array.isArray(q.choices) || q.choices.length !== 4) {
          errors.push(`${tag}: MC must have exactly 4 choices (got ${q.choices ? q.choices.length : 0})`);
          continue;
        }
        if (typeof q.answer !== "number" || q.answer < 0 || q.answer >= q.choices.length) {
          errors.push(`${tag}: answer index ${q.answer} out of range`);
          continue;
        }
        if (typeof q.explanation !== "string" || !q.explanation.trim()) {
          errors.push(`${tag}: missing explanation`);
        }

        positionCounts[q.answer]++;

        const lens = q.choices.map(c => c.length);
        const correctLen = lens[q.answer];
        const others = lens.filter((_, j) => j !== q.answer);
        const avg = others.reduce((a, b) => a + b, 0) / others.length;
        if (correctLen === Math.max(...lens) && correctLen > avg * 1.4) {
          errors.push(
            `${tag}: length-tell — correct option ${correctLen} chars vs avg distractor ${avg.toFixed(0)}`
          );
        }
      } else if (type === "flashcard") {
        if (typeof q.back !== "string" || !q.back.trim()) {
          errors.push(`${tag}: flashcard missing back/answer`);
        }
      } else if (type === "open_ended") {
        // q text already validated; nothing else required
      } else {
        errors.push(`${tag}: unknown question type '${type}'`);
      }
    }

    if (mcCount > 0) {
      const maxAtOnePos = Math.max(...positionCounts);
      if (maxAtOnePos / mcCount > 0.5) {
        const idx = positionCounts.indexOf(maxAtOnePos);
        warnings.push(
          `${where}: ${maxAtOnePos}/${mcCount} MC answers at index ${idx} — vary positions`
        );
      }
    }
  }
}

const colCount = Object.keys(cols).length;
const topicCount = Object.values(cols).reduce((s, c) => s + c.topicOrder.length, 0);
console.log(`Audited ${colCount} collections, ${topicCount} topics, ${total} questions.`);
if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`);
  for (const w of warnings) console.log("  ⚠  " + w);
}
if (errors.length) {
  console.log(`\nErrors (${errors.length}):`);
  for (const e of errors) console.log("  ✗  " + e);
  process.exit(1);
}
console.log("\nNo errors.");
