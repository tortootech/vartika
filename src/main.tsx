import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { initSmoothScroll } from './lib/scroll';

// Lenis must exist before the desk builds its timeline (it hooks stepped scrolling into it)
initSmoothScroll();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
