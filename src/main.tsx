import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// self-hosted fonts: no external requests, so the store renders offline and in previews
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import '@fontsource-variable/fraunces'

import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
