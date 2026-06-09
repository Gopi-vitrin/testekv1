import { useState, useEffect } from 'react';
import { colors, fonts } from '../styles/tokens.js';

const PERSONAS = {
  admin:      { name: 'E. Falkowski', initials: 'EF', sub: 'Director of Ops' },
  advisor:    { name: 'R. Okonkwo',   initials: 'RO', sub: 'Senior Tech · 22yr' },
  technician: { name: 'J. Patel',     initials: 'JP', sub: 'Technician I · 1yr' },
};

const TABS = [
  { key: 'admin',      label: 'Operations',      icon: (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="5" height="5" fill="currentColor" />
      <rect x="8" y="1" width="5" height="5" fill="currentColor" opacity="0.55"/>
      <rect x="1" y="8" width="5" height="5" fill="currentColor" opacity="0.55"/>
      <rect x="8" y="8" width="5" height="5" fill="currentColor" />
    </svg>
  )},
  { key: 'advisor',    label: 'Advisor',         icon: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  )},
  { key: 'technician', label: 'Technician',      icon: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  )},
];

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{ fontFamily: fonts.mono, fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.8 }}>
      {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
      <span style={{ margin: '0 6px', opacity: 0.4 }}>|</span>
      {time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
    </span>
  );
}

export default function NavBar({ activeView, onViewChange }) {
  const persona = PERSONAS[activeView] || PERSONAS.admin;

  return (
    <nav
      aria-label="Main navigation"
      style={{
        background: colors.navy,
        height: 54,
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 0 rgba(0,0,0,0.25)',
        borderBottom: `2px solid ${colors.navyMid}`,
        gap: 0,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 28 }}>
        <div
          role="img"
          aria-label="Testek logo"
          style={{
            background: colors.red, width: 28, height: 28, borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <rect x="1" y="1" width="5" height="5" fill="white" />
            <rect x="8" y="1" width="5" height="5" fill="white" opacity="0.6"/>
            <rect x="1" y="8" width="5" height="5" fill="white" opacity="0.6"/>
            <rect x="8" y="8" width="5" height="5" fill="white" />
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: fonts.sans, color: colors.white, fontWeight: 800, fontSize: 15, letterSpacing: 1.5, lineHeight: 1 }}>
            TESTEK
          </div>
          <div style={{ fontFamily: fonts.mono, color: 'rgba(255,255,255,0.45)', fontSize: 9, letterSpacing: 2, lineHeight: 1.4 }}>
            BUILD TRACKER
          </div>
        </div>
      </div>

      {/* Role tabs */}
      <div style={{ display: 'flex', gap: 0, height: '100%', alignItems: 'stretch' }}>
        {TABS.map(({ key, label, icon }) => {
          const isActive = activeView === key;
          return (
            <button
              key={key}
              onClick={() => onViewChange(key)}
              aria-current={isActive ? 'page' : undefined}
              style={{
                background: isActive ? 'rgba(255,255,255,0.09)' : 'none',
                border: 'none',
                borderBottom: isActive ? `2px solid ${colors.red}` : '2px solid transparent',
                cursor: 'pointer',
                color: isActive ? colors.white : 'rgba(255,255,255,0.5)',
                fontSize: 12,
                fontWeight: isActive ? 700 : 400,
                fontFamily: fonts.sans,
                padding: '0 16px',
                letterSpacing: 0.3,
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; } }}
            >
              <span style={{ opacity: isActive ? 0.9 : 0.6 }}>{icon}</span>
              {label}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />

      {/* Right section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* On-prem badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 4, padding: '3px 8px',
        }}>
          <span style={{ fontSize: 8, color: '#4ade80' }}>●</span>
          <span style={{ fontFamily: fonts.mono, fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: 1 }}>
            ON-PREM · CMMC 2.0
          </span>
        </div>

        <LiveClock />

        {/* User badge — switches persona per role */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '4px 10px 4px 6px',
          background: 'rgba(255,255,255,0.07)',
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: activeView === 'admin' ? colors.red : activeView === 'advisor' ? colors.navyMid : '#2a5a3a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700, color: colors.white,
            transition: 'background 0.2s',
          }}>
            {persona.initials}
          </div>
          <div>
            <div style={{ fontSize: 12, color: colors.white, fontFamily: fonts.sans, lineHeight: 1.2 }}>
              {persona.name}
            </div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', fontFamily: fonts.mono, letterSpacing: 0.5 }}>
              {persona.sub}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
