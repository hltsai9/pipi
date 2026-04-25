/* Pikmin Command — squad management app
 * Pure client-side: state lives in localStorage. */

const PIKMIN_TYPES = [
  { name: "Red",    color: "#e74c3c", ability: "Fireproof; high attack power.",        emoji: "🔥" },
  { name: "Blue",   color: "#3498db", ability: "Can swim; rescues drowning Pikmin.",   emoji: "💧" },
  { name: "Yellow", color: "#f1c40f", ability: "Shock-resistant; thrown highest.",     emoji: "⚡" },
  { name: "Purple", color: "#8e44ad", ability: "Heavy hitters; carry 10x weight.",     emoji: "💜" },
  { name: "White",  color: "#ecf0f1", ability: "Poison-immune; very fast runners.",    emoji: "☠️" },
  { name: "Rock",   color: "#95a5a6", ability: "Smash crystal; immune to crushing.",   emoji: "🪨" },
  { name: "Winged", color: "#ec87c0", ability: "Can fly; ignores terrain.",            emoji: "🪽" },
  { name: "Ice",    color: "#74b9ff", ability: "Freezes enemies and water.",           emoji: "❄️" },
  { name: "Glow",   color: "#b7e066", ability: "Glows in the dark; nocturnal scout.",  emoji: "✨" },
];

const TYPE_BY_NAME = Object.fromEntries(PIKMIN_TYPES.map(t => [t.name, t]));

const STORAGE_KEY = "pikmin-command-v1";

const defaultState = () => ({
  captain: "",
  pikmin: [],
  tasks: [],
});

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.add("hidden"), 1800);
}

/* ---------- SVG avatar ---------- */
function pikminSvg(typeName, stage) {
  const t = TYPE_BY_NAME[typeName] || PIKMIN_TYPES[0];
  const stem = "#355e2c";
  let topper = "";
  if (stage === "Leaf") {
    topper = `<path d="M32 6 q-10 -2 -10 -10 q10 -2 10 10 z" fill="#5fa83b" transform="rotate(-15 32 0)"/>`;
  } else if (stage === "Bud") {
    topper = `<circle cx="32" cy="2" r="4" fill="#f4a8c0"/><circle cx="32" cy="2" r="4" fill="#d65d8e" opacity="0.6"/>`;
  } else {
    topper = `
      <circle cx="32" cy="2" r="3.5" fill="#fff7ae"/>
      <g fill="#ec87c0">
        <ellipse cx="32" cy="-2" rx="3" ry="5"/>
        <ellipse cx="36" cy="2" rx="5" ry="3"/>
        <ellipse cx="32" cy="6" rx="3" ry="5"/>
        <ellipse cx="28" cy="2" rx="5" ry="3"/>
      </g>
      <circle cx="32" cy="2" r="2" fill="#f7d14a"/>
    `;
  }
  return `
    <svg viewBox="-4 -8 72 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="32" cy="62" rx="18" ry="3" fill="rgba(0,0,0,0.12)"/>
      <rect x="30" y="6" width="4" height="20" fill="${stem}" rx="2"/>
      ${topper}
      <ellipse cx="32" cy="42" rx="18" ry="22" fill="${t.color}"/>
      <ellipse cx="32" cy="38" rx="14" ry="16" fill="${t.color}" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>
      <circle cx="26" cy="36" r="3" fill="#fff"/>
      <circle cx="38" cy="36" r="3" fill="#fff"/>
      <circle cx="26" cy="36" r="1.5" fill="#1f2d1a"/>
      <circle cx="38" cy="36" r="1.5" fill="#1f2d1a"/>
      <ellipse cx="14" cy="48" rx="3" ry="6" fill="${t.color}" transform="rotate(-25 14 48)"/>
      <ellipse cx="50" cy="48" rx="3" ry="6" fill="${t.color}" transform="rotate(25 50 48)"/>
      <ellipse cx="22" cy="62" rx="4" ry="3" fill="${stem}"/>
      <ellipse cx="42" cy="62" rx="4" ry="3" fill="${stem}"/>
    </svg>
  `;
}

/* ---------- Tabs ---------- */
document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
    if (btn.dataset.tab === "dashboard") renderDashboard();
  });
});

/* ---------- Captain ---------- */
const captainInput = document.getElementById("captain-name");
captainInput.value = state.captain;
captainInput.addEventListener("input", () => {
  state.captain = captainInput.value.trim();
  saveState();
});

