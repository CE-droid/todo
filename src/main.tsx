import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // MUST come first
import App from './App'

import { ThemeProvider } from "./features/todos/hooks/ThemeContext";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <ThemeProvider>
     <App />
     </ThemeProvider>
   
  </StrictMode>,
)
