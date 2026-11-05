import { services, telegram } from '/assets/data.js';
import { money, downloadText, copyText, wireDialog } from '/assets/ui.js';

const booking = document.querySelector('#booking');
booking.classList.add('booking-dialog');
booking.innerHTML = `
  <div class="dialog-body">
    <div class="dialog-head"><span class="eyebrow">Первый шаг к знакомству</span><button class="close" aria-label="Закрыть запись">×</button></div>
    <h2 id="booking-title">Запланируйте визит</h2>
    <ol class="booking-progress" aria-label="Этапы записи"><li class="current">01 <span>Направление</span></li><li>02 <span>Время</span></li><li>03 <span>Ваш визит</span></li></ol>
    <form id="appointment-form" novalidate>
      <div class="booking-step" data-step="0">
        <fieldset class="booking-services"><legend>С чего начнём?</legend>${services.map((service, index) => `<label class="booking-service"><input type="radio" name="service" value="${service.id}" ${index === 0 ? 'checked' : ''}><span><strong>${service.name}</strong><small>от ${money(service.price)} · ${service.duration} мин</small></span><i aria-hidden="true">↗</i></label>`).join('')}</fieldset>
        <label class="field">Удобный день<input type="date" name="date" required aria-describedby="booking-date-note"></label>
        <div class="quick-dates" aria-label="Ближайшие дни"></div>
        <p class="field-hint" id="booking-date-note">Выберите день в ближайшие 90 дней.</p>
      </div>
      <div class="booking-step" data-step="1" hidden><div class="slot-heading"><h3>Когда вам удобно?</h3><p id="slot-day"></p></div><div class="time-slots" role="group" aria-label="Время приёма"></div><p class="field-hint">Пример расписания. Реальные окна уточняет администратор клиники.</p></div>
      <div class="booking-step" data-step="2" hidden><div class="appointment-ticket"><span class="ticket-mark" aria-hidden="true">⌁</span><span class="eyebrow">Ваш демонстрационный визит</span><h3 id="appointment-service"></h3><p id="appointment-date"></p><div class="ticket-divider"></div><p id="appointment-duration"></p><small>Приём не забронирован: это интерактивный концепт клиники.</small></div><p class="field-hint">Сохраните демовизит в календарь или скопируйте детали.</p><button class="text-link" type="button" id="appointment-copy">Скопировать детали визита</button><p id="calendar-status" class="field-hint" role="status"></p></div>
      <p class="booking-error" id="booking-error" role="alert"></p>
      <div class="booking-actions"><button class="pill outline" type="button" id="booking-back" hidden>← Назад</button><button class="pill primary" type="submit" id="booking-next">Выбрать время ↗</button></div>
    </form>
    <a class="developer-link" href="${telegram}" target="_blank" rel="noopener noreferrer">Нужна такая запись на вашем сайте? @fle3n ↗</a>
  </div>`;

wireDialog(booking);
const form = booking.querySelector('form');
let step = 0;

