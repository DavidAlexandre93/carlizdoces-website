import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AppProviders } from './app/providers/AppProviders';
import { BrowserRouter } from 'react-router-dom';
import { AppErrorBoundary } from './app/errors/AppErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppErrorBoundary>
        <AppProviders>
          <App />
        </AppProviders>
      </AppErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
