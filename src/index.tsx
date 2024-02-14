// Directly set __DEV__ on the window object to ensure it's available globally
window.__DEV__ = process.env.NODE_ENV !== 'production'

import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
