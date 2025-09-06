import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

export default function App() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Fixed Header */}
      <header
        className="header"
        style={{
          flex: '0 0 auto',
          height: 60,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px',
          background: 'var(--card)',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/src/assets/logo.png" alt="logo" style={{ height: 40 }} />
          <div>
            <div style={{ fontWeight: 700 }}>PaarvAI Dashboard</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Face Recognition Command Center</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn small" onClick={() => setDark((d) => !d)}>
            {dark ? 'Light' : 'Dark'} Theme
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main
        className="container"
        style={{
          flex: '1 1 auto',
          marginTop: 60, // equal to header height
          marginBottom: 40, // equal to footer height
          height: 'calc(100vh - 60px - 40px)',
          overflow: 'auto', // prevent browser scrollbar
        }}
      >
        <Outlet />
      </main>

      {/* Fixed Footer */}
      <footer
        className="footer"
        style={{
          flex: '0 0 auto',
          height: 40,
          background: 'var(--card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderTop: '1px solid rgba(0,0,0,0.1)',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        Powered by Madello
      </footer>
    </div>
  );
}
