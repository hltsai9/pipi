/* Tech Quiz — multi-format quizzes with explanations.
 * Pure client-side, no dependencies.
 *
 * ──────────────────────────────────────────────────────────────────────
 *  Two registration APIs
 * ──────────────────────────────────────────────────────────────────────
 *
 *  1) registerQuiz  — flat list of multiple-choice questions.
 *
 *       registerQuiz({
 *         collection: "llms",
 *         key: "prompt-engineering",
 *         title: "Prompt Engineering",
 *         icon: "P",
 *         description: "...",
 *         createdAt: "2026-04-25T18:00:00Z",
 *         updatedAt: "2026-04-25T18:00:00Z",
 *         questions: [
 *           { q: "...", choices: ["A","B","C","D"], answer: 2,
 *             explanation: "..." },
 *           ...
 *         ]
 *       });
 *
 *  2) registerStructuredQuiz — sectioned by learning purpose, with
 *     mixed question types (multiple_choice, flashcard, open_ended).
 *
 *       registerStructuredQuiz({
 *         collection: "deep-dive",
 *         key: "self-attention",
 *         title: "Self-Attention",
 *         icon: "α",
 *         description: "...",
 *         createdAt: "2026-04-26T20:30:00Z",
 *         updatedAt: "2026-04-26T20:30:00Z",
 *         sections: [
 *           { category: "priming", questions: [
 *             { type: "open_ended", question: "...", difficulty: "easy" }
 *           ]},
 *           { category: "comprehension", questions: [
 *             { type: "flashcard", question: "...", answer: "...",
 *               difficulty: "medium" }
 *           ]},
 *           { category: "application", questions: [
 *             { type: "multiple_choice", question: "...",
 *               options: ["...","...","...","..."],
 *               correct_option: "C",
 *               explanation: "...", difficulty: "hard" }
 *           ]},
 *           { category: "transfer_synthesis", questions: [...] }
 *         ]
 *       });
 *
 *  Add the file to index.html with <script defer src="..."></script>.
 *  Collections are declared in quizzes/_collections.js.
 * ──────────────────────────────────────────────────────────────────────
 */

