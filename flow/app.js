import { projectTypes,features,buildBrief } from '/assets/data.js';
import { icon,hydrateIcons } from '/assets/icons.js';
import { escapeHTML as esc,copyText,downloadText,notify,behavior } from '/assets/ui.js';
import { mountAssistant } from '/assets/assistant.js';

const $=s=>document.querySelector(s), key='potok-requests-v3';
const states={new:'Новая',work:'В работе',done:'Готово'};
const seeds=[
 {id:101,name:'Мастерская керамики',task:'Нужен сайт с каталогом изделий и заявками на мастер-классы.',channel:'Сайт',status:'new'},
 {id:102,name:'Студия йоги',task:'Telegram-бот для записи на занятия и напоминаний участникам.',channel:'Telegram',status:'new'},
 {id:103,name:'Архитектурное бюро',task:'Быстро находить ответы в документах и базе знаний команды.',channel:'Сайт',status:'work'},
 {id:104,name:'Ремонтная мастерская',task:'Передавать обращения с сайта в CRM и уведомлять мастера.',channel:'Вручную',status:'work'},
 {id:105,name:'Цветочная студия',task:'Каталог букетов с выбором состава и заявкой флористу.',channel:'Telegram',status:'done'},
 {id:106,name:'Учебный центр',task:'Бот с ответами на частые вопросы о курсах и расписании.',channel:'Сайт',status:'done'},
];
const initial=()=>seeds.map(r=>({...r,history:[{text:'Пример добавлен в демонстрацию',at:null},...(r.status!=='new'?[{text:r.status==='work'?'Пример взят в работу':'Пример завершён',at:null}]:[])]}));
let requests=initial(),filter='all',selected=101;
try{const stored=JSON.parse(localStorage.getItem(key));if(Array.isArray(stored)&&stored.length<=100&&stored.every(r=>Number.isSafeInteger(r.id)&&r.id>0&&typeof r.name==='string'&&r.name.length<=60&&typeof r.task==='string'&&r.task.length<=600&&Object.hasOwn(states,r.status)&&['Сайт','Telegram','Вручную'].includes(r.channel)&&Array.isArray(r.history)&&r.history.length<=30&&r.history.every(e=>typeof e.text==='string'&&e.text.length<=100&&(e.at===null||Number.isFinite(e.at))))){requests=stored;selected=requests[0]?.id}}
catch{}
function save(){try{localStorage.setItem(key,JSON.stringify(requests))}catch{notify('Браузер не сохранил журнал. До перезагрузки изменения останутся доступны.')}}
function stateBadge(status){return `<span class="state state-${status}">${states[status]}</span>`}
function render(){
 for(const state of ['all',...Object.keys(states)])$(`#count-${state}`).textContent=state==='all'?requests.length:requests.filter(r=>r.status===state).length;
 const search=$('#request-search').value.trim().toLowerCase();const visible=requests.filter(r=>(filter==='all'||r.status===filter)&&`${r.name} ${r.task} ${r.channel}`.toLowerCase().includes(search));
 $('#request-list').innerHTML=visible.length?visible.map(r=>`<button class="request-row" data-request="${r.id}" aria-pressed="${r.id===selected}"><span><strong>${esc(r.name)}</strong><span class="task-excerpt">${esc(r.task)}</span></span><span class="channel">${r.channel}</span>${stateBadge(r.status)}</button>`).join(''):`<div class="empty-state"><h3>Заявок не найдено</h3><p>Попробуйте другой запрос или выберите статус «Все».</p></div>`;
 renderDetail();
}
function renderDetail(){
 const r=requests.find(r=>r.id===selected);if(!r){$('#detail-content').innerHTML='<h2>Выберите заявку</h2><p class="detail-task muted">Здесь появятся подробности и история действий.</p>';return}
 $('#detail-content').innerHTML=`<div class="detail-top"><span class="request-id">Заявка №${r.id}</span>${stateBadge(r.status)}</div><h2>${esc(r.name)}</h2><p class="detail-task">${esc(r.task)}</p><p class="detail-meta">Источник: ${r.channel} · демонстрационный пример</p><div class="detail-actions">${r.status!=='work'?`<button class="btn" data-status="work">${r.status==='done'?'Вернуть в работу':'Взять в работу'}</button>`:''}${r.status!=='done'?`<button class="btn ${r.status==='work'?'':'secondary'}" data-status="done">${icon('check')}Завершить</button>`:''}</div><h3 class="history-title">История заявки</h3><ol class="history">${r.history.map(e=>`<li>${esc(e.text)}<time${e.at?` datetime="${new Date(e.at).toISOString()}"`:''}>${e.at?new Date(e.at).toLocaleString('ru-RU',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}):'Исходный пример'}</time></li>`).join('')}</ol>`;
}
$('#request-list').addEventListener('click',e=>{const b=e.target.closest('[data-request]');if(!b)return;selected=Number(b.dataset.request);render();if(matchMedia('(max-width:760px)').matches){$('.request-detail').scrollIntoView({behavior:behavior(),block:'start'})}});
$('#detail-content').addEventListener('click',e=>{const b=e.target.closest('[data-status]'),r=requests.find(r=>r.id===selected);if(!b||!r)return;r.status=b.dataset.status;r.history.push({text:r.status==='work'?'Переведена в работу':'Заявка завершена',at:Date.now()});r.history=r.history.slice(-30);save();render();notify(`Заявка №${r.id}: ${states[r.status].toLowerCase()}`)});
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));render()}));
$('#request-search').addEventListener('input',render);
function toggleNew(show){$('#request-form').hidden=!show;$('#new-request').setAttribute('aria-expanded',String(show));if(show)$('#request-form').elements.name.focus()}
$('#new-request').addEventListener('click',()=>toggleNew($('#request-form').hidden));$('#new-request').setAttribute('aria-expanded','false');$('#new-request').setAttribute('aria-controls','request-form');
$('#cancel-request').addEventListener('click',()=>toggleNew(false));
$('#request-form').addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget;if(!f.elements.name.value.trim()||!f.elements.task.value.trim()){notify('Укажите название и опишите задачу.');return}if(requests.length>=100){notify('В демонстрации можно хранить до 100 заявок. Восстановите примеры в разделе «О проекте».');return}const id=Math.max(100,...requests.map(r=>r.id))+1;requests.unshift({id,name:f.elements.name.value.trim(),task:f.elements.task.value.trim(),channel:f.elements.channel.value,status:'new',history:[{text:'Заявка создана',at:Date.now()}]});selected=id;filter='all';document.querySelector('[data-filter="all"]').click();$('#request-search').value='';save();render();f.reset();toggleNew(false);notify('Заявка добавлена в журнал')});
const views=['requests','workflow','brief','calculate','about'];
function showView(){const requested=location.hash.slice(1),view=views.includes(requested)?requested:'requests';for(const name of views)$(`#view-${name}`).hidden=name!==view;document.querySelectorAll('[data-view]').forEach(a=>{if(a.dataset.view===view)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});document.title=`${{requests:'Заявки',workflow:'Сценарий',brief:'Бриф',calculate:'Экономия времени',about:'О проекте'}[view]} — Поток`}
window.addEventListener('hashchange',showView);showView();
const assistant=mountAssistant($('#flow-assistant'),'flow');
$('#ask-selected').addEventListener('click',()=>{const r=requests.find(r=>r.id===selected);if(r){assistant.ask(r.task);$('#flow-assistant').scrollIntoView({behavior:behavior(),block:'center'});assistant.focus()}});
$('#feature-options').innerHTML=Object.entries(features).map(([id,name])=>`<label><input type="checkbox" name="selected" value="${id}">${name}</label>`).join('');
const brief=$('#brief-form');let text='';
function updateBrief(){const f=new FormData(brief);text=buildBrief({type:f.get('type'),business:f.get('business'),goal:f.get('goal'),selected:f.getAll('selected'),timing:f.get('timing')});$('#brief-text').textContent=text;try{localStorage.setItem('potok-brief-v3',JSON.stringify({type:f.get('type'),business:f.get('business'),goal:f.get('goal'),timing:f.get('timing'),selected:f.getAll('selected')}))}catch{}}
try{const saved=JSON.parse(localStorage.getItem('potok-brief-v3'));if(saved&&typeof saved==='object'){for(const name of ['type','business','goal','timing'])if(typeof saved[name]==='string')brief.elements[name].value=saved[name].slice(0,name==='goal'?1000:120);if(Array.isArray(saved.selected))for(const c of brief.querySelectorAll('[name="selected"]'))c.checked=saved.selected.includes(c.value)}}catch{}
brief.addEventListener('input',updateBrief);brief.addEventListener('change',updateBrief);updateBrief();
$('#brief-copy').addEventListener('click',e=>copyText(text,e.currentTarget));$('#brief-download').addEventListener('click',()=>downloadText('project-brief.txt',text));
function fillBrief({type='website',goal='',selected=[]}){brief.elements.type.value=type;brief.elements.goal.value=goal;for(const c of brief.querySelectorAll('[name="selected"]'))c.checked=selected.includes(c.value);updateBrief();location.hash='brief';showView();brief.elements.goal.focus();notify('Задача перенесена в бриф')}
document.addEventListener('portfolio:brief',e=>fillBrief(e.detail));
function classify(message){const t=message.toLowerCase(),type=/бот|телеграм|telegram/.test(t)?'bot':/документ|знани|поиск|автоматизац|ии|ai/.test(t)?'ai':'website',selected=[];if(/запис/.test(t))selected.push('booking');if(/каталог/.test(t))selected.push('catalog');if(/уведом|напомин/.test(t))selected.push('telegram');if(/crm|црм/.test(t))selected.push('crm');if(/документ|знани/.test(t))selected.push('knowledge');return{type,goal:message,selected}}
let result;
$('#workflow-form').addEventListener('submit',e=>{e.preventDefault();const message=e.currentTarget.elements.message.value.trim();if(!message){notify('Напишите сообщение для разбора.');return}result=classify(message);const root=$('#workflow-result');root.classList.remove('processed');root.innerHTML=`<h2>Задача разобрана</h2><ol class="history"><li><strong>Сообщение принято</strong><p>${message.length} символов · обработано в браузере</p></li><li><strong>Направление определено</strong><p>${projectTypes[result.type].name}</p></li><li><strong>Функции выделены</strong><p>${result.selected.length?result.selected.map(id=>features[id]).join(', '):'Нужно уточнить при обсуждении'}</p></li><li><strong>Следующий шаг — бриф</strong><p>Перенесите задачу и дополните детали.</p></li></ol><button class="btn" id="workflow-to-brief">Подготовить бриф ${icon('arrow')}</button><p class="notice">Результат демонстрационного правила. Требует проверки человеком.</p>`;requestAnimationFrame(()=>root.classList.add('processed'));$('#workflow-to-brief').addEventListener('click',()=>fillBrief(result))});
function calculate(){const tasks=Number($('#tasks').value),minutes=Number($('#minutes').value),hours=tasks*minutes*22*.7/60;$('#tasks-value').value=tasks;$('#minutes-value').value=minutes;$('#saved-hours').value=hours.toLocaleString('ru-RU',{maximumFractionDigits:1});$('#savings-formula').textContent=`${tasks} задач × ${minutes} мин × 22 дня × 70% ÷ 60`}
$('#savings-form').addEventListener('input',calculate);calculate();
$('#reset-demo').addEventListener('click',e=>{if(e.currentTarget.dataset.confirm!=='yes'){e.currentTarget.dataset.confirm='yes';e.currentTarget.textContent='Подтвердить восстановление примеров';return}requests=initial();selected=101;save();render();e.currentTarget.dataset.confirm='';e.currentTarget.textContent='Восстановить исходные примеры';notify('Исходные примеры восстановлены')});
render();hydrateIcons();
