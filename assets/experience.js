import { initAssistant } from './assistant.js';
import { initBuilder } from './builder.js';
import { recommendDrink, services, telegram } from './data.js';
import { money } from './ui.js';

const site = document.body.dataset.site;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const nav = document.querySelector('.navlinks');
const menuToggle = document.querySelector('.menu-toggle');
const header = document.querySelector('.header');
const progress = document.createElement('div');
progress.className = 'reading-progress';
progress.setAttribute('aria-hidden', 'true');
document.body.append(progress);

function closeMenu() {
  nav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-open');
}
menuToggle.addEventListener('click', () => {
  const open = !nav.classList.contains('is-open');
  nav.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('nav-open', open);
});
nav.addEventListener('click', event => { if (event.target.closest('a,button')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
matchMedia('(min-width: 1041px)').addEventListener('change', closeMenu);

let ticking = false;
function updateScroll() {
  const maximum = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${maximum > 0 ? scrollY / maximum : 0})`;
  header.classList.toggle('is-scrolled', scrollY > 20);
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateScroll); ticking = true; } }, { passive: true });
addEventListener('resize', updateScroll, { passive: true });
updateScroll();

const revealSelector = '.section-heading, .story-image, .story-copy, .ritual article, .care-grid article, .visit-intro, .visit-steps article, .faq > div, .process-grid article, .demo-copy, .demo-terminal, .calc-copy, .calc-result, .taste-intro, .taste-panel, .guide-intro, .guide-workspace, .builder-workspace, .brief-preview, .closing, .coffee-end, .contact h2';
const reveals = [...document.querySelectorAll(revealSelector)];
let observer;
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }, { threshold: .08, rootMargin: '0px 0px -24px 0px' });
  reveals.forEach(element => { element.classList.add('scroll-reveal'); observer.observe(element); });
  document.body.classList.add('motion-ready');
}
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) { document.body.classList.remove('motion-ready'); observer?.disconnect(); }
});
requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('page-ready')));

if (matchMedia('(hover:hover) and (pointer:fine)').matches && !reducedMotion.matches) {
  const visual = document.querySelector('.hero-photo, .hero-visual, .system-visual');
  visual?.addEventListener('pointermove', event => {
    const rect = visual.getBoundingClientRect();
    visual.style.setProperty('--pointer-x', `${(event.clientX - rect.left - rect.width / 2) / rect.width * 8}px`);
    visual.style.setProperty('--pointer-y', `${(event.clientY - rect.top - rect.height / 2) / rect.height * 8}px`);
  }, { passive: true });
  visual?.addEventListener('pointerleave', () => { visual.style.setProperty('--pointer-x', '0px'); visual.style.setProperty('--pointer-y', '0px'); });
}

if (site === 'coffee') {
  const cart = document.createElement('button');
  cart.className = 'mobile-cart';
  cart.setAttribute('aria-label', 'Открыть заказ');
  cart.innerHTML = 'Ваш заказ <span id="mobile-cart-count">0</span> ↗';
  cart.addEventListener('click', () => document.dispatchEvent(new CustomEvent('portfolio:cart')));
  document.body.append(cart);
  cart.querySelector('span').textContent = document.querySelector('#cart-count').textContent;
  initTasteQuiz();
}
if (site === 'clinic') {
  let chosen = 'check';
  document.querySelector('.guide-choices').addEventListener('click', event => {
    const button = event.target.closest('[data-guide]');
    if (!button) return;
    chosen = button.dataset.guide;
    const service = services.find(item => item.id === chosen);
    document.querySelectorAll('[data-guide]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelector('#guide-title').textContent = service.name;
    document.querySelector('#guide-description').textContent = service.description;
    document.querySelector('#guide-duration').textContent = `${service.duration} минут · от ${money(service.price)}`;
    document.querySelector('.guide-result').animate([{ opacity: .3, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: reducedMotion.matches ? 0 : 280 });
  });
  document.querySelector('#guide-book').addEventListener('click', () => document.dispatchEvent(new CustomEvent('portfolio:book', { detail: { service: chosen } })));
}
initBuilder();
initAssistant(site);

function initTasteQuiz() {
  const body = document.querySelector('#taste-body');
  const back = document.querySelector('#taste-back');
  const questions = [
    { key: 'kind', title: 'Начнём с настроения.', note: 'Что хочется сегодня?', choices: [['coffee', '☕', 'Кофе', 'Маленькая пауза с любимым вкусом'], ['no-coffee', '◡', 'Без кофе', 'Матча или что-то шоколадное'], ['fresh', '✳', 'Освежиться', 'Цитрус, мята и немного солнца']] },
    { key: 'flavor', title: 'Какой вкус вам ближе?', note: 'Выбирайте по настроению.', choices: [['soft', '◌', 'Нежный', 'Мягкий и сбалансированный'], ['strong', '◒', 'Насыщенный', 'Почувствовать характер зерна'], ['sweet', '♡', 'Сладкий', 'Ваниль или шоколад'], ['bright', '✧', 'Яркий', 'Чистый, без лишнего']] },
    { key: 'milk', title: 'И последний штрих.', note: 'Как насчёт молока?', choices: [['regular', '◯', 'Обычное', 'Классический вариант'], ['oat', '❋', 'Овсяное', '+40 ₽ к молочному напитку'], ['none', '—', 'Без молока', 'Чистый вкус напитка']] },
  ];
  let step = 0;
  const preferences = {};

  function render() {
    document.querySelector('#taste-progress').textContent = step < 3 ? `0${step + 1} / 03` : 'ВАШ ВКУС НАЙДЕН';
    document.querySelectorAll('.quiz-track i').forEach((item, index) => item.classList.toggle('filled', index <= step));
    back.hidden = step === 0;
    if (step < 3) {
      const question = questions[step];
      body.innerHTML = `<h3>${question.title}</h3><p>${question.note}</p><div class="taste-choices">${question.choices.map(([value, icon, title, note]) => `<button data-answer="${value}" aria-pressed="${preferences[question.key] === value}"><span aria-hidden="true">${icon}</span><div><strong>${title}</strong><small>${note}</small></div><i aria-hidden="true">↗</i></button>`).join('')}</div>`;
    } else {
      const product = recommendDrink(preferences);
      body.innerHTML = `<div class="taste-result"><span class="taste-result-star" aria-hidden="true">✳</span><span class="eyebrow">Кажется, это ваше</span><h3>${product.name}</h3><p>${product.flavor}. ${product.milk === 'oat' ? 'На овсяном молоке.' : ''}</p><div class="taste-result-price">${money(product.total)}${product.customizable ? ' <span>/ 250 мл</span>' : ''}</div><button class="pill primary full" id="taste-choose">Настроить и добавить ↗</button><button class="text-link" id="taste-reset">Пройти заново ↻</button></div>`;
      body.querySelector('#taste-choose').addEventListener('click', () => document.dispatchEvent(new CustomEvent('portfolio:product', { detail: { id: product.id, milk: product.milk } })));
      body.querySelector('#taste-reset').addEventListener('click', () => { step = 0; render(); });
    }
    body.classList.remove('quiz-enter');
    requestAnimationFrame(() => body.classList.add('quiz-enter'));
  }
  body.addEventListener('click', event => {
    const button = event.target.closest('[data-answer]');
    if (!button) return;
    preferences[questions[step].key] = button.dataset.answer;
    step++;
    render();
    body.querySelector('button')?.focus({ preventScroll: true });
  });
  back.addEventListener('click', () => { step = Math.max(0, step - 1); render(); });
  render();
}
