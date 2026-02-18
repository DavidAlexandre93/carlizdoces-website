import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './animate.css'
import './index.css'
import App from './App'
import { AppProviders } from './app/providers/AppProviders'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)