const Quiz = (() => {
  const collections = Object.create(null);
  const collectionOrder = [];

  function ensureCollection(key) {
    if (!collections[key]) {
      collections[key] = {
        key,
        title: key,
        description: "",
        topics: Object.create(null),
        topicOrder: []
      };
      collectionOrder.push(key);
    }
    return collections[key];
  }

  function registerCollection({ key, title, description }) {
    if (!key) throw new Error("registerCollection: 'key' is required");
    const c = ensureCollection(key);
    if (title !== undefined) c.title = title;
    if (description !== undefined) c.description = description;
  }

  function parseTimestamp(value, fieldName, refLabel) {
    if (value === undefined || value === null || value === "") return 0;
    const ms = (typeof value === "number") ? value : new Date(value).getTime();
    if (Number.isNaN(ms)) {
      throw new Error(`${refLabel}: invalid ${fieldName}: ${value}`);
    }
    return ms;
  }

  function storeTopic(collection, key, title, icon, description, createdAt, updatedAt, questions) {
    const ref = `${collection}/${key}`;
    const created = parseTimestamp(createdAt, "createdAt", ref);
    const updated = parseTimestamp(updatedAt, "updatedAt", ref) || created;
    const c = ensureCollection(collection);
    if (!c.topics[key]) c.topicOrder.push(key);
    c.topics[key] = {
      key,
      title: title || key,
      icon: icon || "?",
      description: description || "",
      questions,
      createdAt: created,
      updatedAt: updated
    };
  }

  function registerQuiz({ collection, key, title, icon, description, questions, createdAt, updatedAt }) {
    if (!collection) throw new Error("registerQuiz: 'collection' is required");
    if (!key) throw new Error("registerQuiz: 'key' is required");
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error(`registerQuiz: '${collection}/${key}' has no questions`);
    }
    const normalized = questions.map((q) => ({ type: q.type || "multiple_choice", ...q }));
    storeTopic(collection, key, title, icon, description, createdAt, updatedAt, normalized);
  }

  const LETTER_TO_INDEX = { A: 0, B: 1, C: 2, D: 3 };

  function registerStructuredQuiz({ collection, key, title, icon, description, sections, createdAt, updatedAt }) {
    if (!collection) throw new Error("registerStructuredQuiz: 'collection' is required");
    if (!key) throw new Error("registerStructuredQuiz: 'key' is required");
    if (!Array.isArray(sections) || sections.length === 0) {
      throw new Error(`registerStructuredQuiz: '${collection}/${key}' has no sections`);
    }
    const flat = [];
    for (const sec of sections) {
      const cat = sec.category;
      for (const q of (sec.questions || [])) {
        const item = {
          type: q.type,
          q: q.question,
          difficulty: q.difficulty || "",
          explanation: q.explanation || "",
          section: cat
        };
        if (q.type === "multiple_choice") {
          item.choices = q.options;
          const idx = LETTER_TO_INDEX[q.correct_option];
          if (idx === undefined) {
            throw new Error(`${collection}/${key}: invalid correct_option '${q.correct_option}'`);
          }
          item.answer = idx;
        } else if (q.type === "flashcard") {
          item.back = q.answer || "";
        } else if (q.type === "open_ended") {
          // no extra fields
        } else {
          throw new Error(`${collection}/${key}: unknown question type '${q.type}'`);
        }
        flat.push(item);
      }
    }
    if (flat.length === 0) {
      throw new Error(`registerStructuredQuiz: '${collection}/${key}' has no questions`);
    }
    storeTopic(collection, key, title, icon, description, createdAt, updatedAt, flat);
  }

  return {
    registerCollection,
    registerQuiz,
    registerStructuredQuiz,
    getCollections: () => collections,
    getCollectionOrder: () => collectionOrder.slice()
  };
})();

window.registerCollection = Quiz.registerCollection;
window.registerQuiz = Quiz.registerQuiz;
window.registerStructuredQuiz = Quiz.registerStructuredQuiz;

const SECTION_LABELS = {
  priming: "Priming",
  comprehension: "Comprehension",
  application: "Application",
  transfer_synthesis: "Transfer / Synthesis"
};

const state = {
  currentCollection: null,
  currentTopic: null,
  currentIndex: 0,
  score: 0,
  mcTotal: 0,
  answered: false,
  revealed: false,
  answers: [],         // per-question history for back-navigation
  sortBy: "created",
  sortDir: "desc"
};

const SORT_OPTIONS = [
  { value: "created-desc", sortBy: "created", sortDir: "desc", label: "Created (newest first)" },
  { value: "created-asc",  sortBy: "created", sortDir: "asc",  label: "Created (oldest first)" },
  { value: "updated-desc", sortBy: "updated", sortDir: "desc", label: "Updated (newest first)" },
  { value: "updated-asc",  sortBy: "updated", sortDir: "asc",  label: "Updated (oldest first)" }
];

const $ = (id) => document.getElementById(id);

function formatDate(ms) {
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric"
  });
}

function getPracticeEntry(collectionKey, topicKey) {
  const log = window.__practiceLog || {};
  return log[`${collectionKey}/${topicKey}`] || null;
}

function formatSession(session) {
  if (!session || !session.date) return "";
  const d = new Date(`${session.date}T${session.time || "00:00"}`);
  const datePart = Number.isNaN(d.getTime())
    ? session.date
    : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  return session.time ? `${datePart}, ${session.time}` : datePart;
}

function sortKey(topic) {
  return state.sortBy === "updated" ? topic.updatedAt : topic.createdAt;
}

function sortedTopicKeys(collection) {
  const dir = state.sortDir === "desc" ? -1 : 1;
  return collection.topicOrder.slice().sort((a, b) => {
    return dir * (sortKey(collection.topics[a]) - sortKey(collection.topics[b]));
  });
}

