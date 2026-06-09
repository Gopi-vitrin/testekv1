import { useState, useEffect, useRef } from 'react';
import { colors, fonts } from '../styles/tokens.js';
import { TECHNICIANS } from '../data/initialState.js';
import StepCard from './StepCard.jsx';

function getProjectStats(project) {
  let total = 0, done = 0;
  for (const phase of project.phases) {
    for (const step of phase.steps) {
      total++;
      if (step.status === 'complete' || step.status === 'awaiting-signoff') done++;
    }
  }
  return { total, done, pct: Math.round((done / total) * 100) };
}

function getCurrentStepInfo(project) {
  for (const phase of project.phases) {
    for (const step of phase.steps) {
      if (step.status === 'active' || step.status === 'blocked' || step.status === 'awaiting-signoff') {
        return { step, phase };
      }
    }
  }
  return null;
}

function getNextSteps(project, currentStepId, count = 4) {
  const all = [];
  for (const phase of project.phases) {
    for (const step of phase.steps) all.push({ step, phase });
  }
  const idx = all.findIndex(s => s.step.id === currentStepId);
  if (idx === -1) return [];
  return all.slice(idx + 1, idx + 1 + count).filter(s => s.step.status === 'locked');
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
}

const MOCK_RESPONSES = [
  "Drawing revision mismatches at this phase usually resolve in 1–2 days. Document the specific connector reference discrepancy and photo the current harness routing now — it protects you and speeds up the engineering review.",
  "Your advisor R. Okonkwo resolved a similar harness routing conflict on TSK-2024-047 Phase 2. He's the right person to call — and he's flagged as available right now.",
  "The block has been open 3 days. Standard SLA for drawing revisions at Testek is 2 business days. I'd escalate to the engineering lead if you haven't already, and copy the Program Manager.",
  "While waiting for the corrected schematic, pre-stage the documentation for Step 52 (Phase 3 sign-off package). That keeps your critical path intact once the block resolves.",
  "Vault entry from T. Rodriguez covers a similar routing issue on hydraulic stands — the key is recording the delta between actual routing and P&ID before engineering arrives, so they can assess quickly.",
];

