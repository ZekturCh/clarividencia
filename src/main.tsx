import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.tsx'
import { AppServicesProvider } from './context/AppServicesContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppServicesProvider>
      <App />
    </AppServicesProvider>
  </StrictMode>,
)
