/* ══════════ WEEK SPLIT ══════════ */
function renderSplitStrip() {
  const strip = document.getElementById('splitStrip');
  strip.innerHTML = WEEK_SPLIT.map(d => {
    const isToday = d.day === TODAY_NAME;
    return `<div class="split-card ${d.rest?'rest':''}" style="${isToday?'border-color:var(--pepper);background:var(--pepper-pale);':''}">
      <div class="split-day" style="${isToday?'color:var(--pepper-deep);':''}">${d.day.slice(0,3)}${isToday?' &middot; today':''}</div>
      <div class="split-focus">${d.focus}</div>
      <div class="split-note">${d.note}</div>
    </div>`;
  }).join('');
}

/* ══════════ COMPLETION LOG (localStorage, keyed by date) ══════════ */
const LOG_KEY = 'naijaFuelWorkoutLog';
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
let log = {};
try { log = JSON.parse(localStorage.getItem(LOG_KEY) || '{}'); } catch(e) { log = {}; }
function saveLog() { try { localStorage.setItem(LOG_KEY, JSON.stringify(log)); } catch(e) {} }
function isDone(id) { return (log[todayKey()] || []).includes(id); }

function toggleDone(id) {
  const key = todayKey();
  const list = log[key] || [];
  log[key] = list.includes(id) ? list.filter(x=>x!==id) : [...list, id];
  saveLog();
  renderExerciseGrid(currentFilter);
  renderProgress();
}

function renderProgress() {
  const doneCount = (log[todayKey()] || []).length;
  document.getElementById('doneCount').textContent = doneCount;
  document.getElementById('totalCount').textContent = WORKOUTS.length;
}

function resetToday() {
  if (!(log[todayKey()] || []).length) { showToast("You haven't logged anything today."); return; }
  if (!confirm("Clear today's completed exercises?")) return;
  log[todayKey()] = [];
  saveLog();
  renderExerciseGrid(currentFilter);
  renderProgress();
  showToast("Today's log cleared.");
}

/* ══════════ EXERCISE GRID ══════════ */
let currentFilter = 'all';
function renderExerciseGrid(goal) {
  currentFilter = goal;
  const grid = document.getElementById('exerciseGrid');
  const items = goal === 'all' ? WORKOUTS : WORKOUTS.filter(w => w.goals.includes(goal));
  grid.innerHTML = items.map(w => {
    const done = isDone(w.id);
    return `<div class="item-card">
      <div class="top">
        ${monogram(w)}
        <span class="goal-tag ${w.goals[0]}">${GOAL_LABELS[w.goals[0]]}</span>
      </div>
      <h3>${w.name}</h3>
      <p>${w.desc}</p>
      <div class="item-macros">
        <span><strong>${w.sets}</strong> sets</span>
        <span><strong>${w.reps}</strong> reps</span>
        <span><strong>${w.equip}</strong></span>
      </div>
      <div class="check-row">
        <button class="check-toggle ${done?'done':''}" onclick="toggleDone('${w.id}')">
          ${ICON.check}<span>${done?'Done today':'Mark done'}</span>
        </button>
      </div>
    </div>`;
  }).join('');
}

function filterWorkouts(goal, btn) {
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderExerciseGrid(goal);
}

renderSplitStrip();
renderExerciseGrid('all');
renderProgress();
document.getElementById('workoutCount').textContent = WORKOUTS.length;
