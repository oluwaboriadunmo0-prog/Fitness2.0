function renderMealGrid() {
  const grid = document.getElementById('mealGrid');
  grid.innerHTML = MEALS.map(m => `
    <div class="item-card" data-goals="${m.goals.join(',')}">
      <div class="top">
        ${monogram(m)}
        <span class="goal-tag ${m.goals[0]}">${GOAL_LABELS[m.goals[0]]}</span>
      </div>
      <h3>${m.name}</h3>
      <p>${m.desc}</p>
      <div class="item-macros">
        <span><strong>${m.cal}</strong> kcal</span>
        <span><strong>${m.protein}g</strong> protein</span>
      </div>
    </div>`).join('');
}

function filterMeals(goal, btn) {
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#mealGrid .item-card').forEach(card => {
    const goals = card.dataset.goals.split(',');
    card.style.display = (goal==='all' || goals.includes(goal)) ? '' : 'none';
  });
}

renderMealGrid();
document.getElementById('mealCount').textContent = MEALS.length;
