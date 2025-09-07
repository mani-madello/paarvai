import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

export default function App() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    // Set CSS variables based on theme
    const root = document.documentElement;
    if (dark) {
      root.style.setProperty('--bg', '#0b1a3b');
      root.style.setProperty('--card', '#0b1a3b');
      root.style.setProperty('--text', '#fff');
      root.style.setProperty('--muted', '#FFD700');
      root.style.setProperty('--button-bg', '#FFD700');
      root.style.setProperty('--button-text', '#0b1a3b');
    } else {
      root.style.setProperty('--bg', '#ffffff');
      root.style.setProperty('--card', '#f8fafc');
      root.style.setProperty('--text', '#111827');
      root.style.setProperty('--muted', '#6b7280');
      root.style.setProperty('--button-bg', '#0b1a3b');
      root.style.setProperty('--button-text', '#FFD700');
    }
  }, [dark]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Header */}
      <header
        style={{
          flex: '0 0 auto',
          height: 70,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
          background: 'var(--card)',
          color: 'var(--text)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img src="/assets/logo.png" alt="logo" style={{ height: 50 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>PaarvAI Dashboard</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>The Intelligence Eye</div>
          </div>
        </div>
        <div>
          <button
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              background: 'var(--button-bg)',
              color: 'var(--button-text)',
            }}
            onClick={() => setDark((d) => !d)}
          >
            {dark ? 'Light' : 'Dark'} Theme
          </button>
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          flex: '1 1 auto',
          marginTop: 70,
          marginBottom: 50,
          height: 'calc(100vh - 70px - 50px)',
          overflow: 'auto',
        }}
      >
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        style={{
          flex: '0 0 auto',
          height: 50,
          background: 'var(--card)',
          color: 'var(--muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: '0.9rem',
          boxShadow: '0 -2px 8px rgba(0,0,0,0.3)',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        Powered by Madello
      </footer>
    </div>
  );
}