function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formattedDay(value) {
  return new Date(value + 'T12:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'long' });
}

function selectedService() {
  return services.find(service => service.id === form.elements.service.value) || services[0];
}

function renderSlots() {
  booking.querySelector('#slot-day').textContent = formattedDay(form.elements.date.value);
  const current = new Date();
  const isToday = form.elements.date.value === localDay();
  const times = ['09:00', '10:00', '11:30', '13:00', '14:30', '16:00', '17:00', '18:30'];
  booking.querySelector('.time-slots').innerHTML = times.map(time => {
    const [hours, minutes] = time.split(':').map(Number);
    const passed = isToday && hours * 60 + minutes <= current.getHours() * 60 + current.getMinutes();
    return `<label class="time-slot ${passed ? 'unavailable' : ''}"><input type="radio" name="time" value="${time}" ${passed ? 'disabled' : ''}><span>${time}<small>${passed ? 'прошло' : `${selectedService().duration} мин`}</small></span></label>`;
  }).join('');
}

function showStep(next) {
  step = next;
  booking.querySelector('#calendar-status').textContent = '';
  booking.querySelectorAll('[data-step]').forEach(panel => { panel.hidden = Number(panel.dataset.step) !== step; });
  booking.querySelectorAll('.booking-progress li').forEach((item, index) => {
    item.classList.toggle('current', index === step);
    item.classList.toggle('completed', index < step);
    if (index === step) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current');
  });
  booking.querySelector('#booking-back').hidden = !step;
  booking.querySelector('#booking-next').textContent = ['Выбрать время ↗', 'Посмотреть визит ↗', 'Сохранить в календарь ↓'][step];
  booking.querySelector('#booking-error').textContent = '';
  if (step === 1) renderSlots();
  if (step === 2) {
    booking.querySelector('#appointment-service').textContent = selectedService().name;
    booking.querySelector('#appointment-date').textContent = `${formattedDay(form.elements.date.value)}, ${form.elements.time.value}`;
    booking.querySelector('#appointment-duration').textContent = `${selectedService().duration} минут · демонстрационная цена от ${money(selectedService().price)}`;
  }
  booking.scrollTop = 0;
}

function openBooking(serviceId) {
  const service = services.find(item => item.id === serviceId || item.name === serviceId);
  if (service) form.elements.service.value = service.id;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 90);
  form.elements.date.min = localDay();
  form.elements.date.max = localDay(maxDate);
  form.elements.date.value = localDay(tomorrow);
  booking.querySelector('.quick-dates').innerHTML = [1, 2, 3].map(offset => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return `<button type="button" data-date="${localDay(date)}">${offset === 1 ? 'Завтра' : date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</button>`;
  }).join('');
  showStep(0);
  booking.showModal();
}

function calendarFile() {
  const start = new Date(`${form.elements.date.value}T${form.elements.time.value}:00`);
  const end = new Date(start.getTime() + selectedService().duration * 60_000);
  const stamp = date => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const summary = `Демовизит · Линия · ${selectedService().name}`;
  const calendar = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Fle3n//Liniya Demo//RU', 'BEGIN:VEVENT', `UID:${Date.now()}-${Math.random().toString(36).slice(2)}@liniya.demo`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`, `SUMMARY:${summary}`, 'DESCRIPTION:Демонстрация онлайн-записи. Реальный приём не забронирован.', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  downloadText('liniya-demo-visit.ics', calendar, 'text/calendar;charset=utf-8');
  booking.querySelector('#calendar-status').textContent = 'Файл календаря подготовлен. Если браузер ограничивает скачивание по HTTP, детали визита можно скопировать.';
}

form.addEventListener('submit', event => {
  event.preventDefault();
  if (step === 0) {
    if (!form.elements.date.checkValidity()) { form.elements.date.reportValidity(); return; }
    showStep(1);
  } else if (step === 1) {
    if (!form.elements.time?.value) { booking.querySelector('#booking-error').textContent = 'Выберите удобное время.'; return; }
    showStep(2);
  } else calendarFile();
});
booking.querySelector('#booking-back').addEventListener('click', () => showStep(Math.max(0, step - 1)));
booking.querySelector('#appointment-copy').addEventListener('click', event => copyText(`Линия · демонстрационный визит\n${selectedService().name}\n${formattedDay(form.elements.date.value)}, ${form.elements.time.value}\nДлительность: ${selectedService().duration} минут\nЭто концепт: реальный приём не забронирован.`, event.currentTarget));
booking.querySelector('.quick-dates').addEventListener('click', event => {
  const button = event.target.closest('[data-date]');
  if (button) form.elements.date.value = button.dataset.date;
});
document.addEventListener('click', event => {
  const button = event.target.closest('[data-book]');
  if (button) openBooking(button.dataset.service);
});
document.addEventListener('portfolio:book', event => openBooking(event.detail?.service));
document.querySelectorAll('.service-list details').forEach(detail => detail.addEventListener('toggle', () => {
  if (detail.open) document.querySelectorAll('.service-list details').forEach(other => { if (other !== detail) other.open = false; });
}));
