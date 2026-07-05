/* ══════════ STATE (localStorage) ══════════ */
const STORAGE_KEY = 'naijaFuelPlan';
let plan = [];
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  plan = saved ? JSON.parse(saved) : [];
} catch(e) { plan = []; }

function savePlan() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(plan)); } catch(e) {}
}

/* ══════════ INIT SELECTS ══════════ */
const daySelect = document.getElementById('day');
DAYS.forEach(d => { const o=document.createElement('option'); o.textContent=d; daySelect.appendChild(o); });
daySelect.value = TODAY_NAME;

function mealsForGoal(goal) { return MEALS.filter(m => m.goals.includes(goal)); }

function populateMealChoice() {
  const goal = document.getElementById('goal').value;
  const sel = document.getElementById('mealChoice');
  sel.innerHTML = '';
  mealsForGoal(goal).forEach(m => {
    const o = document.createElement('option');
    o.value = m.id; o.textContent = m.name;
    sel.appendChild(o);
  });
  updateMealPreview();
}

function updateMealPreview() {
  const id = document.getElementById('mealChoice').value;
  const m = MEALS.find(x => x.id === id);
  const box = document.getElementById('mealPreview');
  if (!m) { box.innerHTML = ''; return; }
  box.innerHTML = `
    ${monogram(m)}
    <div>
      <h4>${m.name}</h4>
      <p>${m.desc}</p>
      <div class="cals">${m.cal} kcal &middot; ${m.protein}g protein</div>
    </div>`;
}

/* ══════════ FORM SUBMIT ══════════ */
document.getElementById('goal').addEventListener('change', () => { populateMealChoice(); updateGoalTip(); updateSuggestion(); });
document.getElementById('mealChoice').addEventListener('change', updateMealPreview);

document.getElementById('mealForm').addEventListener('submit', e => {
  e.preventDefault();
  const day = document.getElementById('day').value;
  const mealType = document.getElementById('mealType').value;
  const mealId = document.getElementById('mealChoice').value;
  const meal = MEALS.find(m => m.id === mealId);
  if (!meal) return;

  plan.push({ id: Date.now()+Math.random(), day, mealType, mealId });
  savePlan();
  renderAll();
  showToast(`Added ${meal.name} to ${day}.`);
});

/* ══════════ GOAL TIP + SUGGESTION ══════════ */
function updateGoalTip() {
  const goal = document.getElementById('goal').value;
  document.getElementById('goalTip').innerHTML = `<strong>Tip.</strong> ${GOAL_TIPS[goal]}`;
}

let lastSuggestionId = null;
function updateSuggestion() {
  const goal = document.getElementById('goal').value;
  const options = mealsForGoal(goal);
  let pick = options[Math.floor(Math.random()*options.length)];
  if (options.length > 1 && pick.id === lastSuggestionId) {
    pick = options[(options.indexOf(pick)+1) % options.length];
  }
  lastSuggestionId = pick.id;
  document.getElementById('suggestionCard').innerHTML = `
    <div class="suggestion-card">
      ${monogram(pick,'sm')}
      <div>
        <h4>${pick.name}</h4>
        <p>${pick.desc}</p>
        <p style="margin-top:4px;font-weight:700;color:var(--pepper);font-size:12px;">${pick.cal} kcal &middot; ${pick.protein}g protein</p>
      </div>
    </div>`;
}
document.getElementById('suggestMeal').addEventListener('click', updateSuggestion);

