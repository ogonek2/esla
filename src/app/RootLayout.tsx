import { Outlet } from 'react-router-dom'
import { Header } from '@/features/clinic/Header'
import { Footer } from '@/features/clinic/Footer'
import { StickyMobileCta } from '@/shared/ui/StickyMobileCta'
import { ClinicProvider } from '@/features/clinic/ClinicProvider'
import { useLocale } from '@/shared/lib/locale'
import { ScrollToTop } from '@/app/ScrollToTop'
import { PageTransition } from '@/app/PageTransition'
import { CatalogPrefetch } from '@/app/CatalogPrefetch'

export function RootLayout() {
  useLocale()

  return (
    <ClinicProvider>
      <ScrollToTop />
      <CatalogPrefetch />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="pt-20 flex-1">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
        <Footer />
        <StickyMobileCta />
      </div>
    </ClinicProvider>
  )
}
