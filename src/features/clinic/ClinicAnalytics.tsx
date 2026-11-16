import { useEffect } from 'react'
import { useClinic } from '@/features/clinic/ClinicProvider'

function ensureScript(id: string, src?: string, content?: string) {
  if (document.getElementById(id)) return
  const el = document.createElement('script')
  el.id = id
  el.async = true
  if (src) el.src = src
  if (content) el.text = content
  document.head.appendChild(el)
}

/** Injects GA4 / GTM / Meta / TikTok pixels from clinic settings when configured. */
export function ClinicAnalytics() {
  const { clinic } = useClinic()
  const a = clinic?.analytics

  useEffect(() => {
    if (!a) return

    if (a.gtm_id) {
      const id = a.gtm_id
      ensureScript(
        'esla-gtm',
        undefined,
        `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`,
      )
    }

    if (a.ga4_id) {
      const id = a.ga4_id
      ensureScript('esla-ga4-src', `https://www.googletagmanager.com/gtag/js?id=${id}`)
      ensureScript(
        'esla-ga4-cfg',
        undefined,
        `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`,
      )
    }

    if (a.meta_pixel_id) {
      const id = a.meta_pixel_id
      ensureScript(
        'esla-meta-pixel',
        undefined,
        `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id}');fbq('track','PageView');`,
      )
    }

    if (a.tiktok_pixel_id) {
      const id = a.tiktok_pixel_id
      ensureScript(
        'esla-tiktok-pixel',
        undefined,
        `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=d.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${id}');ttq.page()}(window,document,'ttq');`,
      )
    }
  }, [a?.ga4_id, a?.gtm_id, a?.meta_pixel_id, a?.tiktok_pixel_id])

  return null
}