/* ══════════ RENDER PLAN TABLE ══════════ */
function renderPlanTable() {
  const tbody = document.getElementById('planBody');
  if (plan.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="5">No meals added yet — build your first day on the left.</td></tr>`;
    return;
  }
  const order = { Breakfast:0, Lunch:1, Dinner:2, Snack:3 };
  const sorted = [...plan].sort((a,b) => DAYS.indexOf(a.day)-DAYS.indexOf(b.day) || order[a.mealType]-order[b.mealType]);
  tbody.innerHTML = sorted.map(entry => {
    const meal = MEALS.find(m => m.id === entry.mealId);
    if (!meal) return '';
    return `<tr>
      <td class="row-badge">${entry.day}</td>
      <td><span class="row-tag">${entry.mealType}</span></td>
      <td>${meal.name}</td>
      <td class="cal-val">${meal.cal}</td>
      <td><button class="remove-btn" onclick="removeEntry('${entry.id}')" aria-label="Remove ${meal.name} from plan">${ICON.close}</button></td>
    </tr>`;
  }).join('');
}

function removeEntry(id) {
  plan = plan.filter(e => String(e.id) !== String(id));
  savePlan();
  renderAll();
  showToast('Meal removed from plan.');
}

/* ══════════ STATS ══════════ */
function renderStats() {
  document.getElementById('totalMeals').textContent = plan.length;
  const totalCal = plan.reduce((sum,e) => { const m = MEALS.find(x=>x.id===e.mealId); return sum + (m?m.cal:0); }, 0);
  document.getElementById('totalCalories').textContent = totalCal.toLocaleString();
  const daysUsed = new Set(plan.map(e=>e.day)).size || 1;
  document.getElementById('avgCalories').textContent = Math.round(totalCal/daysUsed).toLocaleString();
}

/* ══════════ WEEK STRIP ══════════ */
function calRing(pct, color) {
  const r = 22, c = 2*Math.PI*r;
  const offset = c - (Math.min(pct,1)*c);
  return `<svg width="56" height="56" viewBox="0 0 56 56">
    <circle cx="28" cy="28" r="${r}" fill="none" stroke="var(--line)" stroke-width="5"/>
    <circle cx="28" cy="28" r="${r}" fill="none" stroke="${color}" stroke-width="5"
      stroke-dasharray="${c}" stroke-dashoffset="${offset}" stroke-linecap="round"
      transform="rotate(-90 28 28)"/>
  </svg>`;
}

function renderWeekStrip() {
  const TARGET = 2200; // reference daily target for ring fill
  const strip = document.getElementById('weekStrip');
  strip.innerHTML = DAYS.map(day => {
    const entries = plan.filter(e => e.day === day);
    const cal = entries.reduce((s,e) => { const m=MEALS.find(x=>x.id===e.mealId); return s+(m?m.cal:0); }, 0);
    const isToday = day === TODAY_NAME;
    const pills = entries.length
      ? entries.map(e => `<span class="day-pill">${e.mealType}</span>`).join('')
      : `<span class="day-pill empty">Empty</span>`;
    return `<div class="day-card ${isToday?'today':''}" onclick="openDayModal('${day}')">
      <div class="day-name">${day.slice(0,3)}${isToday?' &middot; today':''}</div>
      <div class="day-ring-wrap">${calRing(cal/TARGET, isToday?'#E8542E':'#1F4E3D')}</div>
      <div class="day-cal"><strong>${cal}</strong>kcal</div>
      <div class="day-pills">${pills}</div>
    </div>`;
  }).join('');
}

/* ══════════ DAY MODAL ══════════ */
function openDayModal(day) {
  const entries = plan.filter(e => e.day === day);
  document.getElementById('dayModalTitle').textContent = day;
  const body = document.getElementById('dayModalBody');
  if (entries.length === 0) {
    body.innerHTML = `<p style="color:var(--muted);font-size:14px;">No meals planned for ${day} yet.</p>`;
  } else {
    const order = { Breakfast:0, Lunch:1, Dinner:2, Snack:3 };
    const sorted = [...entries].sort((a,b)=>order[a.mealType]-order[b.mealType]);
    body.innerHTML = sorted.map(e => {
      const m = MEALS.find(x=>x.id===e.mealId);
      return `<div class="modal-row">
        <span><strong>${e.mealType}</strong> — ${m.name}</span>
        <span style="color:var(--pepper);font-weight:700;">${m.cal} kcal</span>
      </div>`;
    }).join('');
    const total = sorted.reduce((s,e)=>{const m=MEALS.find(x=>x.id===e.mealId);return s+(m?m.cal:0);},0);
    body.innerHTML += `<div class="modal-row" style="border-top:2px solid var(--line);margin-top:6px;padding-top:14px;"><span style="font-weight:700;">Total</span><span style="font-weight:700;">${total} kcal</span></div>`;
  }
  document.getElementById('dayModalBg').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDayModal() { document.getElementById('dayModalBg').classList.remove('open'); document.body.style.overflow=''; }
function closeDayModalOnBg(e) { if (e.target === document.getElementById('dayModalBg')) closeDayModal(); }
document.addEventListener('keydown', e => { if (e.key==='Escape') closeDayModal(); });

/* ══════════ PLAN ACTIONS ══════════ */
function clearPlan() {
  if (plan.length === 0) { showToast('Your plan is already empty.'); return; }
  if (!confirm('Clear your entire weekly plan? This cannot be undone.')) return;
  plan = [];
  savePlan();
  renderAll();
  showToast('Weekly plan cleared.');
}

function exportPlan() {
  if (plan.length === 0) { showToast('Add some meals before exporting.', true); return; }
  const order = { Breakfast:0, Lunch:1, Dinner:2, Snack:3 };
  const sorted = [...plan].sort((a,b) => DAYS.indexOf(a.day)-DAYS.indexOf(b.day) || order[a.mealType]-order[b.mealType]);
  let text = 'NAIJA FUEL — WEEKLY MEAL PLAN\n\n';
  DAYS.forEach(day => {
    const entries = sorted.filter(e=>e.day===day);
    if (entries.length===0) return;
    text += `${day}\n`;
    entries.forEach(e => {
      const m = MEALS.find(x=>x.id===e.mealId);
      text += `  ${e.mealType}: ${m.name} (${m.cal} kcal)\n`;
    });
    text += '\n';
  });
  const blob = new Blob([text], { type:'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'naija-fuel-meal-plan.txt';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Plan exported as a text file.');
}

/* ══════════ RENDER ALL ══════════ */
function renderAll() {
  renderWeekStrip();
  renderPlanTable();
  renderStats();
}

/* ══════════ INIT ══════════ */
populateMealChoice();
updateGoalTip();
updateSuggestion();
renderAll();
