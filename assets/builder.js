import { projectTypes, features, buildBrief, telegram } from './data.js';
import { copyText, downloadText } from './ui.js';

export function initBuilder() {
  const root = document.querySelector('#project-builder');
  if (!root) return;
  const form = root.querySelector('form');
  let currentStep = 0;

  function values() {
    const data = new FormData(form);
    return { type: data.get('projectType'), business: data.get('business'), goal: data.get('goal'), selected: data.getAll('feature'), timing: data.get('timing') };
  }

  function updatePreview() {
    const data = values();
    const project = projectTypes[data.type];
    root.querySelector('#brief-type').textContent = project.name;
    root.querySelector('#brief-goal').textContent = data.goal.trim() || 'Расскажите, какой результат вам нужен.';
    const list = root.querySelector('#brief-features');
    list.replaceChildren();
    for (const id of data.selected) {
      const tag = document.createElement('span');
      tag.textContent = features[id];
      list.append(tag);
    }
    root.querySelector('#brief-stage-count').textContent = String(project.steps.length);
    root.querySelector('#brief-stages').textContent = project.steps.join(' → ');
    root.querySelector('#brief-output').value = buildBrief(data);
    root.querySelector('#builder-counter').textContent = `${currentStep + 1} / 3`;
  }

  function go(step) {
    currentStep = step;
    root.querySelectorAll('[data-builder-step]').forEach(panel => { panel.hidden = Number(panel.dataset.builderStep) !== step; });
    root.querySelectorAll('.builder-steps li').forEach((item, index) => {
      item.classList.toggle('current', index === step);
      item.classList.toggle('completed', index < step);
      if (index === step) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current');
    });
    root.querySelector('#builder-back').hidden = step === 0;
    root.querySelector('#builder-next').hidden = step === 2;
    root.querySelector('#builder-next').textContent = step === 0 ? 'Выбрать функции ↗' : 'Собрать бриф ↗';
    updatePreview();
  }

  form.addEventListener('input', updatePreview);
  form.addEventListener('change', updatePreview);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (currentStep === 0 && !form.elements.goal.checkValidity()) { form.elements.goal.reportValidity(); return; }
    go(Math.min(2, currentStep + 1));
    root.querySelector(`[data-builder-step="${currentStep}"]`).focus({ preventScroll: true });
  });
  root.querySelector('#builder-back').addEventListener('click', () => go(Math.max(0, currentStep - 1)));
  root.querySelector('#brief-copy').addEventListener('click', event => copyText(buildBrief(values()), event.currentTarget));
  root.querySelector('#brief-download').addEventListener('click', () => downloadText('project-brief-fle3n.txt', buildBrief(values())));
  document.addEventListener('portfolio:brief', event => {
    const data = event.detail || {};
    if (Object.hasOwn(projectTypes, data.type)) form.elements.projectType.value = data.type;
    if (data.goal) form.elements.goal.value = String(data.goal).slice(0, 500);
    if (Array.isArray(data.selected)) form.querySelectorAll('[name=feature]').forEach(input => { input.checked = data.selected.includes(input.value); });
    go(0);
    root.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    form.elements.goal.focus({ preventScroll: true });
  });
  root.querySelectorAll('[data-telegram]').forEach(link => { link.href = telegram; });
  go(0);
}
