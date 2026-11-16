// @ts-nocheck
/* Auto-generated from booking CRM widget. Regenerate: node scripts/build-crm-mount.mjs */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type CrmBookingWidgetConfig = {
  baseUrl: string
  clinicName: string
  clinicPhones: string[]
  dryRun?: boolean
  entriesPath?: string
}

export type CrmBookingPayload = {
  department_id?: string
  resource_id?: string
  service_id?: string
  time_slot?: string
  patient?: {
    lastname?: string
    firstname?: string
    patronymic?: string
    birth_date?: string
    gender?: string
    phone?: string
  }
  service_name?: string
  resource_name?: string
  date?: string
  time?: string
}

export function mountCrmBookingWidget(
  root: HTMLElement,
  userConfig: CrmBookingWidgetConfig,
  onBooking?: (payload: CrmBookingPayload) => void,
): () => void {
  root.innerHTML = `
  <div class="bw-root">
    <div class="bw-intro">
      <div class="bw-brand"><span class="bw-brand-mark">ESLA</span></div>
      <p class="bw-title">Запис на прийом</p>
      <p class="bw-subtitle">Оберіть послугу, спеціаліста та зручний час — адміністратор підтвердить візит</p>
    </div>
    <div id="bwSteps"></div>
    <div class="bw-footer" id="bwFooter"></div>
  </div>
  `

  const CONFIG = {
    BASE_URL: (userConfig.baseUrl || 'https://1cloud.in.ua/EslaSSE/hs/SiteServiceEntry').replace(/\/$/, ''),
    CLINIC_NAME: userConfig.clinicName || 'ESLA',
    CLINIC_PHONES: userConfig.clinicPhones?.length ? userConfig.clinicPhones : ['+380991370582'],
    DRY_RUN: userConfig.dryRun !== false,
    ENTRIES_PATH: userConfig.entriesPath || '/entries',
  };

/* ============================================================
   CONFIG
   Коли буде готова тестова база — замінити BASE_URL та logic
   всередині api.* на реальні fetch() до 1С HTTP-сервісу.
   Приклад реального виклику (Basic Auth ЗАВЖДИ через бекенд-
   проксі, ніколи напряму з браузера — див. ТЗ п.7):
     fetch(BASE_URL + '/GetGroups', { headers: AUTH_HEADERS })
   ============================================================ */
/* ============================================================
   LIVE API
   GET-методи (groups/services/resources/dates/timeslots) працюють
   напряму з тестовою базою клієнта. PostEntries свідомо лишається
   заблокованим — див. коментар нижче.
   ============================================================ */
  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  // детермінований псевдо-рандом — лишається лише для dry-run симуляції
  // успіху/зайнятості в postEntries
  function seedRandom(seed){
    let h = 0;
    for (let i=0;i<seed.length;i++){ h = (Math.imul(31,h) + seed.charCodeAt(i))|0; }
    return function(){
      h = (Math.imul(h, 1103515245) + 12345) | 0;
      return ((h >>> 0) % 1000) / 1000;
    };
  }
  function pad2(n){ return String(n).padStart(2,'0'); }
  function fmtDate(d){ return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate()); }

  // Допоміжна функція для GET-запитів до реального 1С HTTP-сервісу.
  function qs(params){
    return Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v))
      .join('&');
  }
  // Виправлення «кракозябрів»: якщо 1С віддала UTF-8 як windows-1251
  // (напр. "РљРѕРЅСЃ…" замість "Конс…"), відновлюємо текст.
  const _cp1251 = (function(){
    const m = {}; const d = new TextDecoder('windows-1251');
    for (let i = 128; i < 256; i++) m[d.decode(new Uint8Array([i]))] = i;
    return m;
  })();
  function fixMojibake(str){
    if (typeof str !== 'string' || !/[РС][\u0080-\u04FF]/.test(str)) return str;
    const bytes = [];
    for (const ch of str){
      const c = ch.charCodeAt(0);
      if (c < 128) bytes.push(c);
      else if (_cp1251[ch] !== undefined) bytes.push(_cp1251[ch]);
      else return str;
    }
    try { return new TextDecoder('utf-8', {fatal:true}).decode(new Uint8Array(bytes)); }
    catch(e){ return str; }
  }
  function fixDeep(v){
    if (typeof v === 'string') return (v.length > 200 ? v : fixMojibake(v));
    if (Array.isArray(v)) return v.map(fixDeep);
    if (v && typeof v === 'object'){ const o = {}; for (const k in v) o[k] = fixDeep(v[k]); return o; }
    return v;
  }
  async function fetchJSON(path, params){
    const query = params ? qs(params) : '';
    const url = CONFIG.BASE_URL + path + (query ? ('?' + query) : '');
    let res;
    try {
      res = await fetch(url);
    } catch (e) {
      // Найчастіша причина тут — CORS: сервер не додає
      // Access-Control-Allow-Origin для домену, з якого відкрито віджет.
      throw new Error('Не вдалося з\'єднатися з сервером (можлива причина: CORS). ' + e.message);
    }
    if (!res.ok) {
      throw new Error('Сервер повернув помилку: HTTP ' + res.status);
    }
    return fixDeep(await res.json());
  }

  const api = {
    // ==== ЖИВІ GET-МЕТОДИ (підключено до тестової бази) ====
    async getGroups(){
      return fetchJSON('/groups');
    },
    async getServices(group_id){
      // onlyservices — окремий метод без дублювання по ресурсах
      // (services повертав по одному запису на кожен resource_id,
      // тому та сама послуга дублювалась у списку).
      return fetchJSON('/onlyservices', { group_id });
    },
    async getResources(service_id){
      return fetchJSON('/resources', { service_id });
    },
    async getDates(resource_id, service_id){
      // Реальний формат підтверджено: масив рядків "YYYY-MM-DDT00:00:00"
      return fetchJSON('/dates', { resource_id, service_id });
    },
    async getTimeSlots(date, resource_id, service_id){
      // Шлях підтверджено, ТОЧНИЙ формат відповіді (поля time_slots/departments)
      // ще не звірено на реальних даних — якщо структура відрізняється,
      // це перше місце для перевірки.
      return fetchJSON('/timeslots', { date, resource_id, service_id });
    },

    // ==== PostEntries: НАВМИСНО НЕ ПІДКЛЮЧЕНО ====
    // Шлях і формат ще не підтверджені власником. Поки що працює
    // тільки dry-run режим (лог у консоль). Якщо хтось випадково
    // виставить CONFIG.DRY_RUN = false без додавання реального шляху —
    // функція навмисно кидає помилку, а не робить запит навмання.
    async postEntries(payload){
      // Always notify parent SPA so ESLA lead API also receives the booking.
      if (typeof onBooking === 'function') {
        try {
          onBooking({
            ...payload,
            service_name: state.service && state.service.service_name,
            resource_name: state.resource && state.resource.resource_name,
            date: state.date,
            time: state.time,
          });
        } catch (e) { /* ignore */ }
      }

      if (CONFIG.DRY_RUN){
        console.log('%c[ESLA] CRM PostEntries dry-run (1С path not confirmed yet):', 'color:#c8a97e;font-weight:bold', payload);
        await delay(450);
        return {
          is_occupied: false,
          booking_id: 'ESLA-' + Math.random().toString(36).slice(2,8).toUpperCase(),
        };
      }

      const url = CONFIG.BASE_URL + (CONFIG.ENTRIES_PATH || '/entries');
      let res;
      try {
        res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (e) {
        throw new Error('Не вдалося з\'єднатися з CRM: ' + e.message);
      }
      if (!res.ok) {
        throw new Error('CRM повернула помилку: HTTP ' + res.status);
      }
      return fixDeep(await res.json());
    },
  };

/* ============================================================
   STATE
   ============================================================ */
  const state = {
    step: 1,
    maxReached: 1,
    group: null,          // {group_id, group_name}
    service: null,        // {service_id, service_name, duration, price, group_name}
    resource: null,       // {resource_id, resource_name, description, color}
    calMonthOffset: 0,    // зсув місяця у календарі відносно поточного
    availableDates: null, // Set('YYYY-MM-DD') — кеш для поточного resource+service
    date: null,           // 'YYYY-MM-DD'
    time: null,           // 'YYYY-MM-DDTHH:MM:SS'
    department: null,     // {department_id, department_name, department_contacts}
    patient: { lastname:'', firstname:'', patronymic:'', birth_date:'', gender:'', phone:'' },
    consent: false,
    submitting: false,
    submitError: null,
    occupiedNotice: false,
    bookingId: null,
    servicesCache: {},    // group_id -> [] завантажені послуги
  };

  const els = {
    steps: root.querySelector('#bwSteps'),
    footer: root.querySelector('#bwFooter'),
  };
  const brandEl = root.querySelector('.bw-brand-mark');
  if (brandEl) brandEl.textContent = CONFIG.CLINIC_NAME;

  function resetFrom(stepNum){
    // При зміні вибору на кроці stepNum скидаємо всі залежні (глибші) дані
    // і кешовані списки, завантажені для попереднього вибору.
    if (stepNum <= 1){ state.service = null; state.servicesCache = {}; }
    if (stepNum <= 2){ state.resource = null; state._resources = null; }
    if (stepNum <= 3){ state.date = null; state.availableDates = null; state.calMonthOffset = 0; state._datesLoading = null; }
    if (stepNum <= 4){ state.time = null; state.department = null; state._timeSlots = null; }
  }

  function goToStep(n){
    state.step = n;
    if (n > state.maxReached) state.maxReached = n;
    render();
    // плавний скрол до активного слайду — зручно на мобільних
    requestAnimationFrame(() => {
      const activeEl = root.querySelector('.bw-step[data-status="active"]');
      if (activeEl) activeEl.scrollIntoView({ behavior:'smooth', block:'nearest' });
    });
  }

  function editStep(n){
    resetFrom(n);
    goToStep(n);
  }

  function stepStatus(n){
    if (n === state.step) return 'active';
    if (n < state.step) return 'done';
    return 'pending';
  }

  const STEP_TITLES = {
    1: 'Оберіть послугу',
    2: 'Оберіть спеціаліста',
    3: 'Дата візиту',
    4: 'Час візиту',
    5: 'Контактні дані',
  };

  function summaryFor(n){
    if (n === 1) return state.service ? state.service.service_name : '';
    if (n === 2) return state.resource ? state.resource.resource_name : '';
    if (n === 3) return state.date ? formatDateHuman(state.date) : '';
    if (n === 4) return state.time ? formatTimeHuman(state.time) : '';
    return '';
  }

  function formatDateHuman(dateStr){
    const [y,m,d] = dateStr.split('-').map(Number);
    const dt = new Date(y, m-1, d);
    return dt.toLocaleDateString('uk-UA', { day:'numeric', month:'long' });
  }
  function formatTimeHuman(dtStr){
    return dtStr.slice(11,16);
  }

/* ============================================================
   RENDER: головний цикл
   ============================================================ */
  function render(){
    els.steps.innerHTML = '';
    for (let n=1; n<=5; n++){
      els.steps.appendChild(renderStep(n));
      if (n < 5){
        els.steps.appendChild(renderConnectorGap(n));
      }
    }
    renderFooter();
  }

  function renderConnectorGap(afterStepN){
    const status = stepStatus(afterStepN);
    const gap = document.createElement('div');
    gap.className = 'bw-connector-gap' + (status === 'done' ? ' is-done' : '');
    const line = document.createElement('div');
    line.className = 'bw-connector-line';
    gap.appendChild(line);
    return gap;
  }

  function renderStep(n){
    const status = stepStatus(n);
    const wrap = document.createElement('div');
    wrap.className = 'bw-step';
    wrap.dataset.status = status;

    const head = document.createElement('div');
    head.className = 'bw-step-head';
    head.innerHTML = `
      <div class="bw-badge">${n}</div>
      <div>
        <div class="bw-step-title">${STEP_TITLES[n]}${status!=='pending' && summaryFor(n) ? ': '+escapeHtml(summaryFor(n)) : ''}</div>
        ${status==='done' ? `<div class="bw-step-summary">Натисніть, щоб змінити</div>` : ''}
      </div>
    `;
    if (status === 'done'){
      const btn = document.createElement('button');
      btn.className = 'bw-btn-ghost bw-step-head-right';
      btn.type = 'button';
      btn.textContent = 'Змінити';
      btn.addEventListener('click', (e) => { e.stopPropagation(); editStep(n); });
      head.appendChild(btn);
      head.addEventListener('click', () => editStep(n));
    }
    wrap.appendChild(head);

    const body = document.createElement('div');
    body.className = 'bw-step-body';
    if (status === 'active'){
      body.appendChild(renderStepBody(n));
    }
    wrap.appendChild(body);

    return wrap;
  }

  function renderStepBody(n){
    const box = document.createElement('div');
    switch(n){
      case 1: box.appendChild(renderStep1()); break;
      case 2: box.appendChild(renderStep2()); break;
      case 3: box.appendChild(renderStep3()); break;
      case 4: box.appendChild(renderStep4()); break;
      case 5: box.appendChild(renderStep5()); break;
    }
    return box;
  }

  function renderFooter(){
    const phones = CONFIG.CLINIC_PHONES.map(p => {
      const digits = String(p).replace(/\D/g,'');
      const href = digits ? ('tel:+' + digits) : '#';
      return `<a href="${href}" style="color:inherit;text-decoration:underline;text-underline-offset:3px;">${escapeHtml(p)}</a>`;
    }).join(' · ');
    els.footer.innerHTML = `
      Після запису адміністратор ESLA підтвердить візит.<br>
      ${phones}
    `;
  }

  function escapeHtml(str){
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function loadingNode(text){
    const d = document.createElement('div');
    d.className = 'bw-loading';
    d.innerHTML = `<span class="bw-spinner"></span><span>${text}</span>`;
    return d;
  }

  function errorNode(text){
    const d = document.createElement('div');
    d.className = 'bw-error';
    d.textContent = text;
    return d;
  }

/* ============================================================
   SLIDE 1 — Категорія + послуга
   ============================================================ */
  function renderStep1(){
    const box = document.createElement('div');

    if (!state._groups){
      box.appendChild(loadingNode('Завантажуємо категорії послуг…'));
      api.getGroups().then(groups => {
        state._groups = groups;
        state.group = state.group || groups[0] || null;
        render();
      }).catch(() => {
        box.innerHTML = '';
        box.appendChild(errorNode('Не вдалося завантажити список послуг. Спробуйте оновити сторінку.'));
      });
      return box;
    }

    const groupsWrap = document.createElement('div');
    groupsWrap.className = 'bw-groups';
    state._groups.forEach(g => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'bw-chip';
      chip.textContent = g.group_name;
      chip.setAttribute('aria-pressed', state.group && state.group.group_id === g.group_id);
      chip.addEventListener('click', () => {
        if (state.group && state.group.group_id === g.group_id) return;
        state.group = g;
        render();
      });
      groupsWrap.appendChild(chip);
    });
    box.appendChild(groupsWrap);

    const listWrap = document.createElement('div');
    listWrap.className = 'bw-service-list';
    box.appendChild(listWrap);

    if (!state.group){
      return box;
    }

    const cacheKey = state.group.group_id;
    if (state.servicesCache[cacheKey]){
      renderServiceRows(listWrap, state.servicesCache[cacheKey]);
    } else {
      listWrap.appendChild(loadingNode('Завантажуємо послуги…'));
      api.getServices(state.group.group_id).then(services => {
        state.servicesCache[cacheKey] = services;
        render();
      }).catch(() => {
        listWrap.innerHTML = '';
        listWrap.appendChild(errorNode('Не вдалося завантажити послуги цієї категорії.'));
      });
    }

    return box;
  }

  function renderServiceRows(container, services){
    if (services.length === 0){
      const empty = document.createElement('div');
      empty.className = 'bw-step-summary';
      empty.style.padding = '14px 4px';
      empty.textContent = 'У цій категорії поки немає доступних послуг.';
      container.appendChild(empty);
      return;
    }
    services.forEach(s => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'bw-service-row';
      row.innerHTML = `
        <span class="bw-service-name">${escapeHtml(s.service_name)}<span class="bw-service-meta"> · ${s.duration} хв</span></span>
        <span class="bw-service-price">${s.price} грн</span>
      `;
      row.addEventListener('click', () => {
        resetFrom(2);
        state.service = s;
        goToStep(2);
      });
      container.appendChild(row);
    });
  }

