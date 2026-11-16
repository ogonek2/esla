import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const raw = fs.readFileSync(path.join(root, 'src/features/booking/crm/_raw-script.js'), 'utf8')

const initIdx = raw.lastIndexOf('ІНІЦІАЛІЗАЦІЯ')
if (initIdx < 0) throw new Error('init marker not found')
const beforeInit = raw.slice(0, raw.lastIndexOf('/*', initIdx))

let body = beforeInit
  // remove query-param CONFIG block
  .replace(/\/\/ Query params from parent:[\s\S]*?const CONFIG = \{[\s\S]*?\};\s*/, '')
  .replace(/\s*\/\/ brand mark[\s\S]*?if \(brandEl\) brandEl\.textContent = CONFIG\.CLINIC_NAME;\s*/, '\n')
  .replace(
    /const els = \{[\s\S]*?\};/,
    `const els = {
    steps: root.querySelector('#bwSteps'),
    footer: root.querySelector('#bwFooter'),
  };
  const brandEl = root.querySelector('.bw-brand-mark');
  if (brandEl) brandEl.textContent = CONFIG.CLINIC_NAME;`,
  )
  .replace(
    /const activeEl = document\.querySelector\('\.bw-step\[data-status="active"\]'\);/,
    `const activeEl = root.querySelector('.bw-step[data-status="active"]');`,
  )
  .replace(
    /try \{\s*if \(window\.parent && window\.parent !== window\) \{\s*window\.parent\.postMessage\(\{\s*type: 'esla-crm-booking',[\s\S]*?\}, '\*'\);\s*\}\s*\} catch \(e\) \{ \/\* ignore \*\/ \}/,
    `if (typeof onBooking === 'function') {
        try {
          onBooking({
            ...payload,
            service_name: state.service && state.service.service_name,
            resource_name: state.resource && state.resource.resource_name,
            date: state.date,
            time: state.time,
          });
        } catch (e) { /* ignore */ }
      }`,
  )

const out = `/* Auto-generated from booking CRM widget. Regenerate: node scripts/build-crm-mount.mjs */
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
  root.innerHTML = \`
  <div class="bw-root">
    <div class="bw-intro">
      <div class="bw-brand"><span class="bw-brand-mark">ESLA</span></div>
      <p class="bw-title">Запис на прийом</p>
      <p class="bw-subtitle">Оберіть послугу, спеціаліста та зручний час — адміністратор підтвердить візит</p>
    </div>
    <div id="bwSteps"></div>
    <div class="bw-footer" id="bwFooter"></div>
  </div>
  \`

  const CONFIG = {
    BASE_URL: (userConfig.baseUrl || 'https://1cloud.in.ua/EslaSSE/hs/SiteServiceEntry').replace(/\\/$/, ''),
    CLINIC_NAME: userConfig.clinicName || 'ESLA',
    CLINIC_PHONES: userConfig.clinicPhones?.length ? userConfig.clinicPhones : ['+380991370582'],
    DRY_RUN: userConfig.dryRun !== false,
    ENTRIES_PATH: userConfig.entriesPath || '/entries',
  };

${body}

  render();

  return function destroy() {
    root.innerHTML = '';
  };
}
`

const outPath = path.join(root, 'src/features/booking/crm/mountCrmBookingWidget.ts')
fs.writeFileSync(outPath, out)
console.log('wrote', outPath, 'bytes', out.length)

// sanity checks
for (const needle of ['function render(', 'getGroups', 'onBooking', 'const els']) {
  if (!out.includes(needle)) console.warn('MISSING', needle)
}
for (const bad of ['location.search', 'esla-crm-height', 'notifyHeight']) {
  if (out.includes(bad)) console.warn('LEFTOVER', bad)
}
