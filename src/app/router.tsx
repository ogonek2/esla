import { Navigate, Route, Routes } from 'react-router-dom'
import { RootLayout } from '@/app/RootLayout'
import { HomePage } from '@/app/pages/HomePage'
import { ServicesPage } from '@/app/pages/ServicesPage'
import { ServiceDetailPage } from '@/app/pages/ServiceDetailPage'
import { DoctorsPage } from '@/app/pages/DoctorsPage'
import { DoctorDetailPage } from '@/app/pages/DoctorDetailPage'
import { PortfolioPage, PortfolioDetailPage } from '@/app/pages/PortfolioPages'
import { BlogPage, BlogPostPage, StaticPage } from '@/app/pages/ContentPages'
import { BookingPage, ContactsPage, FaqPage, ReviewsPage } from '@/app/pages/SimplePages'
import { PricesPage } from '@/app/pages/PricesPage'
import { SearchPage } from '@/app/pages/SearchPage'
import { EndoliftLandingPage } from '@/app/pages/EndoliftLandingPage'
import { DEFAULT_LOCALE, LOCALES } from '@/shared/config/locales'

function appRoutes() {
  return (
    <>
      <Route index element={<HomePage />} />
      <Route path="services" element={<ServicesPage />} />
      <Route path="services/:slug" element={<ServiceDetailPage />} />
      <Route path="endolift" element={<EndoliftLandingPage />} />
      <Route path="prices" element={<PricesPage />} />
      <Route path="doctors" element={<DoctorsPage />} />
      <Route path="doctors/:slug" element={<DoctorDetailPage />} />
      <Route path="portfolio" element={<PortfolioPage />} />
      <Route path="portfolio/:slug" element={<PortfolioDetailPage />} />
      <Route path="reviews" element={<ReviewsPage />} />
      <Route path="faq" element={<FaqPage />} />
      <Route path="blog" element={<BlogPage />} />
      <Route path="blog/:slug" element={<BlogPostPage />} />
      <Route path="booking" element={<BookingPage />} />
      <Route path="contacts" element={<ContactsPage />} />
      <Route path="search" element={<SearchPage />} />
      <Route path="pages/:slug" element={<StaticPage />} />
    </>
  )
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>{appRoutes()}</Route>

      {LOCALES.filter((l) => l !== DEFAULT_LOCALE).map((locale) => (
        <Route key={locale} path={locale} element={<RootLayout />}>
          {appRoutes()}
        </Route>
      ))}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
