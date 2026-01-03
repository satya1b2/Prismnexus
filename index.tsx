
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Critical Runtime Error during initialization:", error);
  rootElement.innerHTML = `
    <div style="height: 100vh; display: flex; align-items: center; justify-content: center; background: #020308; color: #fff; font-family: sans-serif; text-align: center; padding: 20px;">
      <div>
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">Nexus Initialization Failure</h1>
        <p style="opacity: 0.6; font-size: 0.9rem;">The quantum uplink was interrupted. Please reload the console.</p>
        <button onclick="window.location.reload()" style="margin-top: 2rem; background: #fff; color: #000; border: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer;">Retry Link</button>
      </div>
    </div>
  `;
}
