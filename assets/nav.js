/* ══════════ NAV / FOOTER BEHAVIOUR (shared across pages) ══════════ */
(function(){
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');
  const scrim = document.getElementById('mobileScrim');
  const close = document.getElementById('navClose');
  function open(){ menu.classList.add('open'); scrim.classList.add('open'); document.body.style.overflow='hidden'; }
  function shut(){ menu.classList.remove('open'); scrim.classList.remove('open'); document.body.style.overflow=''; }
  if (toggle) toggle.addEventListener('click', open);
  if (close) close.addEventListener('click', shut);
  if (scrim) scrim.addEventListener('click', shut);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });

  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* ══════════ TOAST (shared) ══════════ */
function showToast(msg, isError) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.toggle('error', !!isError);
  t.classList.add('visible');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=>t.classList.remove('visible'), 3200);
}
