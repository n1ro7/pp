import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './assets/index.css'
import './assets/theme.css'
import { BrowserRouter } from 'react-router-dom'

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)