/* ============================================================
   SLIDE 2 — Спеціаліст
   ============================================================ */
  function renderStep2(){
    const box = document.createElement('div');
    if (!state.service){ return box; }

    if (!state._resources){
      box.appendChild(loadingNode('Шукаємо спеціалістів…'));
      api.getResources(state.service.service_id).then(list => {
        state._resources = list;
        render();
      }).catch(() => {
        box.innerHTML = '';
        box.appendChild(errorNode('Не вдалося завантажити список спеціалістів.'));
      });
      return box;
    }

    if (state._resources.length === 0){
      box.appendChild(errorNode('Наразі немає спеціалістів, що надають цю послугу. Оберіть іншу послугу.'));
      return box;
    }

    const list = document.createElement('div');
    list.className = 'bw-resource-list';
    const AVATAR_COLORS = ['#111110', '#3a342e', '#5c5046', '#8a7358', '#c8a97e', '#6b6b68'];
    state._resources.forEach((r, idx) => {
      const card = document.createElement('div');
      card.className = 'bw-resource-card';
      card.setAttribute('aria-pressed', state.resource && state.resource.resource_id === r.resource_id);
      const initials = (r.resource_name || '').split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
      const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
      const avatarHtml = r.picture
        ? `<img class="bw-avatar" src="data:image/png;base64,${r.picture}" alt="${escapeHtml(r.resource_name || '')}" style="object-fit:cover;">`
        : `<div class="bw-avatar" style="background:${color}">${initials}</div>`;
      card.innerHTML = `
        ${avatarHtml}
        <div class="bw-resource-info">
          <div class="bw-resource-name">${escapeHtml(r.resource_name || '')}</div>
          <div class="bw-resource-desc">${escapeHtml((r.description || '').trim())}</div>
        </div>
        <button type="button" class="bw-btn-primary bw-resource-pick">Обрати спеціаліста</button>
      `;
      const pick = () => {
        resetFrom(3);
        state.resource = r;
        goToStep(3);
      };
      card.querySelector('.bw-resource-pick').addEventListener('click', (e) => { e.stopPropagation(); pick(); });
      card.addEventListener('click', pick);
      card.style.cursor = 'pointer';
      list.appendChild(card);
    });
    box.appendChild(list);
    return box;
  }

