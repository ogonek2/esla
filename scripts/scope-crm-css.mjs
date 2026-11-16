import fs from 'node:fs'
import path from 'node:path'

const cssPath = path.resolve(import.meta.dirname, '../src/features/booking/crm/crmBookingWidget.css')
let css = fs.readFileSync(cssPath, 'utf8')
css = css
  .replace(/:root\s*\{/g, '.crm-booking-widget {')
  .replace(/\*\s*\{box-sizing:border-box;-webkit-tap-highlight-color:transparent;\}\s*/g, '')
  .replace(/html,body\s*\{[^}]*\}\s*/g, '')
  .replace(/(^|\n)body\s*\{[^}]*\}\s*/g, '$1')

const prefix = `.crm-booking-widget {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}
.crm-booking-widget *,
.crm-booking-widget *::before,
.crm-booking-widget *::after {
  box-sizing: border-box;
}
`

fs.writeFileSync(cssPath, prefix + css)
console.log('scoped css ok')
