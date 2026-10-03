import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'

import '@fontsource/anton/400.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import './index.css'




const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found in index.html');
};

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
