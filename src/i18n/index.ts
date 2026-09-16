import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import uk from './locales/uk'
import en from './locales/en'
import ru from './locales/ru'
import { DEFAULT_LOCALE } from '@/shared/config/locales'

void i18n.use(initReactI18next).init({
  resources: {
    uk: { translation: uk },
    en: { translation: en },
    ru: { translation: ru },
  },
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  interpolation: { escapeValue: false },
})

export default i18n
