export const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
export const money = value => `${value.toLocaleString('ru-RU')} ₽`;

export function downloadText(name, content, type = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function copyText(text, button) {
  const label = button.textContent;
  try {
    const localHost = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
    if (location.protocol !== 'https:' && !localHost) throw new Error('Manual copy is used on plain HTTP.');
    await navigator.clipboard.writeText(text);
    button.textContent = 'Скопировано ✓';
  } catch {
    const dialog = document.createElement('dialog');
    dialog.className = 'copy-dialog';
    dialog.innerHTML = '<div class="dialog-body"><div class="dialog-head"><h2>Ваш текст</h2><button class="close" aria-label="Закрыть текст">×</button></div><p>Выделите текст и скопируйте его, чтобы отправить в Telegram.</p><textarea aria-label="Текст для копирования" readonly rows="12"></textarea></div>';
    dialog.querySelector('textarea').value = text;
    document.body.append(dialog);
    dialog.querySelector('.close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => dialog.remove());
    dialog.showModal();
    dialog.querySelector('textarea').select();
  }
  setTimeout(() => { if (button.isConnected) button.textContent = label; }, 2200);
}

export function wireDialog(dialog) {
  dialog.querySelector('[data-close], .close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
}