function getCurrentCollection() {
  return Quiz.getCollections()[state.currentCollection];
}

function getQuiz(topicKey) {
  return getCurrentCollection().topics[topicKey];
}

function showScreen(name) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $(name).classList.add("active");
}

function renderCollectionTabs() {
  const tabs = $("collection-tabs");
  tabs.innerHTML = "";
  const order = Quiz.getCollectionOrder();
  for (const key of order) {
    const c = Quiz.getCollections()[key];
    const btn = document.createElement("button");
    btn.className = "collection-tab" + (key === state.currentCollection ? " active" : "");
    btn.textContent = c.title;
    btn.setAttribute("role", "tab");
    btn.addEventListener("click", () => {
      if (state.currentCollection === key) return;
      state.currentCollection = key;
      renderCollectionTabs();
      renderTopics();
    });
    tabs.appendChild(btn);
  }
  const c = getCurrentCollection();
  if (c) $("collection-desc").textContent = c.description || "";
}

function renderSortControl() {
  const select = $("sort-select");
  if (!select) return;
  if (!select.options.length) {
    for (const opt of SORT_OPTIONS) {
      const o = document.createElement("option");
      o.value = opt.value;
      o.textContent = opt.label;
      select.appendChild(o);
    }
    select.addEventListener("change", () => {
      const opt = SORT_OPTIONS.find((o) => o.value === select.value);
      if (!opt) return;
      state.sortBy = opt.sortBy;
      state.sortDir = opt.sortDir;
      renderTopics();
    });
  }
  select.value = `${state.sortBy}-${state.sortDir}`;
}

function renderTopics() {
  renderSortControl();
  const collection = getCurrentCollection();
  const grid = $("topic-grid");
  grid.innerHTML = "";
  if (!collection) {
    grid.innerHTML = `<p class="muted">No quizzes registered yet.</p>`;
    return;
  }
  for (const key of sortedTopicKeys(collection)) {
    const quiz = collection.topics[key];
    const card = document.createElement("button");
    card.className = "topic-card";
    card.innerHTML = `
      <span class="topic-icon"></span>
      <h3></h3>
      <p></p>
      <span class="topic-count"></span>
      <span class="topic-practice"></span>
      <div class="topic-meta">
        <span><span class="topic-meta-label">Created</span> <span class="topic-meta-date" data-field="created"></span></span>
        <span><span class="topic-meta-label">Updated</span> <span class="topic-meta-date" data-field="updated"></span></span>
      </div>
    `;
    card.querySelector(".topic-icon").textContent = quiz.icon;
    card.querySelector("h3").textContent = quiz.title;
    card.querySelector("p").textContent = quiz.description;
    card.querySelector(".topic-count").textContent = `${quiz.questions.length} questions`;
    const practice = getPracticeEntry(collection.key, key);
    const practiceEl = card.querySelector(".topic-practice");
    if (practice && practice.count > 0) {
      const sessions = practice.sessions || [];
      const last = sessions.length ? sessions[sessions.length - 1] : null;
      const lastStr = last ? ` · last ${formatSession(last)}` : "";
      practiceEl.textContent = `Practiced ${practice.count}×${lastStr}`;
    } else {
      practiceEl.textContent = "Not practiced yet";
      practiceEl.classList.add("muted-practice");
    }
    card.querySelector('[data-field="created"]').textContent = formatDate(quiz.createdAt);
    card.querySelector('[data-field="updated"]').textContent = formatDate(quiz.updatedAt);
    card.addEventListener("click", () => startQuiz(key));
    grid.appendChild(card);
  }
}

function startQuiz(topicKey) {
  const quiz = getQuiz(topicKey);
  state.currentTopic = topicKey;
  state.currentIndex = 0;
  state.score = 0;
  state.mcTotal = quiz.questions.filter((q) => q.type === "multiple_choice").length;
  state.answered = false;
  state.revealed = false;
  state.answers = [];
  $("quiz-title").textContent = quiz.title;
  $("score").textContent = "0";
  showScreen("quiz");
  renderQuestion();
}

