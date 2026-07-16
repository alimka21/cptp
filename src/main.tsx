import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Mencegah error benign/hambatan HMR WebSocket yang diblokir oleh secure proxy lingkungan preview
if (typeof window !== 'undefined') {
  // Override console.error to filter out benign Vite WebSocket connection errors
  const originalConsoleError = console.error;
  console.error = function (...args) {
    const msg = args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        try {
          return arg.message || JSON.stringify(arg);
        } catch {
          return String(arg);
        }
      }
      return String(arg || '');
    }).join(' ');

    if (
      msg.toLowerCase().includes('[vite] failed to connect') ||
      msg.toLowerCase().includes('websocket closed') ||
      msg.toLowerCase().includes('websocket connection') ||
      msg.toLowerCase().includes('closed without opened')
    ) {
      return;
    }
    originalConsoleError.apply(console, args);
  };

  window.addEventListener('unhandledrejection', (event) => {
    const reasonStr = event.reason?.message || String(event.reason || '');
    if (
      reasonStr.toLowerCase().includes('websocket') ||
      reasonStr.toLowerCase().includes('closed without opened')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, { capture: true });

  window.addEventListener('error', (event) => {
    const errorMsg = event.message || '';
    if (
      errorMsg.toLowerCase().includes('websocket') ||
      errorMsg.toLowerCase().includes('closed without opened')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, { capture: true });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
