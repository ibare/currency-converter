import { createRoot } from 'react-dom/client'
import CurrencyRatesProvider from './Context/CurrencyRates.tsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <CurrencyRatesProvider>
    <App />
  </CurrencyRatesProvider>
)