function setHidden(el, hidden) {
  if (!el) return;
  el.classList.toggle("hidden", hidden);
}

function renderQuestion() {
  const quiz = getQuiz(state.currentTopic);
  const qIdx = state.currentIndex;
  const question = quiz.questions[qIdx];
  const prior = state.answers[qIdx];
  state.answered = !!prior;
  state.revealed = !!(prior && prior.revealed);

  $("progress-text").textContent = `Question ${qIdx + 1} of ${quiz.questions.length}`;
  $("progress-fill").style.width = `${(qIdx / quiz.questions.length) * 100}%`;

  const sectionLabel = $("section-label");
  if (question.section && SECTION_LABELS[question.section]) {
    sectionLabel.textContent = SECTION_LABELS[question.section];
    setHidden(sectionLabel, false);
  } else {
    setHidden(sectionLabel, true);
  }

  const diffBadge = $("difficulty-badge");
  if (question.difficulty) {
    diffBadge.textContent = question.difficulty;
    diffBadge.className = `difficulty-badge difficulty-${question.difficulty}`;
    setHidden(diffBadge, false);
  } else {
    setHidden(diffBadge, true);
  }

  $("question-text").textContent = question.q;

  setHidden($("choices"), true);
  setHidden($("flashcard-back"), true);
  setHidden($("open-ended-note"), true);
  setHidden($("explanation"), true);
  setHidden($("reveal-btn"), true);
  setHidden($("next-btn"), true);
  $("explanation").classList.remove("correct", "incorrect");

  if (question.type === "multiple_choice") {
    renderMultipleChoice(question);
    if (prior) restoreMultipleChoice(question, prior);
  } else if (question.type === "flashcard") {
    renderFlashcard(question);
    if (prior && prior.revealed) restoreFlashcardRevealed(question);
  } else if (question.type === "open_ended") {
    renderOpenEnded(question);
  }

  setHidden($("back-btn"), qIdx === 0);
}

function restoreMultipleChoice(question, prior) {
  const items = document.querySelectorAll("#choices .choice");
  items.forEach((el, i) => {
    el.classList.add("locked");
    if (i === question.answer) el.classList.add("correct");
    else if (i === prior.selectedIdx) el.classList.add("incorrect");
    else el.classList.add("dimmed");
  });
  if (question.explanation) {
    const explanation = $("explanation");
    explanation.classList.add(prior.isCorrect ? "correct" : "incorrect");
    $("explanation-title").textContent = prior.isCorrect ? "Correct!" : "Not quite.";
    $("explanation-text").textContent = question.explanation;
    setHidden(explanation, false);
  }
  showNextButton();
}

function restoreFlashcardRevealed(question) {
  setHidden($("flashcard-back"), false);
  setHidden($("reveal-btn"), true);
  if (question.explanation) {
    const explanation = $("explanation");
    $("explanation-title").textContent = "Note";
    $("explanation-text").textContent = question.explanation;
    setHidden(explanation, false);
  }
  showNextButton();
}

function renderMultipleChoice(question) {
  const choices = $("choices");
  choices.innerHTML = "";
  const letters = ["A", "B", "C", "D", "E", "F"];
  question.choices.forEach((text, i) => {
    const li = document.createElement("li");
    li.className = "choice";
    li.innerHTML = `<span class="letter">${letters[i]}</span><span></span>`;
    li.querySelector("span:last-child").textContent = text;
    li.addEventListener("click", () => selectChoice(i));
    choices.appendChild(li);
  });
  setHidden(choices, false);
}

function renderFlashcard(question) {
  $("flashcard-back-text").textContent = question.back || "";
  setHidden($("reveal-btn"), false);
}

function renderOpenEnded(question) {
  $("open-ended-note").textContent = "Reflection question — pause to think, then continue.";
  setHidden($("open-ended-note"), false);
  showNextButton();
}

