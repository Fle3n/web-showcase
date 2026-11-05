import { products, services, recommendDrink, telegram } from './data.js';
import { money } from './ui.js';

export function initAssistant(site) {
  const settings = {
    coffee: { name: 'Ваш бариста', subtitle: 'Найдём напиток под настроение', symbol: '✳', greeting: 'Привет! Помогу разобраться в меню и подобрать напиток. Какой вкус вам сегодня хочется?', chips: ['Что-нибудь нежное', 'Без молока', 'Без кофе до 300 ₽', 'Что есть из выпечки?'] },
    clinic: { name: 'Координатор Линии', subtitle: 'Услуги, стоимость и планирование визита', symbol: '⌁', greeting: 'Здравствуйте! Помогу найти информацию об услугах и запланировать демовизит. С чего начнём?', chips: ['Первый визит', 'Стоимость услуг', 'Записаться', 'Я боюсь приёма'] },
    flow: { name: 'Архитектор проекта', subtitle: 'От идеи — к понятному брифу', symbol: '↗', greeting: 'Привет! Расскажите о задаче: нужен сайт, Telegram-бот или автоматизация? Помогу выбрать направление и собрать бриф для разработчика.', chips: ['Сайт для бизнеса', 'Бот для записи', 'Помощник по документам', 'Как начать проект?'] },
  }[site];
  if (!settings) return;
  let originFocus;
  const root = document.createElement('div');
  root.className = 'assistant-root';
  root.innerHTML = `
    <button class="assistant-launcher" aria-label="Открыть помощника" title="${settings.name}" aria-expanded="false" aria-controls="site-assistant"><span class="assistant-launcher-symbol" aria-hidden="true">${settings.symbol}</span><span><strong>Помочь выбрать?</strong><small>${settings.name}</small></span><span class="launcher-arrow" aria-hidden="true">↗</span></button>
    <section id="site-assistant" class="assistant-panel" aria-label="${settings.name}" hidden>
      <header class="assistant-head"><span class="assistant-avatar" aria-hidden="true">${settings.symbol}</span><div><h2>${settings.name}</h2><p>${settings.subtitle}</p></div><button class="assistant-close" aria-label="Закрыть помощника">×</button></header>
      <div class="assistant-transcript" role="log" aria-live="polite" aria-relevant="additions" tabindex="0"></div>
      <div class="assistant-chips" aria-label="Примеры вопросов"></div>
      <form class="assistant-form"><label class="sr-only" for="assistant-input">Ваш вопрос помощнику</label><input id="assistant-input" name="message" autocomplete="off" maxlength="600" placeholder="Напишите ваш вопрос…" required><button aria-label="Отправить вопрос" type="submit">↑</button></form>
      <div class="assistant-foot"><span>Помощник по данным этого сайта</span><a href="${telegram}" target="_blank" rel="noopener noreferrer">Разработчик @fle3n ↗</a></div>
    </section>`;
  document.body.append(root);
  const launcher = root.querySelector('.assistant-launcher');
  const panel = root.querySelector('.assistant-panel');
  const transcript = root.querySelector('.assistant-transcript');
  const input = root.querySelector('input');
  const chips = root.querySelector('.assistant-chips');
  let count = 0;

  function message(text, author = 'assistant', actions = []) {
    const bubble = document.createElement('div');
    bubble.className = `assistant-message ${author}`;
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    bubble.append(paragraph);
    if (actions.length) {
      const group = document.createElement('div');
      group.className = 'assistant-actions';
      for (const action of actions) {
        const button = document.createElement(action.href ? 'a' : 'button');
        button.textContent = action.label;
        if (action.href) { button.href = action.href; button.target = '_blank'; button.rel = 'noopener noreferrer'; }
        else { button.type = 'button'; button.addEventListener('click', action.run); }
        group.append(button);
      }
      bubble.append(group);
    }
    transcript.append(bubble);
    while (transcript.children.length > 40) transcript.firstElementChild.remove();
    transcript.scrollTop = transcript.scrollHeight;
  }

  function suggestions(items) {
    chips.replaceChildren();
    for (const text of items) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = text;
      button.addEventListener('click', () => ask(text));
      chips.append(button);
    }
  }

  function open(seed) {
    originFocus = document.activeElement;
    panel.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');
    root.classList.add('is-open');
    input.focus({ preventScroll: true });
    if (seed) ask(seed);
  }

  function close() {
    panel.hidden = true;
    root.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
    if (originFocus?.isConnected) originFocus.focus({ preventScroll: true }); else launcher.focus();
  }

  const connect = { label: 'Написать @fle3n ↗', href: telegram };
  const book = service => ({ label: 'Выбрать день и время ↗', run: () => { close(); document.dispatchEvent(new CustomEvent('portfolio:book', { detail: { service } })); } });
  const brief = (type, goal, selected = []) => ({ label: 'Собрать бриф ↗', run: () => { close(); document.dispatchEvent(new CustomEvent('portfolio:brief', { detail: { type, goal, selected } })); } });

  function replyCoffee(text) {
    if (/заказ|корзин|чек/.test(text)) return message('В корзине можно изменить количество, а затем скачать демонстрационный чек. Реальные заказы и платежи здесь не принимаются.', 'assistant', [{ label: 'Открыть заказ', run: () => { close(); document.dispatchEvent(new CustomEvent('portfolio:cart')); } }]);
    if (/выпеч|круасс|куки|булоч/.test(text)) return message(products.filter(item => item.category === 'bakery').map(item => `${item.name} — ${money(item.price)}`).join('\n'), 'assistant', products.filter(item => item.category === 'bakery').map(item => ({ label: item.name, run: () => { close(); document.dispatchEvent(new CustomEvent('portfolio:product', { detail: { id: item.id } })); } })));
    const budgetMatch = text.match(/(?:до|бюджет|за)\s*(\d{2,4})/);
    const preferences = { kind: /лимонад|освеж|холодн|без кофеина/.test(text) ? 'fresh' : /без кофе|не кофе|какао|матч/.test(text) ? 'no-coffee' : 'coffee', flavor: /слад|ванил|шокол|какао/.test(text) ? 'sweet' : /крепк|бодр|насыщ/.test(text) ? 'strong' : /ярк|ч[её]рн/.test(text) ? 'bright' : 'soft', milk: /без молока|ч[её]рн/.test(text) ? 'none' : /раститель|овсян|овсяное/.test(text) ? 'oat' : 'regular', budget: budgetMatch ? Number(budgetMatch[1]) : Infinity };
    const recognized = /кофе|напит|нежн|мягк|слад|молок|крепк|бодр|ярк|ванил|шокол|матч|какао|лимонад|освеж|холодн|порекомен|подбер|выбр|до\s*\d/.test(text);
    if (!recognized) return message('Могу подобрать напиток по вкусу, подсказать состав и цену или открыть корзину. Что вам ближе: нежный, крепкий, сладкий или освежающий?', 'assistant');
    const product = recommendDrink(preferences);
    if (!product) return message('В этом бюджете подходящего напитка пока нет. Фильтр-кофе стоит 190 ₽, какао без добавок — 250 ₽, лимонад — 270 ₽. Можно изменить бюджет или предпочтения.');
    message(`${product.name} — ${money(product.total)}${product.customizable ? ', 250 мл' : ''}.\n${product.flavor || product.note}${product.milk === 'oat' ? '\nВыбрано овсяное молоко (+40 ₽).' : ''}\nОбъём и молоко можно изменить перед добавлением.`, 'assistant', [{ label: `Выбрать ${product.name.toLowerCase()} ↗`, run: () => { close(); document.dispatchEvent(new CustomEvent('portfolio:product', { detail: { id: product.id, milk: product.milk } })); } }]);
    suggestions(['Покрепче', 'Что-нибудь сладкое', 'Без молока', 'Открыть корзину']);
  }

  function replyClinic(text) {
    if (/болит|боль|от[её]к|кров|температур|симптом|диагноз|таблет|лекарств/.test(text)) return message('Я помогаю с информацией об услугах и планированием визита. По описанию симптомов не определяю лечение и не назначаю препараты. Медицинские вопросы нужно обсудить с врачом. Здесь можно посмотреть демонстрацию записи.', 'assistant', [book('check')]);
    if (/стоим|цен|скольк|бюджет/.test(text)) return message(services.map(service => `${service.name} — от ${money(service.price)}`).join('\n') + '\nЦены демонстрационные. Точный объём и стоимость реального лечения определяет клиника после диагностики.', 'assistant', [book('check')]);
    if (/бою|страш|тревог/.test(text)) return message('В разделе «Первый визит» показан подход клиники: сначала разговор, затем объяснение вариантов и согласование плана. Можно начать со знакомства. В форме выберите день и удобное время.', 'assistant', [book('check')]);
    const service = /прикус|брекет|элайн|ортодонт/.test(text) ? 'ortho' : /восстан|корон|протез/.test(text) ? 'restore' : /лечен|кариес/.test(text) ? 'treatment' : 'check';
    if (/запис|при[её]м|визит|консульт|перв|осмотр|профилакт|прикус|брекет|элайн|ортодонт|восстан|корон|протез|лечен|кариес/.test(text)) {
      const info = services.find(item => item.id === service);
      return message(`${info.name}. ${info.description}\nДемонстрационная консультация: ${info.duration} минут. Выберите день, время и сохраните демовизит в календарь.`, 'assistant', [book(service)]);
    }
    message('Помогу выбрать направление, посмотреть демонстрационные цены и разобраться с записью. Клиника вымышленная, реальные медицинские услуги здесь не оказываются.', 'assistant', [book('check')]);
  }

  function replyFlow(text, original) {
    if (/цен|стоим|скольк|срок/.test(text)) return message('Стоимость и срок зависят от объёма, дизайна и интеграций. Сначала соберём короткий бриф, затем разработчик @fle3n сможет предложить конкретный объём и цену. Этот помощник не заключает договор и не обещает срок.', 'assistant', [brief('website', original), connect]);
    if (/бот|telegram|телеграм/.test(text)) return message('Для записи и заявок подойдёт Telegram-бот: собирает запрос, предлагает варианты, передаёт данные команде. Можно добавить напоминания и CRM. Я перенесу вашу задачу в сборщик брифа.', 'assistant', [brief('bot', original, ['booking', 'telegram']), connect]);
    if (/документ|баз[аеу] знан|llm|rag|ассистент|помощник|автоматизац|ии| ai/.test(text)) return message('Для такой задачи можно рассмотреть помощника по базе знаний или автоматизацию процесса. В брифе уточним источники данных, нужные функции и ожидаемый результат. Подключение к реальной модели обсуждается отдельно.', 'assistant', [brief('ai', original, ['assistant', 'knowledge']), connect]);
    if (/сайт|лендинг|магазин|каталог|бизнес/.test(text)) return message('Начнём с сайта: определим задачу, структуру и действия посетителя. Затем выберем каталог, запись, помощника и интеграции. На выходе получите бриф, который можно скачать и отправить @fle3n.', 'assistant', [brief('website', original, ['assistant', 'telegram']), connect]);
    message('Опишите результат, который нужен: получать заявки с сайта, записывать клиентов через бота или обрабатывать документы. Если пока не определились, начните с короткого брифа.', 'assistant', [brief('website', original), connect]);
  }

  function ask(raw) {
    const original = raw.trim().slice(0, 600);
    if (!original) return;
    message(original, 'user');
    input.value = '';
    count++;
    const text = original.toLowerCase().replace(/ё/g, 'е');
    if (/кто ты|как работаешь|настоящий ии|какая модель/.test(text)) message('Я локальный помощник по информации этого сайта. Подбираю ответы и действия по теме вопроса; к языковой модели не подключён. Связаться с разработчиком можно в Telegram.', 'assistant', [connect]);
    else if (/контакт|связ|разработчик|твой автор|сделал сайт|написать|whatsapp|ватсап/.test(text)) message('Этот сайт — проект для портфолио. По разработке пишите напрямую @fle3n в Telegram. Кнопка откроет личный чат; сообщение отправляете вы.', 'assistant', [connect]);
    else if (site === 'coffee') replyCoffee(text);
    else if (site === 'clinic') replyClinic(text);
    else replyFlow(text, original);
    if (count >= 20) suggestions(['Связаться с разработчиком']);
  }

  launcher.addEventListener('click', () => panel.hidden ? open() : close());
  root.querySelector('.assistant-close').addEventListener('click', close);
  root.querySelector('form').addEventListener('submit', event => { event.preventDefault(); ask(input.value); });
  root.addEventListener('keydown', event => { if (event.key === 'Escape') { event.stopPropagation(); close(); } });
  document.addEventListener('portfolio:assistant', event => open(event.detail?.question));
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-assistant]');
    if (button) open(button.dataset.question);
  });
  message(settings.greeting);
  suggestions(settings.chips);
}
