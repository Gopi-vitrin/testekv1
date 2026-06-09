import { useState } from 'react';
import { colors, fonts } from '../styles/tokens.js';
import { TECHNICIANS } from '../data/initialState.js';

const ADVISOR = TECHNICIANS['R. Okonkwo'];

const INITIAL_QUERIES = [
  {
    id: 'q-001',
    from: 'J. Patel',
    project: 'TSK-2024-051',
    stepId: 51,
    stepName: 'Generate software configuration record — lock program revision',
    message: 'Harness routing doesn\'t match the schematic from engineering. Looks like the drawing rev is wrong. Should I halt or proceed with what I have?',
    sentAt: '2026-06-07T09:30:00',
    status: 'open',
    urgent: true,
  },
  {
    id: 'q-002',
    from: 'M. Chen',
    project: 'TSK-2024-058',
    stepId: 68,
    stepName: 'Phase 4 internal review and sign-off',
    message: 'Phase 4 calibration and verification is complete. Docs are packaged and ready for review. Can you do the sign-off walk today?',
    sentAt: '2026-06-09T14:15:00',
    status: 'open',
    urgent: false,
  },
];

function timeAgo(isoStr) {
  const diff = Date.now() - new Date(isoStr).getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return 'just now';
}

function getAssignedTechStatus(techName, projects) {
  for (const project of projects) {
    if (project.leadTech === techName) {
      for (const phase of project.phases) {
        for (const step of phase.steps) {
          if (step.status === 'blocked') return { status: 'blocked', project, phase, step };
          if (step.status === 'active') return { status: 'active', project, phase, step };
          if (step.status === 'awaiting-signoff') return { status: 'awaiting-signoff', project, phase, step };
        }
      }
    }
  }
  return null;
}

