import React from 'react'
import ReactDOM from 'react-dom/client'
import './animate.css'
import './index.css'
import App from './App.jsx'
import { AppProviders } from './app/providers/AppProviders'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
)
