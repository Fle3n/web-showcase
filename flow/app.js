const tabs = {
  sites: { category: 'Веб-разработка', title: 'Сайт, который продолжает ваш бизнес.', description: 'Лендинги, корпоративные сайты и каталоги. С понятной структурой, аккуратным дизайном и удобной заявкой с телефона.', tags: ['Адаптивная вёрстка', 'Формы и интеграции', 'Быстрая загрузка'], caption: 'Адаптивно. Быстро. По делу.', mini: 'Первое<br>впечатление.<br><em>В точку.</em>' },
  bots: { category: 'Telegram-разработка', title: 'Бот, который берёт рутину на себя.', description: 'Запись, ответы на частые вопросы, сбор заявок и уведомления. Привычный мессенджер становится удобным инструментом для команды и клиентов.', tags: ['Заявки и запись', 'Уведомления', 'Связь с CRM'], caption: 'Всё важное — в одном чате.', mini: 'Всегда<br>на связи.<br><em>Без суеты.</em>' },
  ai: { category: 'AI и автоматизация', title: 'От потока данных к понятному действию.', description: 'Поиск по базе знаний, обработка документов и помощники для команды. Подключаем AI к конкретной задаче, задаём ограничения и проверяем результат.', tags: ['LLM и RAG', 'Обработка данных', 'Python и API'], caption: 'От данных — к решению.', mini: 'Сложное.<br>Становится<br><em>понятным.</em>' },
};
const tabButtons = [...document.querySelectorAll('[role=tab]')];
const panel = document.querySelector('#solution-panel');

function setTab(button, focus = false) {
  tabButtons.forEach(item => {
    item.setAttribute('aria-selected', String(item === button));
    item.tabIndex = item === button ? 0 : -1;
  });
  const value = tabs[button.dataset.tab];
  panel.dataset.kind = button.dataset.tab;
  panel.setAttribute('aria-labelledby', button.id);
  document.querySelector('#solution-category').textContent = value.category;
  document.querySelector('#solution-title').textContent = value.title;
  document.querySelector('#solution-description').textContent = value.description;
  document.querySelector('#solution-tags').innerHTML = value.tags.map(tag => `<span>${tag}</span>`).join('');
  document.querySelector('.floating-label').textContent = value.caption;
  document.querySelector('.mini-page strong').innerHTML = value.mini;
  panel.classList.remove('panel-enter');
  requestAnimationFrame(() => panel.classList.add('panel-enter'));
  if (focus) button.focus();
}

tabButtons.forEach((button, index) => {
  button.addEventListener('click', () => setTab(button));
  button.addEventListener('keydown', event => {
    let next;
    if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (index + 1) % tabButtons.length;
    if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (index - 1 + tabButtons.length) % tabButtons.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabButtons.length - 1;
    if (next !== undefined) { event.preventDefault(); setTab(tabButtons[next], true); }
  });
});

const tasks = document.querySelector('#tasks');
const minutes = document.querySelector('#minutes');
function calculate() {
  document.querySelector('#tasks-value').textContent = tasks.value;
  document.querySelector('#minutes-value').textContent = minutes.value;
  const hours = Number(tasks.value) * Number(minutes.value) * 22 * .7 / 60;
  document.querySelector('#hours').textContent = hours.toLocaleString('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  tasks.style.setProperty('--range-fill', `${(Number(tasks.value) - 5) / 95 * 100}%`);
  minutes.style.setProperty('--range-fill', `${(Number(minutes.value) - 1) / 29 * 100}%`);
}
tasks.addEventListener('input', calculate);
minutes.addEventListener('input', calculate);
calculate();

const workflow = [...document.querySelectorAll('.workflow li')];
const runButton = document.querySelector('#run-demo');
const demoInput = document.createElement('label');
demoInput.className = 'workflow-input field';
demoInput.innerHTML = 'Ваша заявка<input id="workflow-request" maxlength="260" value="Нужен сайт для мастерской с заявками в Telegram" aria-label="Текст демонстрационной заявки">';
runButton.before(demoInput);
workflow[2].querySelector('strong').textContent = 'Собрать карточку проекта';
workflow[3].querySelector('strong').textContent = 'Подготовить уведомление';
let running = false;
let parsed;

runButton.addEventListener('click', async () => {
  if (running) return;
  const request = demoInput.querySelector('input').value.trim();
  if (!request) { demoInput.querySelector('input').focus(); return; }
  parsed = { type: /бот/i.test(request) ? 'bot' : /AI|ИИ|документ|автоматизац|помощник/i.test(request) ? 'ai' : 'website', goal: request, selected: [] };
  if (/запис/i.test(request)) parsed.selected.push('booking');
  if (/telegram|телеграм/i.test(request)) parsed.selected.push('telegram');
  if (/CRM|срм/i.test(request)) parsed.selected.push('crm');
  if (/каталог|товар/i.test(request)) parsed.selected.push('catalog');
  if (/помощник|ассистент/i.test(request)) parsed.selected.push('assistant');
  const label = { bot: 'Telegram-бот', ai: 'AI и автоматизация', website: 'Сайт для бизнеса' }[parsed.type];
  workflow[0].querySelector('div > span').textContent = `«${request}»`;
  workflow[1].querySelector('div > span').textContent = `Направление: ${label}`;
  workflow[2].querySelector('div > span').textContent = `${parsed.selected.length} выбранных функций · задача сохранена в бриф`;
  workflow[3].querySelector('div > span').textContent = 'Готово для передачи разработчику';
  running = true;
  runButton.disabled = true;
  document.querySelector('#demo-state').textContent = 'ВЫПОЛНЯЕТСЯ';
  document.querySelector('#demo-result').textContent = 'Разбираем демонстрационную заявку…';
  document.querySelector('.system-visual').classList.add('workflow-running');
  workflow.forEach(step => { step.classList.remove('complete', 'working'); step.querySelector('b').textContent = '—'; });
  for (const step of workflow) {
    step.classList.add('working');
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) await new Promise(resolve => setTimeout(resolve, 500));
    step.classList.remove('working');
    step.classList.add('complete');
    step.querySelector('b').textContent = '✓';
  }
  document.querySelector('#demo-state').textContent = 'ЗАВЕРШЕНО';
  const result = document.querySelector('#demo-result');
  result.replaceChildren(document.createTextNode('Карточка готова. Внешним сервисам ничего не отправлено. '));
  const action = document.createElement('button');
  action.className = 'workflow-brief-link';
  action.textContent = 'Продолжить с этой задачей ↗';
  action.addEventListener('click', () => document.dispatchEvent(new CustomEvent('portfolio:brief', { detail: parsed })));
  result.append(action);
  document.querySelector('.system-visual').classList.remove('workflow-running');
  runButton.disabled = false;
  runButton.innerHTML = 'Запустить ещё раз <span>↻</span>';
  running = false;
});
