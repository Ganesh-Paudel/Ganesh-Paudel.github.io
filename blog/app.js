'use strict';
const $ = (selector) => document.querySelector(selector);
const menu = $('.menu-toggle');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  $('.header nav').classList.toggle('open', open);
});
$('.header nav').addEventListener('click', (event) => {
  if (event.target.closest('a')) { $('.header nav').classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); }
});
const phases = {
  before: ['PREPARE & BUILD CONNECTIONS', 'Build the network before you need it.', 'Emergency workers need to know satellite information is available and understand how to use it. Training, communication, hazard mapping, and continued cooperation help teams prepare before an emergency happens.', 'THE PRIORITY → SHARED KNOWLEDGE'],
  during: ['OBSERVE & SUPPORT RESPONSE', 'Turn a wider view into local understanding.', 'Space agencies collect observations. Specialists identify affected areas and share their analysis with disaster management organizations. Local teams combine those findings with information about communities to support emergency decisions.', 'THE PRIORITY → USEFUL INFORMATION'],
  after: ['RECOVER & LEARN', 'Keep the connection going.', 'Maps of affected communities can inform recovery plans and relief payments. Continued cooperation and feedback from the people using the information help improve support systems and prepare the network for future disasters.', 'THE PRIORITY → LASTING COOPERATION']
};
const tabs = [...document.querySelectorAll('[data-phase]')];
function selectPhase(tab, focus = false) {
  tabs.forEach(t => { t.setAttribute('aria-selected', String(t === tab)); t.tabIndex = t === tab ? 0 : -1; });
  const values = phases[tab.dataset.phase];
  ['#phase-label', '#phase-title', '#phase-description', '#phase-footer'].forEach((id, index) => { $(id).textContent = values[index]; });
  $('#phase-panel').setAttribute('aria-labelledby', tab.id);
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectPhase(tab));
  tab.addEventListener('keydown', (event) => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectPhase(tabs[next], true); }
  });
});
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); reveal.unobserve(entry.target); } }), { threshold: 0.06 });
  document.querySelectorAll('.quick-item,.chapter,.end-note').forEach(el => { el.classList.add('reveal'); reveal.observe(el); });
}
const chapterLinks = [...document.querySelectorAll('.contents>a')];
let ticking = false;
function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const percent = max > 0 ? Math.min(100, Math.round(scrollY / max * 100)) : 100;
  $('#progress').style.width = percent + '%'; $('#side-progress').style.width = percent + '%'; $('#read-percent').textContent = percent + '% explored';
  let active = chapterLinks[0];
  chapterLinks.forEach(link => { if ($(link.getAttribute('href')).getBoundingClientRect().top < innerHeight * .4) active = link; });
  chapterLinks.forEach(link => { link.classList.toggle('active', link === active); if (link === active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; } }, { passive: true });
addEventListener('resize', updateProgress); updateProgress();
$('#motion-toggle').addEventListener('click', () => {
  const paused = document.documentElement.classList.toggle('motion-paused');
  $('#motion-toggle').textContent = paused ? 'Resume animations ▷' : 'Pause animations ◫';
  $('#motion-toggle').setAttribute('aria-pressed', String(paused));
  if (paused) document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
});
document.querySelectorAll('.quiz-options button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.quiz-options button').forEach(el => { el.classList.remove('correct', 'incorrect'); el.setAttribute('aria-pressed', String(el === button)); });
  const correct = button.dataset.correct === 'true';
  button.classList.add(correct ? 'correct' : 'incorrect');
  $('#quiz-feedback').textContent = correct ? 'Exactly. Combining flood extent with census data helped show the impact on people and homes.' : 'Try again. Think about what connects a map of floodwater with the people living there.';
}));
$('#share').addEventListener('click', async () => {
  const url = location.href.split('#')[0] + '#story';
  try { await navigator.clipboard.writeText(url); $('#share-status').textContent = 'Link copied!'; }
  catch { $('#share-status').textContent = 'Copy this address: ' + url; }
});
