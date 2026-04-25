/* Tech Quiz — multiple-choice quizzes with explanations.
 * Pure client-side, no dependencies.
 *
 * ──────────────────────────────────────────────────────────────────────
 *  Adding a new quiz topic
 * ──────────────────────────────────────────────────────────────────────
 *  1. Create a new file in the quizzes/ folder, e.g.
 *
 *       quizzes/llms-prompt-engineering.js
 *
 *     and call registerQuiz from it:
 *
 *       registerQuiz({
 *         collection: "llms",            // collection key (tab)
 *         key: "prompt-engineering",     // unique within the collection
 *         title: "Prompt Engineering",
 *         icon: "P",                     // single letter / emoji shown on card
 *         description: "Patterns and pitfalls in prompting LLMs.",
 *         createdAt: "2026-04-25T18:00:00Z",   // ISO 8601 string
 *         updatedAt: "2026-04-25T18:00:00Z",   // ISO 8601 string
 *         questions: [
 *           {
 *             q: "Which prompting technique...?",
 *             choices: ["A", "B", "C", "D"],
 *             answer: 2,                 // 0-based index of the correct choice
 *             explanation: "Why C is correct..."
 *           },
 *           // ...more questions
 *         ]
 *       });
 *
 *  2. Add the file to index.html in the "Quiz data" block:
 *
 *       <script defer src="quizzes/llms-prompt-engineering.js"></script>
 *
 *     The order of <script> tags determines the order of topic cards.
 *
 *  Adding a new collection (a new tab) works the same way: declare it
 *  once with registerCollection({key, title, description}), typically in
 *  quizzes/_collections.js. Quizzes that reference an unknown collection
 *  auto-create one with sensible defaults.
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
      throw new Error(`registerQuiz: '${refLabel}' has invalid ${fieldName}: ${value}`);
    }
    return ms;
  }

  function registerQuiz({ collection, key, title, icon, description, questions, createdAt, updatedAt }) {
    if (!collection) throw new Error("registerQuiz: 'collection' is required");
    if (!key) throw new Error("registerQuiz: 'key' is required");
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error(`registerQuiz: '${collection}/${key}' has no questions`);
    }
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

  return {
    registerCollection,
    registerQuiz,
    getCollections: () => collections,
    getCollectionOrder: () => collectionOrder.slice()
  };
})();

window.registerCollection = Quiz.registerCollection;
window.registerQuiz = Quiz.registerQuiz;

const state = {
  currentCollection: null,
  currentTopic: null,
  currentIndex: 0,
  score: 0,
  answered: false,
  sortBy: "created",   // "created" | "updated"
  sortDir: "desc"      // "asc" | "desc"
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
      <div class="topic-meta">
        <span><span class="topic-meta-label">Created</span> <span class="topic-meta-date" data-field="created"></span></span>
        <span><span class="topic-meta-label">Updated</span> <span class="topic-meta-date" data-field="updated"></span></span>
      </div>
    `;
    card.querySelector(".topic-icon").textContent = quiz.icon;
    card.querySelector("h3").textContent = quiz.title;
    card.querySelector("p").textContent = quiz.description;
    card.querySelector(".topic-count").textContent = `${quiz.questions.length} questions`;
    card.querySelector('[data-field="created"]').textContent = formatDate(quiz.createdAt);
    card.querySelector('[data-field="updated"]').textContent = formatDate(quiz.updatedAt);
    card.addEventListener("click", () => startQuiz(key));
    grid.appendChild(card);
  }
}

function startQuiz(topicKey) {
  state.currentTopic = topicKey;
  state.currentIndex = 0;
  state.score = 0;
  state.answered = false;
  $("quiz-title").textContent = getQuiz(topicKey).title;
  $("score").textContent = "0";
  showScreen("quiz");
  renderQuestion();
}

function renderQuestion() {
  const quiz = getQuiz(state.currentTopic);
  const qIdx = state.currentIndex;
  const question = quiz.questions[qIdx];
  state.answered = false;

  $("progress-text").textContent = `Question ${qIdx + 1} of ${quiz.questions.length}`;
  $("progress-fill").style.width = `${(qIdx / quiz.questions.length) * 100}%`;
  $("question-text").textContent = question.q;

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

  const explanation = $("explanation");
  explanation.classList.add("hidden");
  explanation.classList.remove("correct", "incorrect");
  $("next-btn").classList.add("hidden");
}

function selectChoice(idx) {
  if (state.answered) return;
  state.answered = true;

  const quiz = getQuiz(state.currentTopic);
  const question = quiz.questions[state.currentIndex];
  const correctIdx = question.answer;
  const isCorrect = idx === correctIdx;

  if (isCorrect) state.score += 1;
  $("score").textContent = String(state.score);

  const items = document.querySelectorAll("#choices .choice");
  items.forEach((el, i) => {
    el.classList.add("locked");
    if (i === correctIdx) el.classList.add("correct");
    else if (i === idx) el.classList.add("incorrect");
    else el.classList.add("dimmed");
  });

  const explanation = $("explanation");
  explanation.classList.remove("hidden");
  explanation.classList.add(isCorrect ? "correct" : "incorrect");
  $("explanation-title").textContent = isCorrect ? "Correct!" : "Not quite.";
  $("explanation-text").textContent = question.explanation;

  const isLast = state.currentIndex === quiz.questions.length - 1;
  const nextBtn = $("next-btn");
  nextBtn.textContent = isLast ? "See Results →" : "Next Question →";
  nextBtn.classList.remove("hidden");
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
  $("final-score").textContent = String(state.score);
  $("final-total").textContent = String(quiz.questions.length);
  const pct = state.score / quiz.questions.length;
  let msg;
  if (pct === 1) msg = "Perfect score — nailed it!";
  else if (pct >= 0.8) msg = "Excellent work. Solid grasp of the material.";
  else if (pct >= 0.6) msg = "Good effort — review the explanations and try again.";
  else if (pct >= 0.4) msg = "Some gaps to fill. The explanations are a great place to start.";
  else msg = "Plenty to learn here — read the explanations and give it another go.";
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
}

document.addEventListener("DOMContentLoaded", init);