/* ============================================================
   SLIDE 3 — Дата візиту (календар)
   ============================================================ */
  const UA_MONTHS = ['січень','лютий','березень','квітень','травень','червень','липень','серпень','вересень','жовтень','листопад','грудень'];
  const UA_DOW = ['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];

  function renderStep3(){
    const box = document.createElement('div');
    if (!state.resource){ return box; }

    if (!state.availableDates){
      box.appendChild(loadingNode('Перевіряємо вільні дати…'));
      api.getDates(state.resource.resource_id, state.service.service_id).then(list => {
        const set = new Set(list.map(dt => dt.slice(0,10)));
        state.availableDates = set;
        render();
      }).catch(() => {
        box.innerHTML = '';
        box.appendChild(errorNode('Не вдалося завантажити календар. Спробуйте ще раз.'));
      });
      return box;
    }

    box.appendChild(buildCalendar());

    const legend = document.createElement('div');
    legend.className = 'bw-legend';
    legend.innerHTML = `
      <span><span class="bw-legend-dot" style="background:var(--free-bg);border:1px solid var(--free)"></span>Вільно</span>
      <span><span class="bw-legend-dot" style="background:var(--dayoff)"></span>Немає прийому</span>
    `;
    box.appendChild(legend);

    return box;
  }

  function buildCalendar(){
    const wrap = document.createElement('div');
    const today = new Date();
    const base = new Date(today.getFullYear(), today.getMonth() + state.calMonthOffset, 1);
    const year = base.getFullYear();
    const month = base.getMonth();

    const head = document.createElement('div');
    head.className = 'bw-cal-head';
    const prevBtn = document.createElement('button');
    prevBtn.className = 'bw-cal-nav'; prevBtn.type = 'button'; prevBtn.textContent = '←';
    prevBtn.disabled = state.calMonthOffset <= 0;
    prevBtn.addEventListener('click', () => { state.calMonthOffset--; render(); });

    const nextBtn = document.createElement('button');
    nextBtn.className = 'bw-cal-nav'; nextBtn.type = 'button'; nextBtn.textContent = '→';
    nextBtn.disabled = state.calMonthOffset >= 2; // показуємо приблизно 45 днів наперед
    nextBtn.addEventListener('click', () => { state.calMonthOffset++; render(); });

    const label = document.createElement('div');
    label.className = 'bw-cal-month';
    label.textContent = UA_MONTHS[month] + ' ' + year;

    head.appendChild(prevBtn);
    head.appendChild(label);
    head.appendChild(nextBtn);
    wrap.appendChild(head);

    const grid = document.createElement('div');
    grid.className = 'bw-cal-grid';
    UA_DOW.forEach(d => {
      const dow = document.createElement('div');
      dow.className = 'bw-cal-dow';
      dow.textContent = d;
      grid.appendChild(dow);
    });

    const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // 0=Пн
    for (let i=0;i<firstDow;i++){
      const empty = document.createElement('div');
      empty.className = 'bw-daycell is-empty';
      grid.appendChild(empty);
    }

    const daysInMonth = new Date(year, month+1, 0).getDate();
    const todayStr = fmtDate(today);
    for (let day=1; day<=daysInMonth; day++){
      const d = new Date(year, month, day);
      const dStr = fmtDate(d);
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'bw-daycell';
      cell.textContent = String(day);

      const isPast = dStr < todayStr;
      const isFree = !isPast && state.availableDates.has(dStr);

      if (isFree){
        cell.classList.add('is-free');
        if (state.date === dStr) cell.classList.add('is-selected');
        cell.addEventListener('click', () => {
          resetFrom(4);
          state.date = dStr;
          goToStep(4);
        });
      } else {
        cell.classList.add('is-off');
        cell.disabled = true;
      }
      grid.appendChild(cell);
    }

    wrap.appendChild(grid);
    return wrap;
  }

/* ============================================================
   SLIDE 4 — Час візиту + підрозділ
   ============================================================ */
  function renderStep4(){
    const box = document.createElement('div');
    if (!state.date){ return box; }

    if (!state._timeSlots){
      box.appendChild(loadingNode('Завантажуємо вільний час…'));
      api.getTimeSlots(state.date, state.resource.resource_id, state.service.service_id).then(res => {
        state._timeSlots = res.time_slots;
        // За правилами бізнес-логіки на конкретний час завжди один підрозділ —
        // API формально повертає масив, але фактично там один запис.
        state.department = res.departments[0] || null;
        render();
      }).catch(() => {
        box.innerHTML = '';
        box.appendChild(errorNode('Не вдалося завантажити доступний час.'));
      });
      return box;
    }

    const layout = document.createElement('div');
    layout.className = 'bw-time-layout';

    const slotsWrap = document.createElement('div');
    slotsWrap.className = 'bw-time-slots';
    if (state._timeSlots.length === 0){
      const empty = document.createElement('div');
      empty.className = 'bw-step-summary';
      empty.textContent = 'На цю дату вільного часу вже немає. Оберіть іншу дату.';
      slotsWrap.appendChild(empty);
    } else {
      state._timeSlots.forEach(dt => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'bw-time-chip';
        chip.textContent = formatTimeHuman(dt);
        chip.setAttribute('aria-pressed', state.time === dt);
        chip.addEventListener('click', () => {
          state.time = dt;
          goToStep(5);
        });
        slotsWrap.appendChild(chip);
      });
    }
    layout.appendChild(slotsWrap);

    if (state.department){
      const dept = document.createElement('div');
      dept.className = 'bw-dept-card';
      const address = state.department.department_contacts.find(c => c.type === 'address');
      const phone = state.department.department_contacts.find(c => c.type === 'telephone');
      dept.innerHTML = `
        <div class="bw-dept-name">${escapeHtml(state.department.department_name)}</div>
        ${address ? `<div class="bw-dept-line">📍 ${escapeHtml(address.value)}</div>` : ''}
        ${phone ? `<div class="bw-dept-line">☎ ${escapeHtml(phone.value)}</div>` : ''}
      `;
      layout.appendChild(dept);
    }

    box.appendChild(layout);
    return box;
  }

