import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from '@/app/router'
import '@/i18n'

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}