function AICopilot({ project, currentStepInfo }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const responseIdx = useRef(0);
  const endRef = useRef(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setThinking(true);
      setTimeout(() => {
        const tech = TECHNICIANS[project.leadTech];
        const step = currentStepInfo?.step;
        const isBlocked = step?.status === 'blocked';
        const text = isBlocked
          ? `Hi ${tech?.name?.split(' ')[1] || ''}. Step ${step.id} is blocked on "${step.blockerCategory || 'a mismatch'}". While engineering reviews:\n\n1. Photo and log the current harness routing\n2. Pre-stage Step 52 documentation\n3. Contact your advisor R. Okonkwo — he has resolved this exact issue before\n\nWhat do you need help with?`
          : `Hi ${tech?.name?.split(' ')[1] || ''}. You're on Step ${step?.id} in ${currentStepInfo?.phase?.name}.\n\nI have context on vault techniques, escalation paths, and next steps for this build. What do you need?`;
        setMessages([{ role: 'assistant', text }]);
        setThinking(false);
      }, 900);
    }
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  function send() {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    setThinking(true);
    setTimeout(() => {
      const r = MOCK_RESPONSES[responseIdx.current % MOCK_RESPONSES.length];
      responseIdx.current++;
      setMessages(prev => [...prev, { role: 'assistant', text: r }]);
      setThinking(false);
    }, 1100 + Math.random() * 600);
  }

  return (
    <>
      <style>{`
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>

      {/* Floating button */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Open AI Build Copilot"
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 300,
          width: 54, height: 54, borderRadius: '50%',
          background: open ? colors.navyMid : colors.navy,
          border: `2px solid ${colors.red}`,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(11,31,58,0.4)',
          transition: 'transform 0.2s, background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
        {!open && (
          <div style={{
            position: 'absolute', top: -1, right: -1,
            width: 14, height: 14, borderRadius: '50%',
            background: colors.red, border: '2px solid white',
          }} />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 90, right: 24, zIndex: 299,
          width: 348, height: 430,
          background: colors.white,
          border: `1px solid ${colors.border}`,
          borderTop: `3px solid ${colors.navy}`,
          borderRadius: 10,
          boxShadow: '0 10px 40px rgba(11,31,58,0.22)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ background: colors.navy, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%', background: colors.red,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: colors.white, fontSize: 13, fontWeight: 700 }}>Build Copilot</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 9, fontFamily: fonts.mono, letterSpacing: 0.8 }}>TESTEK AI · {project.id}</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflow: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '88%',
                  background: msg.role === 'user' ? colors.navy : colors.lightGray,
                  color: msg.role === 'user' ? colors.white : colors.textPrimary,
                  padding: '9px 12px',
                  borderRadius: msg.role === 'user' ? '12px 12px 3px 12px' : '3px 12px 12px 12px',
                  fontSize: 12, lineHeight: 1.55, whiteSpace: 'pre-wrap',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {thinking && (
              <div style={{ display: 'flex', gap: 5, padding: '6px 10px' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 7, height: 7, borderRadius: '50%', background: colors.textMuted,
                    animation: `dotBounce 1.3s ease-in-out ${i * 0.18}s infinite`,
                  }} />
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: `1px solid ${colors.border}`, display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Ask about this step, escalation, vault..."
              style={{
                flex: 1, padding: '8px 10px',
                border: `1px solid ${colors.border}`, borderRadius: 6,
                fontSize: 12, fontFamily: fonts.sans, outline: 'none', color: colors.textPrimary,
              }}
              onFocus={e => e.target.style.borderColor = colors.navy}
              onBlur={e => e.target.style.borderColor = colors.border}
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              aria-label="Send message"
              style={{
                background: input.trim() ? colors.navy : colors.border,
                border: 'none', borderRadius: 6, width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: input.trim() ? 'pointer' : 'default', flexShrink: 0,
                transition: 'background 0.15s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function TechnicianView({ projects, activeProjectId, knowledgeVault, onSelectProject, onComplete, onFlag, onResolve }) {
  const project = projects.find(p => p.id === activeProjectId) || projects[0];
  const tech = TECHNICIANS[project.leadTech];
  const advisor = tech?.mentor ? TECHNICIANS[tech.mentor] : null;
  const stats = getProjectStats(project);
  const currentInfo = getCurrentStepInfo(project);
  const nextSteps = currentInfo ? getNextSteps(project, currentInfo.step.id, 4) : [];
  const fatDays = daysUntil(project.plannedFATDate);

  const vaultHint = currentInfo
    ? knowledgeVault?.find(v => v.stepId === currentInfo.step.id && v.citations > 0)
    : null;

  const isBlocked = project.phases.some(ph => ph.steps.some(s => s.status === 'blocked'));

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
        {/* Technician identity */}
        {tech && (
          <div style={{ padding: '14px 14px 12px', borderBottom: `1px solid ${colors.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: advisor ? 10 : 0 }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: '#2a5a3a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: colors.white, flexShrink: 0,
              }}>
                {tech.name.split(' ').map(p => p[0]).join('')}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: colors.textPrimary }}>{tech.name}</div>
                <div style={{ fontSize: 10, color: colors.textMuted, fontFamily: fonts.mono }}>
                  {tech.title} · {tech.yearsExp}yr exp
                </div>
              </div>
            </div>

            {/* Advisor card */}
            {advisor && (
              <div style={{
                background: colors.navyLight,
                border: '1px solid #C5D6F0',
                borderRadius: 6, padding: '9px 10px',
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: colors.textMuted, letterSpacing: 1.1, marginBottom: 6, fontFamily: fonts.mono, textTransform: 'uppercase' }}>
                  Assigned Advisor
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: colors.navyMid,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, color: colors.white, flexShrink: 0,
                  }}>
                    {advisor.name.split(' ').map(p => p[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: colors.navy }}>{advisor.name}</div>
                    <div style={{ fontSize: 10, color: colors.textMuted, fontFamily: fonts.mono }}>{advisor.title}</div>
                  </div>
                </div>
                <button
                  style={{
                    width: '100%', background: colors.navy, color: colors.white,
                    border: 'none', borderRadius: 4, padding: '6px 0',
                    fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: fonts.sans,
                    letterSpacing: 0.3,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = colors.navyMid}
                  onMouseLeave={e => e.currentTarget.style.background = colors.navy}
                >
                  Contact Advisor
                </button>
              </div>
            )}
          </div>
        )}

        {/* Program list */}
        <div style={{ padding: '10px 14px 6px', fontSize: 9, fontWeight: 700, color: colors.textMuted, letterSpacing: 1.4, fontFamily: fonts.mono, textTransform: 'uppercase' }}>
          My Programs
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          {projects.map(p => {
            const isActive = p.id === project.id;
            const pBlocked = p.phases.some(ph => ph.steps.some(s => s.status === 'blocked'));
            const pAwaiting = p.phases.some(ph => ph.status === 'awaiting-signoff');
            const pStats = getProjectStats(p);
            return (
              <button
                key={p.id}
                onClick={() => onSelectProject(p.id)}
                style={{
                  width: '100%', textAlign: 'left',
                  background: isActive ? colors.navyLight : 'none',
                  border: 'none',
                  borderLeft: `3px solid ${isActive ? colors.red : 'transparent'}`,
                  padding: '10px 14px', cursor: 'pointer', display: 'block',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F8F9FC'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'none'; }}
              >
                <div style={{ fontFamily: fonts.mono, fontSize: 9, fontWeight: 700, color: isActive ? colors.navy : colors.textMuted, letterSpacing: 0.5, marginBottom: 2 }}>
                  {p.id}
                </div>
                <div style={{ fontSize: 11, fontWeight: isActive ? 700 : 400, color: isActive ? colors.textPrimary : colors.textMuted, lineHeight: 1.3, marginBottom: 5 }}>
                  {p.name}
                </div>
                <div style={{ height: 3, background: colors.border, borderRadius: 2, overflow: 'hidden', marginBottom: 4 }}>
                  <div style={{ height: '100%', width: `${pStats.pct}%`, background: pBlocked ? colors.red : pAwaiting ? colors.amber : colors.navy, borderRadius: 2 }} />
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                  <span style={{ fontFamily: fonts.mono, fontSize: 9, color: colors.textMuted }}>{pStats.pct}%</span>
                  {pBlocked && <span style={{ fontSize: 9, fontWeight: 700, color: colors.red, background: colors.redLight, padding: '1px 5px', borderRadius: 3 }}>BLOCKED</span>}
                  {!pBlocked && pAwaiting && <span style={{ fontSize: 9, fontWeight: 700, color: '#7A3D00', background: colors.amberLight, padding: '1px 5px', borderRadius: 3 }}>SIGN-OFF</span>}
                  {!pBlocked && !pAwaiting && <span style={{ fontSize: 9, fontWeight: 700, color: '#177040', background: colors.greenLight, padding: '1px 5px', borderRadius: 3 }}>ON TRACK</span>}
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '20px 24px', overflow: 'auto', minWidth: 0 }}>

        {/* Project header */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.textMuted, letterSpacing: 1, marginBottom: 4 }}>
            {project.id} · {project.customer}
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: colors.textPrimary, letterSpacing: -0.3, marginBottom: 8 }}>
            {project.name}
          </h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {currentInfo && (
              <span style={{ fontFamily: fonts.mono, fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 4, background: colors.navyLight, color: colors.navy }}>
                Phase {currentInfo.phase.id} of 6 — {currentInfo.phase.name}
              </span>
            )}
            {isBlocked && (
              <span style={{ fontFamily: fonts.mono, fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 4, background: colors.redLight, color: colors.red }}>
                🚩 BLOCKED
              </span>
            )}
            {fatDays !== null && (
              <span style={{
                fontFamily: fonts.mono, fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 4,
                background: fatDays <= 21 ? colors.redLight : fatDays <= 45 ? colors.amberLight : colors.navyLight,
                color: fatDays <= 21 ? colors.red : fatDays <= 45 ? '#7A3D00' : colors.navy,
              }}>
                FAT {fatDays <= 0 ? 'OVERDUE' : `in ${fatDays}d`} · {project.plannedFATDate}
              </span>
            )}
            <span style={{ fontSize: 11, color: colors.textMuted, fontFamily: fonts.mono }}>
              {stats.done}/{stats.total} steps · {stats.pct}%
            </span>
          </div>
        </div>

        {/* Phase progress bar */}
        <div style={{
          background: colors.white, border: `1px solid ${colors.border}`,
          borderRadius: 8, padding: '14px 20px', marginBottom: 16,
        }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            {project.phases.map(phase => {
              const isDone = phase.status === 'complete';
              const isCurrent = currentInfo?.phase.id === phase.id;
              const phasePct = isCurrent
                ? Math.round((phase.steps.filter(s => s.status === 'complete').length / phase.steps.length) * 100)
                : 0;
              return (
                <div key={phase.id} style={{ flex: 1, minWidth: 0 }}>
                  <div title={phase.name} style={{
                    height: 8, borderRadius: 4,
                    background: isDone ? colors.green : isCurrent ? '#C5D6F0' : colors.border,
                    position: 'relative', overflow: 'hidden',
                    marginBottom: 4,
                  }}>
                    {isCurrent && (
                      <div style={{
                        position: 'absolute', top: 0, left: 0, bottom: 0,
                        width: `${phasePct}%`, background: colors.navy, borderRadius: 4,
                      }} />
                    )}
                  </div>
                  <div style={{
                    fontSize: 8, fontFamily: fonts.mono, letterSpacing: 0.3,
                    color: isDone ? colors.green : isCurrent ? colors.navy : colors.border,
                    fontWeight: isCurrent ? 700 : 400,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    P{phase.id}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 12, color: colors.textMuted }}>
            {currentInfo && (
              <>
                <strong style={{ color: colors.textPrimary }}>{currentInfo.phase.name}</strong>
                {' · '}
                {currentInfo.phase.steps.filter(s => s.status === 'complete').length}/{currentInfo.phase.steps.length} steps
                <span style={{ margin: '0 10px', opacity: 0.35 }}>|</span>
              </>
            )}
            Overall: <strong style={{ color: colors.textPrimary }}>{stats.pct}%</strong> · {stats.done} of {stats.total} steps complete
          </div>
        </div>

        {/* Blocked escalation banner */}
        {isBlocked && currentInfo && (
          <div style={{
            background: '#FFF2F2',
            border: `1px solid ${colors.red}`,
            borderLeft: `5px solid ${colors.red}`,
            borderRadius: 8, padding: '12px 16px',
            marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.red} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: colors.red, marginBottom: 3 }}>
                Step {currentInfo.step.id} is Blocked
              </div>
              {currentInfo.step.blockReason && (
                <div style={{ fontSize: 12, color: '#7A1515', lineHeight: 1.5, marginBottom: 6 }}>
                  {currentInfo.step.blockReason}
                </div>
              )}
              <div style={{ fontSize: 12, color: colors.red }}>
                Contact your advisor <strong>{advisor?.name}</strong> or use the AI Copilot for next steps.
              </div>
            </div>
          </div>
        )}

        {/* Current step */}
        {currentInfo ? (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, letterSpacing: 1.2, fontFamily: fonts.mono, marginBottom: 10, textTransform: 'uppercase' }}>
              Current Step
            </div>
            <StepCard
              step={currentInfo.step}
              phase={currentInfo.phase}
              phases={project.phases}
              vaultHint={vaultHint}
              onComplete={(stepId, note, vaultEntry) => onComplete(project.id, stepId, note, vaultEntry)}
              onFlag={(stepId, reason, category) => onFlag(project.id, stepId, reason, category)}
              onResolve={stepId => onResolve(project.id, stepId)}
            />
          </div>
        ) : (
          <div style={{
            background: colors.greenLight, border: `1px solid #C3E6D2`,
            borderRadius: 8, padding: '24px', textAlign: 'center', marginBottom: 16,
          }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>✓</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.green }}>All steps complete</div>
          </div>
        )}

        {/* Upcoming steps */}
        {nextSteps.length > 0 && (
          <div style={{
            background: colors.white, border: `1px solid ${colors.border}`,
            borderRadius: 8, padding: '14px 20px',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, letterSpacing: 1.2, fontFamily: fonts.mono, marginBottom: 10, textTransform: 'uppercase' }}>
              Coming Up
            </div>
            {nextSteps.map(({ step, phase }, i) => (
              <div key={step.id} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                paddingBottom: i < nextSteps.length - 1 ? 10 : 0,
                marginBottom: i < nextSteps.length - 1 ? 10 : 0,
                borderBottom: i < nextSteps.length - 1 ? `1px solid ${colors.border}` : 'none',
                opacity: 0.7,
              }}>
                <div style={{ fontFamily: fonts.mono, fontSize: 10, fontWeight: 700, color: colors.textMuted, width: 30, flexShrink: 0, paddingTop: 1 }}>
                  #{step.id}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: colors.textMuted, lineHeight: 1.4 }}>{step.name}</div>
                  {step.isPhaseGate && (
                    <span style={{ fontSize: 9, fontFamily: fonts.mono, fontWeight: 700, color: '#7A3D00', background: colors.amberLight, padding: '1px 5px', borderRadius: 3, marginTop: 3, display: 'inline-block' }}>PHASE GATE</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* AI Copilot */}
      <AICopilot project={project} currentStepInfo={currentInfo} />
    </div>
  );
}
