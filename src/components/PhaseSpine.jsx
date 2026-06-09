import { useState } from 'react';
import { colors, fonts } from '../styles/tokens.js';

function phaseStyle(status) {
  if (status === 'complete')         return { dot: colors.green,  text: colors.green,  border: colors.green,  fill: colors.white };
  if (status === 'active')           return { dot: colors.navy,   text: colors.navy,   border: colors.red,    fill: colors.white };
  if (status === 'awaiting-signoff') return { dot: colors.amber,  text: colors.amber,  border: colors.amber,  fill: colors.white };
  return                                    { dot: colors.border,  text: colors.textMuted, border: colors.border, fill: colors.lightGray };
}

function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function PhaseSpine({ phases }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: colors.textMuted, letterSpacing: 1, marginBottom: 14, textTransform: 'uppercase', fontFamily: fonts.mono }}>
        Phase Progression
      </div>

      <div style={{ display: 'flex', position: 'relative', overflowX: 'auto', paddingBottom: 8 }}>
        {/* Backbone line */}
        <div style={{
          position: 'absolute',
          top: 14,
          left: 14,
          right: 14,
          height: 2,
          background: colors.border,
          zIndex: 0,
        }}>
          {/* Progress fill */}
          {(() => {
            const total = phases.length;
            const done = phases.filter(p => p.status === 'complete').length;
            const active = phases.find(p => p.status === 'active' || p.status === 'awaiting-signoff');
            const activePct = active ? ((active.id - 1) / (total - 1)) * 100 : (done / total) * 100;
            return (
              <div style={{
                height: '100%',
                width: `${activePct}%`,
                background: colors.green,
                transition: 'width 0.4s ease',
              }} />
            );
          })()}
        </div>

        {phases.map((phase) => {
          const s = phaseStyle(phase.status);
          const isActive = phase.status === 'active' || phase.status === 'awaiting-signoff';
          const isComplete = phase.status === 'complete';
          const isExpanded = expanded === phase.id;
          const completedCount = phase.steps.filter(st => st.status === 'complete').length;

          return (
            <div
              key={phase.id}
              style={{ flex: 1, minWidth: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}
            >
              {/* Dot */}
              <button
                type="button"
                onClick={() => isComplete ? setExpanded(isExpanded ? null : phase.id) : undefined}
                aria-label={`Phase ${phase.id} ${phase.name}${isComplete ? ' — click to view completed steps' : isActive ? ' — active' : ' — locked'}`}
                aria-expanded={isComplete ? isExpanded : undefined}
                disabled={!isComplete}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: isComplete ? colors.green : isActive ? colors.navy : colors.lightGray,
                  border: `2.5px solid ${s.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isComplete ? 'pointer' : 'default',
                  boxShadow: isActive ? `0 0 0 4px ${colors.navyLight}` : 'none',
                  transition: 'box-shadow 0.2s',
                  marginBottom: 6,
                  flexShrink: 0,
                  padding: 0,
                }}
              >
                {isComplete ? (
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : isActive ? (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors.white }} />
                ) : (
                  <span style={{ fontFamily: fonts.mono, fontSize: 9, color: colors.textMuted, fontWeight: 700 }}>{phase.id}</span>
                )}
              </button>

              {/* Label */}
              <div style={{ textAlign: 'center', padding: '0 4px' }}>
                <div style={{
                  fontSize: 10,
                  fontWeight: isActive ? 700 : 500,
                  color: s.text,
                  lineHeight: 1.25,
                  maxWidth: 80,
                }}>
                  {phase.name}
                </div>
                {isComplete && (
                  <div style={{ fontFamily: fonts.mono, fontSize: 9, color: colors.green, marginTop: 2 }}>
                    {completedCount} steps
                  </div>
                )}
                {isActive && (
                  <div style={{
                    fontFamily: fonts.mono,
                    fontSize: 9,
                    fontWeight: 700,
                    color: phase.status === 'awaiting-signoff' ? colors.amber : colors.red,
                    marginTop: 2,
                    textTransform: 'uppercase',
                  }}>
                    {phase.status === 'awaiting-signoff' ? 'SIGN-OFF' : 'ACTIVE'}
                  </div>
                )}
              </div>

              {/* Expanded completed phase */}
              {isExpanded && isComplete && (
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-label={`Phase ${phase.id} — ${phase.name} completed steps`}
                  className="anim-fade-in"
                  style={{
                    position: 'absolute',
                    top: 76,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 240,
                    background: colors.white,
                    border: `1px solid ${colors.border}`,
                    borderTop: `3px solid ${colors.green}`,
                    borderRadius: 6,
                    boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                    zIndex: 50,
                    maxHeight: 260,
                    overflowY: 'auto',
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <div style={{
                    padding: '10px 12px',
                    borderBottom: `1px solid ${colors.border}`,
                    fontWeight: 700,
                    fontSize: 12,
                    color: colors.green,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <span>Ph.{phase.id} — {phase.name}</span>
                    <button
                      onClick={() => setExpanded(null)}
                      aria-label="Close phase detail"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted, fontSize: 14, padding: 0 }}
                    >×</button>
                  </div>
                  {phase.steps.map(step => (
                    <div key={step.id} style={{ padding: '7px 12px', borderBottom: `1px solid ${colors.lightGray}` }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" style={{ marginTop: 3, flexShrink: 0 }}>
                          <path d="M1 4L3.5 6.5L9 1" stroke={colors.green} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div>
                          <span style={{ fontFamily: fonts.mono, fontSize: 9, color: colors.textMuted, marginRight: 5 }}>#{step.id}</span>
                          <span style={{ fontSize: 11, color: colors.textPrimary }}>{step.name}</span>
                          {step.completedAt && (
                            <div style={{ fontSize: 9, color: colors.textMuted, marginTop: 1, fontFamily: fonts.mono }}>
                              {formatDate(step.completedAt)}
                              {step.note && ` · "${step.note}"`}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
