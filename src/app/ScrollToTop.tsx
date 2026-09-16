import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/** Restore scroll on SPA navigations (partial SPA shell). */
export function ScrollToTop() {
  const { pathname, search, hash } = useLocation()
  const navType = useNavigationType()

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    if (navType !== 'POP') {
      window.scrollTo({ top: 0, left: 0 })
    }
  }, [pathname, search, hash, navType])

  return null
}
