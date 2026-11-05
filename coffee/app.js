import { products, priceFor, telegram } from '/assets/data.js';
import { money, downloadText, copyText, wireDialog } from '/assets/ui.js';

const productGrid = document.querySelector('#products');
const cartDialog = document.querySelector('#cart');
const cartItems = document.querySelector('#cart-items');
const cartResult = document.querySelector('#cart-result');
let cart = [];
let toastTimer;

try {
  const saved = JSON.parse(localStorage.getItem('tiho-cart-v2') || '[]');
  if (Array.isArray(saved)) cart = saved.slice(0, 40).flatMap(line => {
    const product = products.find(item => item.id === line.id);
    if (!product || !Number.isInteger(line.quantity) || line.quantity < 1) return [];
    return [{ id: product.id, size: line.size === '350' ? '350' : '250', milk: line.milk === 'oat' ? 'oat' : 'regular', quantity: Math.min(20, line.quantity) }];
  });
} catch { /* The shop also works when browser storage is disabled. */ }

function notify(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.textContent = ''; }, 2600);
}

function artwork(product) {
  if (product.art === 'cup') return '<div class="cup" aria-hidden="true"><span class="cup-mark">тихо</span><i class="steam"></i></div>';
  if (product.art === 'glass') return '<div class="glass" aria-hidden="true"></div>';
  return `<span class="pastry" aria-hidden="true">${product.art}</span>`;
}

function showProducts(category) {
  productGrid.innerHTML = products.filter(product => product.category === category).map((product, index) => `
    <article class="product product-enter">
      <button class="product-art ${category === 'bakery' ? 'bakery' : ''}" data-configure="${product.id}" aria-label="Подробнее: ${product.name}">
        <span class="product-number">0${index + 1}</span>${artwork(product)}<span class="art-hint">Рассмотреть ↗</span>
      </button>
      <div class="product-top"><h3>${product.name}</h3><span class="product-price">${money(product.price)}</span></div>
      <p>${product.note}</p>
      <button class="add-product" data-configure="${product.id}" aria-label="${product.customizable ? 'Настроить' : 'Добавить'} ${product.name}">${product.customizable ? 'По вашему вкусу' : 'Добавить в заказ'} <span>＋</span></button>
    </article>`).join('');
}

const customizer = document.createElement('dialog');
customizer.className = 'product-dialog';
customizer.setAttribute('aria-labelledby', 'customizer-title');
customizer.innerHTML = `
  <div class="dialog-body">
    <div class="dialog-head"><span class="eyebrow">Ваш маленький ритуал</span><button class="close" aria-label="Закрыть настройку напитка">×</button></div>
    <div class="customizer-art" aria-hidden="true"></div><h2 id="customizer-title"></h2><p id="customizer-note"></p>
    <form id="customizer-form">
      <div class="customizer-options">
        <fieldset><legend>Объём</legend><div class="segmented"><label><input type="radio" name="size" value="250" checked><span>250 мл</span></label><label><input type="radio" name="size" value="350"><span>350 мл <small>+50 ₽</small></span></label></div></fieldset>
        <fieldset><legend>Молоко</legend><div class="segmented"><label><input type="radio" name="milk" value="regular" checked><span>Обычное</span></label><label><input type="radio" name="milk" value="oat"><span>Овсяное <small>+40 ₽</small></span></label></div></fieldset>
      </div>
      <button class="pill primary full" id="customizer-add" type="submit"></button>
    </form>
  </div>`;
document.body.append(customizer);
wireDialog(customizer);
wireDialog(cartDialog);
let selectedProduct;
const customizeForm = customizer.querySelector('form');

function updateCustomization() {
  const data = new FormData(customizeForm);
  customizer.querySelector('#customizer-add').textContent = `Добавить в заказ · ${money(priceFor(selectedProduct, data.get('size'), data.get('milk')))}`;
}

function configure(id, milk = 'regular') {
  selectedProduct = products.find(product => product.id === id);
  if (!selectedProduct) return;
  customizeForm.reset();
  customizeForm.elements.milk.value = milk === 'oat' ? 'oat' : 'regular';
  customizer.querySelector('#customizer-title').textContent = selectedProduct.name;
  customizer.querySelector('#customizer-note').textContent = selectedProduct.flavor || selectedProduct.note;
  customizer.querySelector('.customizer-art').innerHTML = artwork(selectedProduct);
  customizer.querySelector('.customizer-options').hidden = !selectedProduct.customizable;
  updateCustomization();
  customizer.showModal();
}

customizeForm.addEventListener('change', updateCustomization);
customizeForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(customizeForm);
  const line = { id: selectedProduct.id, size: selectedProduct.customizable ? data.get('size') : '250', milk: selectedProduct.customizable ? data.get('milk') : 'regular', quantity: 1 };
  const existing = cart.find(item => item.id === line.id && item.size === line.size && item.milk === line.milk);
  if (existing) existing.quantity = Math.min(20, existing.quantity + 1);
  else cart.push(line);
  customizer.close();
  cartResult.replaceChildren();
  updateCart();
  notify(`${selectedProduct.name} — в вашем заказе`);
  document.querySelector('#cart-count').animate([{ transform: 'scale(1)' }, { transform: 'scale(1.5)' }, { transform: 'scale(1)' }], { duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 350 });
});