/* ---------- Roster ---------- */
const rosterGrid = document.getElementById("roster-grid");
const emptyRoster = document.getElementById("empty-roster");
const searchInput = document.getElementById("search");
const filterType = document.getElementById("filter-type");
const filterStage = document.getElementById("filter-stage");
const sortBy = document.getElementById("sort-by");

function populateTypeOptions() {
  const opts = PIKMIN_TYPES.map(t => `<option value="${t.name}">${t.name}</option>`).join("");
  filterType.insertAdjacentHTML("beforeend", opts);
  document.getElementById("pikmin-type-select").innerHTML = opts;
  document.querySelector('#task-form select[name="requiredType"]').insertAdjacentHTML("beforeend", opts);
}
populateTypeOptions();

function renderRoster() {
  const q = searchInput.value.trim().toLowerCase();
  const ft = filterType.value;
  const fs = filterStage.value;
  let list = state.pikmin.filter(p => {
    if (ft && p.type !== ft) return false;
    if (fs && p.stage !== fs) return false;
    if (q) {
      const hay = `${p.name} ${p.notes || ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const stageRank = { Flower: 3, Bud: 2, Leaf: 1 };
  switch (sortBy.value) {
    case "name":  list.sort((a, b) => a.name.localeCompare(b.name)); break;
    case "type":  list.sort((a, b) => a.type.localeCompare(b.type)); break;
    case "level": list.sort((a, b) => b.level - a.level); break;
    case "stage": list.sort((a, b) => stageRank[b.stage] - stageRank[a.stage]); break;
    default:      list.sort((a, b) => b.created - a.created);
  }

  if (list.length === 0) {
    rosterGrid.innerHTML = "";
    emptyRoster.classList.remove("hidden");
    emptyRoster.textContent = state.pikmin.length === 0
      ? "No Pikmin yet. Pluck some from the Onion to get started!"
      : "No Pikmin match your filters.";
    return;
  }
  emptyRoster.classList.add("hidden");

  rosterGrid.innerHTML = list.map(p => {
    const t = TYPE_BY_NAME[p.type];
    const lvlPct = (p.level / 10) * 100;
    return `
      <div class="pikmin-card" data-id="${p.id}">
        <div class="pikmin-avatar">${pikminSvg(p.type, p.stage)}</div>
        <div class="pikmin-name">${escapeHtml(p.name)}</div>
        <div class="pikmin-meta">
          <span class="pill type-pill" style="background:${t.color}">${t.emoji} ${p.type}</span>
          <span class="pill stage-${p.stage}">${p.stage}</span>
          <span class="pill">Lv ${p.level}</span>
        </div>
        <div class="level-bar"><div style="width:${lvlPct}%"></div></div>
        <div class="pikmin-notes">${escapeHtml(p.notes || "")}</div>
        <div class="pikmin-actions">
          <button class="btn small ghost" data-act="grow">Grow</button>
          <button class="btn small ghost" data-act="train">Train</button>
          <button class="btn small ghost" data-act="edit">Edit</button>
          <button class="btn small danger" data-act="dismiss">Dismiss</button>
        </div>
      </div>
    `;
  }).join("");
}

rosterGrid.addEventListener("click", e => {
  const btn = e.target.closest("button[data-act]");
  if (!btn) return;
  const card = btn.closest(".pikmin-card");
  const id = card.dataset.id;
  const p = state.pikmin.find(x => x.id === id);
  if (!p) return;
  switch (btn.dataset.act) {
    case "grow": growPikmin(p); break;
    case "train": trainPikmin(p); break;
    case "edit": openPikminModal(p); break;
    case "dismiss": dismissPikmin(p); break;
  }
});

function growPikmin(p) {
  if (p.stage === "Leaf") p.stage = "Bud";
  else if (p.stage === "Bud") p.stage = "Flower";
  else { toast(`${p.name} is already in full bloom!`); return; }
  saveState();
  renderRoster();
  toast(`${p.name} bloomed into a ${p.stage}!`);
}

function trainPikmin(p) {
  if (p.level >= 10) { toast(`${p.name} is at max level!`); return; }
  p.level += 1;
  saveState();
  renderRoster();
  toast(`${p.name} trained — now level ${p.level}.`);
}

function dismissPikmin(p) {
  if (!confirm(`Dismiss ${p.name}? They'll return to the Onion.`)) return;
  state.pikmin = state.pikmin.filter(x => x.id !== p.id);
  state.tasks.forEach(t => {
    t.assigned = (t.assigned || []).filter(id => id !== p.id);
  });
  saveState();
  renderRoster();
  renderTasks();
  toast(`${p.name} returned to the Onion.`);
}

[searchInput, filterType, filterStage, sortBy].forEach(el => {
  el.addEventListener("input", renderRoster);
  el.addEventListener("change", renderRoster);
});

/* ---------- Pikmin modal ---------- */
const pikminModal = document.getElementById("pikmin-modal");
const pikminForm = document.getElementById("pikmin-form");
const pikminTitle = document.getElementById("pikmin-modal-title");
let editingPikminId = null;

document.getElementById("add-pikmin").addEventListener("click", () => openPikminModal());

function openPikminModal(p) {
  editingPikminId = p ? p.id : null;
  pikminTitle.textContent = p ? "Edit Pikmin" : "Recruit Pikmin";
  pikminForm.reset();
  if (p) {
    pikminForm.name.value = p.name;
    pikminForm.type.value = p.type;
    pikminForm.stage.value = p.stage;
    pikminForm.level.value = p.level;
    pikminForm.notes.value = p.notes || "";
  } else {
    pikminForm.type.value = "Red";
    pikminForm.stage.value = "Leaf";
    pikminForm.level.value = 1;
  }
  pikminModal.classList.remove("hidden");
  pikminForm.name.focus();
}

pikminForm.addEventListener("submit", e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(pikminForm));
  data.level = Math.max(1, Math.min(10, parseInt(data.level, 10) || 1));
  data.name = data.name.trim();
  if (!data.name) return;

  if (editingPikminId) {
    const p = state.pikmin.find(x => x.id === editingPikminId);
    Object.assign(p, data);
    toast(`${p.name} updated.`);
  } else {
    state.pikmin.push({ id: uid(), created: Date.now(), ...data });
    toast(`Welcome, ${data.name}!`);
  }
  saveState();
  renderRoster();
  renderDashboard();
  refreshTaskAssignedOptions();
  pikminModal.classList.add("hidden");
});

/* ---------- Tasks ---------- */
const taskModal = document.getElementById("task-modal");
const taskForm = document.getElementById("task-form");
const taskTitle = document.getElementById("task-modal-title");
let editingTaskId = null;

document.getElementById("add-task").addEventListener("click", () => openTaskModal());

function openTaskModal(t) {
  editingTaskId = t ? t.id : null;
  taskTitle.textContent = t ? "Edit Task" : "New Task";
  refreshTaskAssignedOptions(t);
  taskForm.reset();
  if (t) {
    taskForm.title.value = t.title;
    taskForm.description.value = t.description || "";
    taskForm.requiredType.value = t.requiredType || "";
    taskForm.status.value = t.status;
    Array.from(taskForm.assigned.options).forEach(opt => {
      opt.selected = (t.assigned || []).includes(opt.value);
    });
  } else {
    taskForm.status.value = "todo";
  }
  taskModal.classList.remove("hidden");
  taskForm.title.focus();
}

function refreshTaskAssignedOptions() {
  const sel = taskForm.assigned;
  const current = new Set(Array.from(sel.selectedOptions).map(o => o.value));
  sel.innerHTML = state.pikmin
    .map(p => `<option value="${p.id}" ${current.has(p.id) ? "selected" : ""}>${escapeHtml(p.name)} (${p.type})</option>`)
    .join("");
}

taskForm.addEventListener("submit", e => {
  e.preventDefault();
  const fd = new FormData(taskForm);
  const data = {
    title: fd.get("title").trim(),
    description: fd.get("description").trim(),
    requiredType: fd.get("requiredType"),
    status: fd.get("status"),
    assigned: Array.from(taskForm.assigned.selectedOptions).map(o => o.value),
  };
  if (!data.title) return;

  if (editingTaskId) {
    const t = state.tasks.find(x => x.id === editingTaskId);
    Object.assign(t, data);
    toast("Task updated.");
  } else {
    state.tasks.push({ id: uid(), created: Date.now(), ...data });
    toast("Task added.");
  }
  saveState();
  renderTasks();
  renderDashboard();
  taskModal.classList.add("hidden");
});

function renderTasks() {
  document.querySelectorAll(".task-list").forEach(ul => ul.innerHTML = "");
  state.tasks.forEach(t => {
    const ul = document.querySelector(`.task-list[data-status="${t.status}"]`);
    if (!ul) return;
    const assigned = (t.assigned || [])
      .map(id => state.pikmin.find(p => p.id === id))
      .filter(Boolean);
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.status = t.status;
    li.dataset.id = t.id;
    li.innerHTML = `
      <div class="task-title">${escapeHtml(t.title)}</div>
      ${t.description ? `<div class="task-desc">${escapeHtml(t.description)}</div>` : ""}
      <div class="task-meta">
        ${t.requiredType ? `<span class="pill type-pill" style="background:${TYPE_BY_NAME[t.requiredType].color}">${t.requiredType}</span>` : ""}
        <span class="pill">${assigned.length} assigned</span>
        ${assigned.length ? `<span>${assigned.map(a => escapeHtml(a.name)).join(", ")}</span>` : ""}
      </div>
      <div class="task-actions">
        ${t.status !== "todo" ? `<button class="btn small ghost" data-act="todo">↩ To Do</button>` : ""}
        ${t.status !== "active" ? `<button class="btn small ghost" data-act="active">▶ Start</button>` : ""}
        ${t.status !== "done" ? `<button class="btn small ghost" data-act="done">✓ Done</button>` : ""}
        <button class="btn small ghost" data-act="edit">Edit</button>
        <button class="btn small danger" data-act="del">Delete</button>
      </div>
    `;
    ul.appendChild(li);
  });
}

document.querySelectorAll(".task-list").forEach(ul => {
  ul.addEventListener("click", e => {
    const btn = e.target.closest("button[data-act]");
    if (!btn) return;
    const li = btn.closest(".task-item");
    const t = state.tasks.find(x => x.id === li.dataset.id);
    if (!t) return;
    const act = btn.dataset.act;
    if (act === "edit") return openTaskModal(t);
    if (act === "del") {
      if (!confirm(`Delete "${t.title}"?`)) return;
      state.tasks = state.tasks.filter(x => x.id !== t.id);
    } else {
      t.status = act;
    }
    saveState();
    renderTasks();
    renderDashboard();
  });
});

/* ---------- Modal close ---------- */
document.querySelectorAll(".modal").forEach(m => {
  m.addEventListener("click", e => {
    if (e.target === m || e.target.matches("[data-close]")) m.classList.add("hidden");
  });
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") document.querySelectorAll(".modal").forEach(m => m.classList.add("hidden"));
});

/* ---------- Dashboard ---------- */
function renderDashboard() {
  document.getElementById("stat-total").textContent = state.pikmin.length;
  document.getElementById("stat-flower").textContent = state.pikmin.filter(p => p.stage === "Flower").length;
  document.getElementById("stat-tasks").textContent = state.tasks.filter(t => t.status !== "done").length;
  document.getElementById("stat-done").textContent = state.tasks.filter(t => t.status === "done").length;

  const counts = Object.fromEntries(PIKMIN_TYPES.map(t => [t.name, 0]));
  state.pikmin.forEach(p => { if (counts[p.type] !== undefined) counts[p.type]++; });
  const max = Math.max(1, ...Object.values(counts));
  document.getElementById("type-bars").innerHTML = PIKMIN_TYPES.map(t => `
    <div class="type-bar">
      <span>${t.emoji} ${t.name}</span>
      <div class="bar"><div style="width:${(counts[t.name] / max) * 100}%; background:${t.color}"></div></div>
      <span>${counts[t.name]}</span>
    </div>
  `).join("");

  const stages = { Leaf: 0, Bud: 0, Flower: 0 };
  state.pikmin.forEach(p => stages[p.stage] = (stages[p.stage] || 0) + 1);
  const total = Math.max(1, state.pikmin.length);
  const stageColors = { Leaf: "#6fa84a", Bud: "#c79d3a", Flower: "#d65d8e" };
  document.getElementById("stage-breakdown").innerHTML = `
    <div class="stage-breakdown">
      ${["Leaf", "Bud", "Flower"].map(s =>
        `<div style="flex:${stages[s]}; background:${stageColors[s]}" title="${s}: ${stages[s]}"></div>`
      ).join("")}
    </div>
    <div class="stage-legend">
      ${["Leaf", "Bud", "Flower"].map(s =>
        `<span><span class="dot" style="background:${stageColors[s]}"></span>${s}: ${stages[s]} (${Math.round(stages[s] / total * 100)}%)</span>`
      ).join("")}
    </div>
  `;

  const top = [...state.pikmin].sort((a, b) => b.level - a.level).slice(0, 5);
  document.getElementById("top-performers").innerHTML = top.length
    ? top.map(p => `<li><strong>${escapeHtml(p.name)}</strong> — ${p.type} • Lv ${p.level} • ${p.stage}</li>`).join("")
    : `<li class="muted">Train your Pikmin to see top performers.</li>`;

  document.getElementById("tips").innerHTML = generateTips().map(t => `<li>${t}</li>`).join("");
}

function generateTips() {
  const tips = [];
  if (state.pikmin.length === 0) {
    tips.push("Head to the <strong>Onion</strong> and pluck your first Pikmin.");
    return tips;
  }
  const counts = Object.fromEntries(PIKMIN_TYPES.map(t => [t.name, 0]));
  state.pikmin.forEach(p => counts[p.type]++);
  const missing = PIKMIN_TYPES.filter(t => counts[t.name] === 0).map(t => t.name);
  if (missing.length) tips.push(`Diversify: you're missing ${missing.slice(0, 3).join(", ")}.`);
  const leafCount = state.pikmin.filter(p => p.stage === "Leaf").length;
  if (leafCount > 5) tips.push(`${leafCount} Leaf Pikmin could grow stronger — try "Grow" on them.`);
  const lowLvl = state.pikmin.filter(p => p.level < 3).length;
  if (lowLvl > 0) tips.push(`${lowLvl} Pikmin are below level 3 — get them training!`);
  const idle = state.pikmin.filter(p => !state.tasks.some(t => t.status !== "done" && (t.assigned || []).includes(p.id))).length;
  if (idle > 0 && state.tasks.length > 0) tips.push(`${idle} Pikmin are idle. Assign them to a task.`);
  if (state.tasks.filter(t => t.status === "active").length > 5) tips.push("Many tasks are in progress — focus on finishing some before starting new ones.");
  if (tips.length === 0) tips.push("Squad is in great shape, Captain!");
  return tips;
}

/* ---------- Onion ---------- */
const onionGrid = document.getElementById("onion-grid");
function renderOnion() {
  onionGrid.innerHTML = PIKMIN_TYPES.map(t => `
    <div class="onion-card">
      <div class="pikmin-avatar">${pikminSvg(t.name, "Leaf")}</div>
      <strong>${t.emoji} ${t.name}</strong>
      <div class="ability">${t.ability}</div>
      <button class="btn primary small" data-pluck="${t.name}">Pluck</button>
    </div>
  `).join("");
}
renderOnion();

onionGrid.addEventListener("click", e => {
  const btn = e.target.closest("button[data-pluck]");
  if (!btn) return;
  const type = btn.dataset.pluck;
  const name = randomName(type);
  state.pikmin.push({
    id: uid(), created: Date.now(),
    name, type, stage: "Leaf", level: 1, notes: "",
  });
  saveState();
  renderRoster();
  renderDashboard();
  refreshTaskAssignedOptions();
  toast(`${name} plucked!`);
});

document.getElementById("reset-all").addEventListener("click", () => {
  if (!confirm("Reset all data? This cannot be undone.")) return;
  state = defaultState();
  saveState();
  captainInput.value = "";
  renderRoster();
  renderTasks();
  renderDashboard();
  toast("All data reset.");
});

/* ---------- Helpers ---------- */
const NAME_POOL = [
  "Pip", "Sprout", "Bloom", "Twig", "Pebble", "Root", "Mossy", "Fern",
  "Petal", "Sunny", "Acorn", "Drizzle", "Ember", "Frost", "Glimmer",
  "Hazel", "Iggy", "Juno", "Kibo", "Loam", "Mango", "Nimbus", "Olly",
  "Poppy", "Quill", "Reed", "Sage", "Tansy", "Umbra", "Vine", "Willow",
];
function randomName(type) {
  const base = NAME_POOL[Math.floor(Math.random() * NAME_POOL.length)];
  const used = new Set(state.pikmin.map(p => p.name));
  let name = `${base} the ${type}`;
  let i = 2;
  while (used.has(name)) name = `${base} the ${type} #${i++}`;
  return name;
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

/* ---------- Initial render ---------- */
renderRoster();
renderTasks();
renderDashboard();
