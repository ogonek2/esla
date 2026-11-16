import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const html = fs.readFileSync(path.join(root, 'public/booking-widget.html'), 'utf8')
const style = html.match(/<style>([\s\S]*?)<\/style>/)[1]
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1]
const outDir = path.join(root, 'src/features/booking/crm')
fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(path.join(outDir, 'crmBookingWidget.css'), `${style.trim()}\n`)
fs.writeFileSync(path.join(outDir, '_raw-script.js'), `${script.trim()}\n`)
console.log('ok', style.length, script.length)