/* ============================================================
   SLIDE 5 — Контактні дані пацієнта
   ============================================================ */
  const NAME_RE = /^[А-ЩЬЮЯҐЄІЇа-щьюяґєії'\- ]{2,40}$/u;

  function validatePatient(){
    const p = state.patient;
    const errors = {};
    if (!NAME_RE.test(p.lastname.trim())) errors.lastname = 'Вкажіть прізвище кирилицею';
    if (!NAME_RE.test(p.firstname.trim())) errors.firstname = "Вкажіть ім'я кирилицею";
    if (!NAME_RE.test(p.patronymic.trim())) errors.patronymic = 'Вкажіть по батькові кирилицею';

    if (!p.birth_date){
      errors.birth_date = 'Вкажіть дату народження';
    } else {
      const bd = new Date(p.birth_date);
      const now = new Date();
      const minDate = new Date(now.getFullYear()-120, now.getMonth(), now.getDate());
      if (isNaN(bd.getTime()) || bd > now || bd < minDate){
        errors.birth_date = 'Перевірте дату народження';
      }
    }

    if (!p.gender) errors.gender = 'Оберіть стать';

    const digits = p.phone.replace(/\D/g,'');
    if (digits.length !== 12 || !digits.startsWith('380')){
      errors.phone = 'Формат: +380 XX XXX XX XX';
    }

    if (!state.consent) errors.consent = true;

    return errors;
  }

  function renderStep5(){
    const box = document.createElement('div');
    if (state.submitting){
      box.appendChild(loadingNode('Бронюємо час…'));
      return box;
    }
    if (state.bookingId){
      box.appendChild(renderSuccess());
      return box;
    }

    if (state.occupiedNotice){
      const notice = errorNode('На жаль, цей час щойно зайняли. Оберіть, будь ласка, інший час.');
      box.appendChild(notice);
    }
    if (state.submitError){
      box.appendChild(errorNode(state.submitError));
    }

    const layout = document.createElement('div');
    layout.className = 'bw-form-layout';

    const fields = document.createElement('div');
    fields.className = 'bw-form-fields';

    fields.appendChild(textField('lastname', 'Прізвище', state.patient.lastname));
    fields.appendChild(textField('firstname', "Ім'я", state.patient.firstname));
    fields.appendChild(textField('patronymic', 'По батькові', state.patient.patronymic));
    fields.appendChild(dateField());
    fields.appendChild(genderField());
    fields.appendChild(phoneField());

    const consent = document.createElement('label');
    consent.className = 'bw-consent';
    consent.innerHTML = `
      <input type="checkbox" id="bwConsent" ${state.consent ? 'checked' : ''}>
      <span>Я ознайомлений(-а) з правилами обробки персональних даних і надаю згоду на їх обробку</span>
    `;
    consent.querySelector('input').addEventListener('change', (e) => {
      state.consent = e.target.checked;
    });
    fields.appendChild(consent);

    const submitRow = document.createElement('div');
    submitRow.className = 'bw-submit-row';
    const submitBtn = document.createElement('button');
    submitBtn.type = 'button';
    submitBtn.className = 'bw-btn-primary';
    submitBtn.textContent = 'Забронювати час';
    submitBtn.addEventListener('click', () => handleSubmit(fields));
    submitRow.appendChild(submitBtn);
    fields.appendChild(submitRow);

    layout.appendChild(fields);
    layout.appendChild(renderBookingSummary());

    box.appendChild(layout);
    return box;
  }

  function textField(key, label, value){
    const wrap = document.createElement('div');
    wrap.className = 'bw-field';
    wrap.dataset.field = key;
    wrap.innerHTML = `
      <label for="bw_${key}">${label}</label>
      <input type="text" id="bw_${key}" value="${escapeHtml(value)}" autocomplete="off">
      <div class="bw-field-error"></div>
    `;
    wrap.querySelector('input').addEventListener('input', (e) => {
      state.patient[key] = e.target.value;
    });
    return wrap;
  }

  function dateField(){
    const wrap = document.createElement('div');
    wrap.className = 'bw-field';
    wrap.dataset.field = 'birth_date';
    wrap.innerHTML = `
      <label for="bw_birth_date">Дата народження</label>
      <input type="date" id="bw_birth_date" value="${state.patient.birth_date}">
      <div class="bw-field-error"></div>
    `;
    wrap.querySelector('input').addEventListener('input', (e) => {
      state.patient.birth_date = e.target.value;
    });
    return wrap;
  }

  function genderField(){
    const wrap = document.createElement('div');
    wrap.className = 'bw-field';
    wrap.dataset.field = 'gender';
    wrap.innerHTML = `<label>Стать</label>`;
    const row = document.createElement('div');
    row.className = 'bw-gender';
    [['male','Чоловіча'],['female','Жіноча']].forEach(([val,label]) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bw-gender-btn';
      btn.textContent = label;
      btn.setAttribute('aria-pressed', state.patient.gender === val);
      btn.addEventListener('click', () => {
        state.patient.gender = val;
        row.querySelectorAll('.bw-gender-btn').forEach(b => b.setAttribute('aria-pressed', b === btn));
      });
      row.appendChild(btn);
    });
    wrap.appendChild(row);
    const err = document.createElement('div');
    err.className = 'bw-field-error';
    wrap.appendChild(err);
    return wrap;
  }

  function phoneField(){
    const wrap = document.createElement('div');
    wrap.className = 'bw-field';
    wrap.dataset.field = 'phone';
    wrap.innerHTML = `
      <label for="bw_phone">Телефон</label>
      <input type="tel" id="bw_phone" placeholder="+380 XX XXX XX XX" value="${escapeHtml(state.patient.phone)}">
      <div class="bw-field-error"></div>
    `;
    const input = wrap.querySelector('input');
    input.addEventListener('input', (e) => {
      let digits = e.target.value.replace(/\D/g,'');
      if (digits.startsWith('0')) digits = '38'+digits;
      if (!digits.startsWith('380')) digits = '380'+digits.replace(/^380/,'');
      digits = digits.slice(0,12);
      state.patient.phone = digits;
      const p1 = digits.slice(0,3), p2 = digits.slice(3,5), p3 = digits.slice(5,8), p4 = digits.slice(8,10), p5 = digits.slice(10,12);
      let formatted = '+'+p1;
      if (p2) formatted += ' '+p2;
      if (p3) formatted += ' '+p3;
      if (p4) formatted += ' '+p4;
      if (p5) formatted += ' '+p5;
      e.target.value = formatted;
    });
    return wrap;
  }

  function renderBookingSummary(){
    const wrap = document.createElement('div');
    wrap.className = 'bw-summary';
    wrap.innerHTML = `
      <div class="bw-summary-title">Перевірте вашу заявку</div>
      <div class="bw-summary-row">→ <b>${escapeHtml(state.service.service_name)}</b></div>
      <div class="bw-summary-row">→ <b>${escapeHtml(state.resource.resource_name)}</b></div>
      <div class="bw-summary-row">→ <b>${formatDateHuman(state.date)}, ${formatTimeHuman(state.time)}</b></div>
      <div class="bw-summary-row">→ <b>${state.service.price} грн</b></div>
      <div class="bw-summary-hint">Якщо знайшли помилку — натисніть «Змінити» біля відповідного кроку вище.</div>
    `;
    return wrap;
  }

  function renderSuccess(){
    const wrap = document.createElement('div');
    wrap.className = 'bw-success';
    wrap.innerHTML = `
      <div class="bw-success-icon">✓</div>
      <h3>Вас записано!</h3>
      <p>Адміністратор зв'яжеться з вами для підтвердження візиту.</p>
      <div class="bw-success-id">№ заявки: ${escapeHtml(state.bookingId)}</div>
    `;
    return wrap;
  }

  function handleSubmit(fieldsContainer){
    const errors = validatePatient();

    fieldsContainer.querySelectorAll('.bw-field').forEach(f => {
      const key = f.dataset.field;
      f.classList.remove('has-error');
      const errBox = f.querySelector('.bw-field-error');
      if (errors[key] && typeof errors[key] === 'string'){
        f.classList.add('has-error');
        if (errBox) errBox.textContent = errors[key];
      }
    });

    if (Object.keys(errors).length > 0){
      return;
    }

    state.submitting = true;
    state.submitError = null;
    state.occupiedNotice = false;
    render();

    const payload = {
      department_id: state.department.department_id,
      resource_id: state.resource.resource_id,
      service_id: state.service.service_id,
      time_slot: state.time,
      patient: {
        lastname: state.patient.lastname.trim(),
        firstname: state.patient.firstname.trim(),
        patronymic: state.patient.patronymic.trim(),
        birth_date: state.patient.birth_date,
        gender: state.patient.gender,
        phone: state.patient.phone,
      },
    };

    api.postEntries(payload).then(res => {
      state.submitting = false;
      if (res.is_occupied){
        state.occupiedNotice = true;
        state.time = null;
        state._timeSlots = null;
        goToStep(4);
        return;
      }
      state.bookingId = res.booking_id;
      render();
    }).catch(() => {
      state.submitting = false;
      state.submitError = 'Сталася помилка під час бронювання. Перевірте дані або спробуйте пізніше.';
      render();
    });
  }



  render();

  return function destroy() {
    root.innerHTML = '';
  };
}