function selectChoice(idx) {
  if (state.answered) return;
  state.answered = true;

  const quiz = getQuiz(state.currentTopic);
  const question = quiz.questions[state.currentIndex];
  const correctIdx = question.answer;
  const isCorrect = idx === correctIdx;

  if (isCorrect) state.score += 1;
  state.answers[state.currentIndex] = { selectedIdx: idx, isCorrect };
  $("score").textContent = String(state.score);

  const items = document.querySelectorAll("#choices .choice");
  items.forEach((el, i) => {
    el.classList.add("locked");
    if (i === correctIdx) el.classList.add("correct");
    else if (i === idx) el.classList.add("incorrect");
    else el.classList.add("dimmed");
  });

  if (question.explanation) {
    const explanation = $("explanation");
    explanation.classList.add(isCorrect ? "correct" : "incorrect");
    $("explanation-title").textContent = isCorrect ? "Correct!" : "Not quite.";
    $("explanation-text").textContent = question.explanation;
    setHidden(explanation, false);
  }

  showNextButton();
}

function revealFlashcard() {
  if (state.revealed) return;
  state.revealed = true;
  state.answers[state.currentIndex] = { revealed: true };
  setHidden($("flashcard-back"), false);
  setHidden($("reveal-btn"), true);

  const quiz = getQuiz(state.currentTopic);
  const question = quiz.questions[state.currentIndex];
  if (question.explanation) {
    const explanation = $("explanation");
    $("explanation-title").textContent = "Note";
    $("explanation-text").textContent = question.explanation;
    setHidden(explanation, false);
  }
  showNextButton();
}

function goBack() {
  if (state.currentIndex > 0) {
    state.currentIndex -= 1;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function showNextButton() {
  const quiz = getQuiz(state.currentTopic);
  const isLast = state.currentIndex === quiz.questions.length - 1;
  const nextBtn = $("next-btn");
  nextBtn.textContent = isLast ? "See Results →" : "Next →";
  setHidden(nextBtn, false);
}

function nextQuestion() {
  const quiz = getQuiz(state.currentTopic);
  if (state.currentIndex < quiz.questions.length - 1) {
    state.currentIndex += 1;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    showResults();
  }
}

function showResults() {
  const quiz = getQuiz(state.currentTopic);
  const total = quiz.questions.length;
  const reflectionTotal = total - state.mcTotal;
  $("final-score").textContent = String(state.score);
  $("final-total").textContent = String(state.mcTotal);
  setHidden($("final-mc-suffix"), state.mcTotal === total);

  let msg;
  if (state.mcTotal === 0) {
    msg = "Reflection-only set — no score, just contemplation.";
  } else {
    const pct = state.score / state.mcTotal;
    if (pct === 1) msg = "Perfect score — nailed it!";
    else if (pct >= 0.8) msg = "Excellent work. Solid grasp of the material.";
    else if (pct >= 0.6) msg = "Good effort — review the explanations and try again.";
    else if (pct >= 0.4) msg = "Some gaps to fill. The explanations are a great place to start.";
    else msg = "Plenty to learn here — read the explanations and give it another go.";
  }
  if (reflectionTotal > 0) {
    msg += ` (${reflectionTotal} reflection ${reflectionTotal === 1 ? "question" : "questions"} completed.)`;
  }
  $("result-message").textContent = msg;
  showScreen("results");
}

function init() {
  const order = Quiz.getCollectionOrder();
  state.currentCollection = order[0] || null;
  renderCollectionTabs();
  renderTopics();

  $("back-home").addEventListener("click", () => showScreen("home"));
  $("home-btn").addEventListener("click", () => showScreen("home"));
  $("retry-btn").addEventListener("click", () => startQuiz(state.currentTopic));
  $("next-btn").addEventListener("click", nextQuestion);
  $("reveal-btn").addEventListener("click", revealFlashcard);
  $("back-btn").addEventListener("click", goBack);
}

document.addEventListener("DOMContentLoaded", init);