export default function AdvisorView({ projects, knowledgeVault, onAddVaultEntry }) {
  const [queries, setQueries] = useState(INITIAL_QUERIES);
  const [respondingTo, setRespondingTo] = useState(null);
  const [response, setResponse] = useState('');
  const [captureText, setCaptureText] = useState('');
  const [captureStep, setCaptureStep] = useState('');
  const [capturePhase, setCapturePhase] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState(null);

  const myEntries = knowledgeVault.filter(e => e.contributor === ADVISOR.name);
  const totalCitations = myEntries.reduce((s, e) => s + e.citations, 0);
  const myTechs = Object.values(TECHNICIANS).filter(t => t.mentor === ADVISOR.name);
  const openQueries = queries.filter(q => q.status === 'open');

  function handleRespond(query) {
    if (!response.trim()) return;
    setQueries(prev => prev.map(q =>
      q.id === query.id ? { ...q, status: 'responded', responseText: response } : q
    ));
    setRespondingTo(null);
    setResponse('');
  }

  function handleSubmitVault() {
    if (!captureText.trim()) return;
    onAddVaultEntry({
      technique: captureText.trim(),
      stepId: parseInt(captureStep) || null,
      stepName: captureStep ? `Step ${captureStep}` : 'General',
      phase: capturePhase.trim() || 'General',
      contributor: ADVISOR.name,
    });
    setCaptureText('');
    setCaptureStep('');
    setCapturePhase('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  function prefillVault(query) {
    setCaptureStep(String(query.stepId));
    document.getElementById('vault-capture-textarea')?.focus();
  }

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 54px)', background: colors.lightGray }}>

      {/* Sidebar */}
      <aside style={{
        width: 226,
        background: colors.white,
        borderRight: `1px solid ${colors.border}`,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Advisor identity */}
        <div style={{ padding: '14px 14px 12px', borderBottom: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: colors.navyMid,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: colors.white,
            }}>
              RO
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: colors.textPrimary }}>{ADVISOR.name}</div>
              <div style={{ fontSize: 10, color: colors.textMuted, fontFamily: fonts.mono }}>
                {ADVISOR.title} · {ADVISOR.yearsExp}yr
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { value: myEntries.length, label: 'Techniques' },
              { value: totalCitations, label: 'Citations' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: colors.navyLight, borderRadius: 5, padding: '7px 10px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: colors.navy, fontFamily: fonts.mono }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: colors.textMuted, letterSpacing: 0.4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* My technicians */}
        <div style={{ padding: '10px 14px 6px', fontSize: 9, fontWeight: 700, color: colors.textMuted, letterSpacing: 1.4, fontFamily: fonts.mono, textTransform: 'uppercase' }}>
          My Technicians
        </div>
        {myTechs.map(tech => {
          const statusInfo = getAssignedTechStatus(tech.name, projects);
          const hasQuery = queries.some(q => q.from === tech.name && q.status === 'open');
          return (
            <div key={tech.name} style={{
              padding: '10px 14px',
              borderBottom: `1px solid ${colors.border}`,
              background: hasQuery ? '#FFF9F9' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: statusInfo?.status === 'blocked' ? colors.redLight : colors.navyLight,
                    border: `2px solid ${statusInfo?.status === 'blocked' ? colors.red : colors.navyMid}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, color: statusInfo?.status === 'blocked' ? colors.red : colors.navy,
                  }}>
                    {tech.name.split(' ').map(p => p[0]).join('')}
                  </div>
                  {hasQuery && (
                    <div style={{
                      position: 'absolute', top: -2, right: -2,
                      width: 10, height: 10, borderRadius: '50%',
                      background: colors.red, border: '1.5px solid white',
                    }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: colors.textPrimary }}>{tech.name}</div>
                  <div style={{ fontSize: 11, color: colors.textMuted, fontFamily: fonts.mono }}>{tech.title} · {tech.yearsExp}yr</div>
                </div>
              </div>
              {statusInfo && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center',
                  fontSize: 9, fontWeight: 700, fontFamily: fonts.mono, letterSpacing: 0.4,
                  padding: '2px 7px', borderRadius: 3,
                  background: statusInfo.status === 'blocked' ? colors.redLight : statusInfo.status === 'awaiting-signoff' ? colors.amberLight : colors.greenLight,
                  color: statusInfo.status === 'blocked' ? colors.red : statusInfo.status === 'awaiting-signoff' ? '#7A3D00' : '#177040',
                }}>
                  {statusInfo.status === 'blocked' ? '🚩 BLOCKED' : statusInfo.status === 'awaiting-signoff' ? '⏳ SIGN-OFF' : `▶ STEP ${statusInfo.step.id}`}
                </div>
              )}
              {statusInfo && (
                <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 4, lineHeight: 1.3 }}>
                  {statusInfo.project.id} · {statusInfo.phase.name}
                </div>
              )}
            </div>
          );
        })}
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '20px 24px', overflow: 'auto', minWidth: 0 }}>

        {/* Incoming queries */}
        {openQueries.length > 0 && (
          <section style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary, margin: 0 }}>Incoming Queries</h2>
              <div style={{
                background: colors.red, color: colors.white,
                fontFamily: fonts.mono, fontSize: 10, fontWeight: 700,
                padding: '2px 8px', borderRadius: 10, lineHeight: 1.6,
              }}>
                {openQueries.length}
              </div>
            </div>

            {openQueries.map(query => (
              <div key={query.id} style={{
                background: colors.white,
                border: `1px solid ${query.urgent ? colors.red : colors.border}`,
                borderLeft: `4px solid ${query.urgent ? colors.red : colors.amber}`,
                borderRadius: 8, padding: '16px 18px', marginBottom: 10,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: '#2a5a3a',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, color: colors.white,
                    }}>
                      {query.from.split(' ').map(p => p[0]).join('')}
                    </div>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: colors.textPrimary }}>{query.from}</span>
                      <span style={{ fontSize: 11, color: colors.textMuted, marginLeft: 8 }}>
                        {query.project} · Step {query.stepId}
                      </span>
                      {query.urgent && (
                        <span style={{ marginLeft: 8, fontSize: 9, fontWeight: 700, color: colors.red, background: colors.redLight, padding: '1px 6px', borderRadius: 3, fontFamily: fonts.mono }}>
                          URGENT
                        </span>
                      )}
                    </div>
                  </div>
                  <span style={{ fontSize: 10, color: colors.textMuted, fontFamily: fonts.mono, flexShrink: 0 }}>
                    {timeAgo(query.sentAt)}
                  </span>
                </div>

                <div style={{ fontSize: 11, color: colors.navy, fontWeight: 600, marginBottom: 5, lineHeight: 1.4 }}>
                  Re: Step {query.stepId} — {query.stepName}
                </div>
                <div style={{ fontSize: 13, color: colors.textPrimary, lineHeight: 1.6, marginBottom: 12 }}>
                  {query.message}
                </div>

                {respondingTo === query.id ? (
                  <div>
                    <textarea
                      value={response}
                      onChange={e => setResponse(e.target.value)}
                      placeholder="Type your response to the technician..."
                      rows={3}
                      style={{
                        width: '100%', padding: '9px 11px', marginBottom: 8,
                        border: `1px solid ${colors.border}`, borderRadius: 6,
                        fontSize: 12, fontFamily: fonts.sans, resize: 'vertical',
                        color: colors.textPrimary, boxSizing: 'border-box', lineHeight: 1.5, outline: 'none',
                      }}
                      onFocus={e => e.target.style.borderColor = colors.navy}
                      onBlur={e => e.target.style.borderColor = colors.border}
                      autoFocus
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleRespond(query)}
                        style={{
                          background: colors.navy, color: colors.white,
                          border: 'none', borderRadius: 5, padding: '8px 18px',
                          fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = colors.navyMid}
                        onMouseLeave={e => e.currentTarget.style.background = colors.navy}
                      >
                        Send Response
                      </button>
                      <button
                        onClick={() => { setRespondingTo(null); setResponse(''); }}
                        style={{
                          background: 'none', color: colors.textMuted,
                          border: `1px solid ${colors.border}`, borderRadius: 5, padding: '8px 14px',
                          fontSize: 12, cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setRespondingTo(query.id)}
                      style={{
                        background: colors.navy, color: colors.white,
                        border: 'none', borderRadius: 5, padding: '8px 18px',
                        fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = colors.navyMid}
                      onMouseLeave={e => e.currentTarget.style.background = colors.navy}
                    >
                      Respond
                    </button>
                    <button
                      onClick={() => prefillVault(query)}
                      style={{
                        background: 'none', color: colors.navy,
                        border: `1px solid ${colors.navy}`, borderRadius: 5, padding: '8px 16px',
                        fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = colors.navyLight}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
                      </svg>
                      Vault This Technique
                    </button>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Vault capture */}
        <section style={{
          background: colors.white,
          border: `1px solid ${colors.border}`,
          borderTop: `4px solid ${colors.navy}`,
          borderRadius: 8, padding: '20px 22px', marginBottom: 20,
        }}>
          <div style={{ marginBottom: 14 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: colors.textPrimary, margin: '0 0 3px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
              </svg>
              Capture a Technique
            </h2>
            <p style={{ fontSize: 12, color: colors.textMuted, margin: 0 }}>
              Document tribal knowledge — what you know, what new techs need to learn
            </p>
          </div>

          {/* Input mode buttons */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              style={{
                background: colors.navy, color: colors.white,
                border: `1px solid ${colors.navy}`, borderRadius: 6, padding: '7px 14px',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6, fontFamily: fonts.sans,
              }}
              onMouseEnter={e => e.currentTarget.style.background = colors.navyMid}
              onMouseLeave={e => e.currentTarget.style.background = colors.navy}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2"/><line x1="7" y1="9" x2="17" y2="9"/><line x1="7" y1="13" x2="13" y2="13"/>
              </svg>
              Text Entry
            </button>
            {[
              { label: 'Voice Memo', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg> },
              { label: 'Photo Upload', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
            ].map(m => (
              <button
                key={m.label}
                disabled
                title="Coming soon — AI transcription integration"
                style={{
                  background: 'none', color: colors.textMuted,
                  border: `1px solid ${colors.border}`, borderRadius: 6, padding: '7px 14px',
                  fontSize: 12, fontWeight: 500, cursor: 'not-allowed',
                  display: 'flex', alignItems: 'center', gap: 6, fontFamily: fonts.sans,
                  opacity: 0.6,
                }}
              >
                {m.icon} {m.label}
                <span style={{ fontSize: 9, fontFamily: fonts.mono, color: colors.textMuted, background: colors.border, padding: '1px 4px', borderRadius: 2, letterSpacing: 0.5 }}>
                  SOON
                </span>
              </button>
            ))}
          </div>

          <textarea
            id="vault-capture-textarea"
            value={captureText}
            onChange={e => setCaptureText(e.target.value)}
            placeholder="Describe the technique, watch-out, or procedure note. Be specific — include measurements, part numbers, or conditions that make a real difference..."
            rows={4}
            style={{
              width: '100%', padding: '10px 12px', marginBottom: 10,
              border: `1px solid ${colors.border}`, borderRadius: 6,
              fontSize: 13, fontFamily: fonts.sans, resize: 'vertical',
              color: colors.textPrimary, boxSizing: 'border-box', lineHeight: 1.6, outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = colors.navy}
            onBlur={e => e.target.style.borderColor = colors.border}
          />

          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label htmlFor="vault-step" style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, fontFamily: fonts.mono, letterSpacing: 0.4 }}>
                Step # (optional)
              </label>
              <input
                id="vault-step"
                value={captureStep}
                onChange={e => setCaptureStep(e.target.value)}
                placeholder="e.g. 51"
                style={{
                  width: 130, padding: '8px 10px',
                  border: `1px solid ${colors.border}`, borderRadius: 6,
                  fontSize: 12, fontFamily: fonts.sans, color: colors.textPrimary, outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = colors.navy}
                onBlur={e => e.target.style.borderColor = colors.border}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
              <label htmlFor="vault-phase" style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, fontFamily: fonts.mono, letterSpacing: 0.4 }}>
                Phase (optional)
              </label>
              <input
                id="vault-phase"
                value={capturePhase}
                onChange={e => setCapturePhase(e.target.value)}
                placeholder="e.g. Mechanical Assembly"
                style={{
                  width: '100%', padding: '8px 10px',
                  border: `1px solid ${colors.border}`, borderRadius: 6,
                  fontSize: 12, fontFamily: fonts.sans, color: colors.textPrimary, outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = colors.navy}
                onBlur={e => e.target.style.borderColor = colors.border}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              onClick={handleSubmitVault}
              disabled={!captureText.trim()}
              style={{
                background: captureText.trim() ? colors.navy : colors.border,
                color: colors.white,
                border: 'none', borderRadius: 6, padding: '10px 22px',
                fontSize: 13, fontWeight: 700,
                cursor: captureText.trim() ? 'pointer' : 'default',
                fontFamily: fonts.sans,
              }}
              onMouseEnter={e => { if (captureText.trim()) e.currentTarget.style.background = colors.navyMid; }}
              onMouseLeave={e => { if (captureText.trim()) e.currentTarget.style.background = colors.navy; }}
            >
              Submit to Vault
            </button>
            {submitted && (
              <span style={{ fontSize: 12, color: colors.green, fontWeight: 700 }}>
                ✓ Submitted — pending engineering review
              </span>
            )}
            {!submitted && (
              <span style={{ fontSize: 10, color: colors.textMuted, fontFamily: fonts.mono }}>
                Pending engineering review before publication
              </span>
            )}
          </div>
        </section>

        {/* My contributions */}
        <section style={{
          background: colors.white,
          border: `1px solid ${colors.border}`,
          borderRadius: 8, padding: '18px 22px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary, margin: 0 }}>
              My Vault Contributions
            </h2>
            <span style={{ fontSize: 10, color: colors.textMuted, fontFamily: fonts.mono }}>
              {myEntries.length} techniques · {totalCitations} total citations
            </span>
          </div>

          {myEntries.length === 0 ? (
            <div style={{ fontSize: 13, color: colors.textMuted, textAlign: 'center', padding: '20px 0', fontStyle: 'italic' }}>
              No vault entries yet. Capture your first technique above.
            </div>
          ) : (
            myEntries.map((entry, i) => (
              <div
                key={entry.id}
                style={{
                  paddingBottom: i < myEntries.length - 1 ? 14 : 0,
                  marginBottom: i < myEntries.length - 1 ? 14 : 0,
                  borderBottom: i < myEntries.length - 1 ? `1px solid ${colors.border}` : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 }}>
                  <div style={{ fontSize: 10, fontFamily: fonts.mono, color: colors.textMuted, fontWeight: 700, letterSpacing: 0.5 }}>
                    {entry.phase.toUpperCase()} · STEP {entry.stepId}
                  </div>
                  <div style={{
                    fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                    fontFamily: fonts.mono, letterSpacing: 0.4,
                    background: entry.citations > 0 ? colors.greenLight : colors.amberLight,
                    color: entry.citations > 0 ? '#177040' : '#7A3D00',
                  }}>
                    {entry.citations > 0 ? `✓ ${entry.citations} CITATIONS` : 'PENDING REVIEW'}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: colors.textPrimary, lineHeight: 1.55 }}>
                  {expandedEntry === entry.id || entry.technique.length <= 150
                    ? entry.technique
                    : entry.technique.slice(0, 150) + '...'}
                </div>
                {entry.technique.length > 150 && (
                  <button
                    onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                    style={{
                      background: 'none', border: 'none', padding: '3px 0',
                      fontSize: 11, color: colors.navy, cursor: 'pointer', fontFamily: fonts.sans,
                    }}
                  >
                    {expandedEntry === entry.id ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
