
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

const renderError = (message: string) => {
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="height: 100vh; display: flex; align-items: center; justify-content: center; background: #020308; color: #fff; font-family: sans-serif; text-align: center; padding: 20px;">
        <div style="max-width: 500px;">
          <h1 style="font-size: 1.5rem; margin-bottom: 1rem; color: #C026D3;">Nexus Link Interrupted</h1>
          <p style="opacity: 0.6; font-size: 0.9rem; line-height: 1.6;">${message}</p>
          <button onclick="window.location.reload()" style="margin-top: 2rem; background: #fff; color: #000; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer;">Re-Initialize</button>
        </div>
      </div>
    `;
  }
};

if (!rootElement) {
  console.error("Critical error: Root element not found.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Critical Runtime Error during initialization:", error);
    renderError("A fatal exception occurred in the quantum logic layer. Verify your connection and browser compatibility.");
  }
}