function total() {
  return cart.reduce((sum, line) => sum + priceFor(products.find(product => product.id === line.id), line.size, line.milk) * line.quantity, 0);
}

function describe(line) {
  const product = products.find(item => item.id === line.id);
  return product.customizable ? `${line.size} мл · ${line.milk === 'oat' ? 'овсяное молоко' : 'обычное молоко'}` : product.category === 'bakery' ? 'Свежая выпечка' : 'Без изменений';
}

function receipt() {
  return ['ТИХО · ДЕМОНСТРАЦИОННЫЙ ЧЕК', '', ...cart.map(line => {
    const product = products.find(item => item.id === line.id);
    return `${product.name} (${describe(line)}) × ${line.quantity} — ${money(priceFor(product, line.size, line.milk) * line.quantity)}`;
  }), '', `Итого: ${money(total())}`, 'Это демонстрация сайта. Заказ не отправлен, оплата не списывается.', '', 'Нужен такой сайт? https://t.me/fle3n'].join('\n');
}

function updateCart(focus) {
  try { localStorage.setItem('tiho-cart-v2', JSON.stringify(cart)); } catch {}
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);
  document.querySelector('#cart-count').textContent = count;
  document.querySelector('#mobile-cart-count')?.replaceChildren(document.createTextNode(String(count)));
  cartItems.innerHTML = count ? cart.map((line, index) => {
    const product = products.find(item => item.id === line.id);
    return `<div class="cart-row"><div><strong>${product.name}</strong><small>${describe(line)}</small><small>${money(priceFor(product, line.size, line.milk) * line.quantity)}</small></div><div class="cart-controls"><button data-line="${index}" data-delta="-1" aria-label="Убрать один ${product.name}">−</button><span>${line.quantity}</span><button data-line="${index}" data-delta="1" aria-label="Добавить один ${product.name}" ${line.quantity >= 20 ? 'disabled' : ''}>+</button></div></div>`;
  }).join('') : '<div class="cart-empty"><span aria-hidden="true">☕</span><h3>Здесь будет ваша пауза.</h3><p>Начните с любимого напитка или попросите помощника подобрать новый.</p><button class="pill primary" id="empty-choose">Перейти к меню ↗</button></div>';
  document.querySelector('#cart-total').textContent = money(total());
  document.querySelector('#checkout').disabled = !count;
  if (focus) cartItems.querySelector(`[data-line="${Math.min(focus.line, cart.length - 1)}"][data-delta="${focus.delta}"]`)?.focus();
}

document.querySelector('.filters').addEventListener('click', event => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  document.querySelectorAll('[data-filter]').forEach(item => {
    item.classList.toggle('active', item === button);
    item.setAttribute('aria-pressed', String(item === button));
  });
  showProducts(button.dataset.filter);
});
productGrid.addEventListener('click', event => {
  const button = event.target.closest('[data-configure]');
  if (button) configure(button.dataset.configure);
});
document.querySelector('#cart-open').addEventListener('click', () => { updateCart(); cartDialog.showModal(); });
document.addEventListener('portfolio:cart', () => { updateCart(); cartDialog.showModal(); });
document.addEventListener('portfolio:product', event => configure(event.detail.id, event.detail.milk));
cartItems.addEventListener('click', event => {
  if (event.target.closest('#empty-choose')) { cartDialog.close(); document.querySelector('#menu').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); return; }
  const button = event.target.closest('[data-line]');
  if (!button) return;
  const index = Number(button.dataset.line);
  const delta = Number(button.dataset.delta);
  cart[index].quantity += delta;
  if (cart[index].quantity < 1) cart.splice(index, 1);
  cartResult.replaceChildren();
  updateCart({ line: index, delta });
});
document.querySelector('#checkout').textContent = 'Посмотреть демочек ↗';
document.querySelector('#checkout').addEventListener('click', () => {
  cartResult.innerHTML = `<div class="receipt-ready"><span class="eyebrow">Демозаказ собран</span><h3>Всё по вашему вкусу.</h3><p>Попробуйте сохранить чек. В рабочем магазине этот сценарий можно связать с кассой и оплатой.</p><div class="receipt-actions"><button class="pill primary" id="receipt-download">Скачать чек ↓</button><button class="pill outline" id="receipt-copy">Скопировать</button></div><a class="developer-link" href="${telegram}" target="_blank" rel="noopener noreferrer">Хочу такой сайт · написать @fle3n ↗</a></div>`;
  cartResult.querySelector('#receipt-download').addEventListener('click', () => downloadText('tiho-demo-order.txt', receipt()));
  cartResult.querySelector('#receipt-copy').addEventListener('click', event => copyText(receipt(), event.currentTarget));
  cartResult.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
});

showProducts('coffee');
updateCart();
