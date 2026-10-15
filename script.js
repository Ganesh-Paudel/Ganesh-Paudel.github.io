'use strict';

const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-links');

function closeMenu() {
  navigation.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}

menu.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    closeMenu();
    menu.focus();
  }
});

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.getElementById('motion-toggle');
let paused = motionPreference.matches;
const revealObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06 })
  : null;

function revealElements(elements) {
  if (!revealObserver || paused) return;
  elements.forEach(element => {
    element.classList.add('reveal');
    revealObserver.observe(element);
  });
}

function applyMotion() {
  document.documentElement.classList.toggle('motion-paused', paused);
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.textContent = paused ? 'Resume animations' : 'Pause animations';
  if (paused) {
    document.querySelectorAll('.reveal').forEach(element => {
      element.classList.add('visible');
      if (revealObserver) revealObserver.unobserve(element);
    });
  }
}
motionButton.addEventListener('click', () => {
  paused = !paused;
  applyMotion();
});
motionPreference.addEventListener('change', event => {
  paused = event.matches;
  applyMotion();
});
applyMotion();
revealElements(document.querySelectorAll('.section-title, .section-copy, .section-heading, .skill-category, .blog-feature, .contact-section'));

// Text nodes keep project JSON from being interpreted as HTML.
function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

async function loadProjects() {
  const container = document.getElementById('project-container');
  try {
    const response = await fetch('./projects.json');
    if (!response.ok) throw new Error('Projects could not be loaded.');
    const projects = await response.json();
    if (!Array.isArray(projects)) throw new Error('Invalid project data.');
    const cards = projects.map((project, index) => {
      const card = element('article', undefined, 'project-card');
      const topline = element('div', undefined, 'project-topline');
      topline.append(element('span', String(index + 1).padStart(2, '0') + ' / PROJECT'));
      const statusClass = project.status === 'Completed' ? 'project-status' : 'project-status in-progress';
      topline.append(element('span', project.status, statusClass));
      card.append(topline, element('h3', project.title), element('p', project.description));
      const features = element('ul');
      project.features.forEach(feature => features.append(element('li', feature)));
      const tags = element('div', undefined, 'tech-tags');
      project.techStack.forEach(tech => tags.append(element('span', tech)));
      const link = element('a', 'View project ↗', 'project-link');
      const url = new URL(project.link, location.href);
      if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Invalid project link.');
      link.href = url.href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      card.append(features, tags, link);
      return card;
    });
    container.replaceChildren(...cards);
    revealElements(cards);
  } catch (error) {
    const message = element('p', 'Projects are unavailable right now. Explore the collection on ', 'project-error');
    const link = element('a', 'GitHub ↗');
    link.href = 'https://github.com/Ganesh-Paudel';
    message.append(link, document.createTextNode('.'));
    container.replaceChildren(message);
    console.error('Error loading projects:', error);
  }
}
loadProjects();

const links = [...document.querySelectorAll('.nav-links a')];
let scheduled = false;
function updateReadingPosition() {
  const scrollable = document.documentElement.scrollHeight - innerHeight;
  const progress = scrollable > 0 ? Math.min(100, Math.max(0, scrollY / scrollable * 100)) : 0;
  document.querySelector('.reading-progress').style.width = progress + '%';
  let active;
  links.forEach(link => {
    if (document.querySelector(link.hash).getBoundingClientRect().top <= innerHeight * .4) active = link;
  });
  links.forEach(link => {
    if (link === active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scheduled = false;
}
addEventListener('scroll', () => {
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(updateReadingPosition);
  }
}, { passive: true });
addEventListener('resize', updateReadingPosition);
updateReadingPosition();
