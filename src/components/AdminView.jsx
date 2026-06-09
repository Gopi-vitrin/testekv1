import { colors, fonts } from '../styles/tokens.js';
import { TECHNICIANS } from '../data/initialState.js';

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
      if (step.status === 'blocked' || step.status === 'active' || step.status === 'awaiting-signoff') {
        return { step, phase };
      }
    }
  }
  return null;
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
}

function buildLeaderboard(vault) {
  const map = {};
  for (const e of vault) {
    if (!map[e.contributor]) map[e.contributor] = { name: e.contributor, count: 0, citations: 0 };
    map[e.contributor].count++;
    map[e.contributor].citations += e.citations;
  }
  return Object.values(map).sort((a, b) => b.citations - a.citations);
}

const BAR_COLORS = [colors.navy, colors.navyMid, colors.steel, '#5C7A99', '#4A6680'];
const BAR_TEXT_COLORS = [colors.navy, colors.navyMid, colors.steel, '#4A6075', '#3D5265'];

export default function AdminView({ projects, pendingApprovals, knowledgeVault, onSelectProject, onApprove }) {
  const leaderboard = buildLeaderboard(knowledgeVault);
  const maxCitations = Math.max(...leaderboard.map(l => l.citations), 1);
  const totalCitations = knowledgeVault.reduce((s, e) => s + e.citations, 0);
  const blockedCount = projects.reduce((n, p) =>
    n + p.phases.reduce((m, ph) => m + ph.steps.filter(s => s.status === 'blocked').length, 0), 0
  );

  return (
    <div style={{ background: colors.lightGray, minHeight: 'calc(100vh - 54px)', padding: '20px 24px' }}>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 22 }}>
        {[
          { label: 'Active Programs',   value: projects.length,          accent: colors.navy,  alert: false,                         fill: false },
          { label: 'Blocked Steps',     value: blockedCount,              accent: colors.red,   alert: blockedCount > 0,              fill: blockedCount > 0 },
          { label: 'Pending Sign-Off',  value: pendingApprovals.length,   accent: colors.amber, alert: pendingApprovals.length > 0,   fill: false },
          { label: 'Vault Techniques',  value: knowledgeVault.length,     accent: colors.navy,  alert: false,                         fill: false },
          { label: 'Total Citations',   value: totalCitations,            accent: colors.navyMid, alert: false,                       fill: false },
        ].map((kpi, i) => (
          <div key={i} style={{
            background: kpi.fill ? colors.red : colors.white,
            border: `1px solid ${kpi.alert ? kpi.accent : colors.border}`,
            borderTop: `3px solid ${kpi.accent}`,
            borderRadius: 8, padding: '14px 16px',
          }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: kpi.fill ? colors.white : kpi.alert ? kpi.accent : colors.textPrimary, marginBottom: 4, fontFamily: fonts.mono, lineHeight: 1 }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: 11, color: kpi.fill ? 'rgba(255,255,255,0.8)' : colors.textMuted, fontWeight: 600 }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>

        {/* Fleet status */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: colors.textPrimary, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            Fleet Status
            <span style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.textMuted, fontWeight: 400 }}>
              {projects.length} active programs
            </span>
          </div>

          {projects.map(project => {
            const stats = getProjectStats(project);
            const currentInfo = getCurrentStepInfo(project);
            const isBlocked = project.phases.some(ph => ph.steps.some(s => s.status === 'blocked'));
            const isAwaiting = project.phases.some(ph => ph.status === 'awaiting-signoff');
            const fatDays = daysUntil(project.plannedFATDate);
            const tech = TECHNICIANS[project.leadTech];
            const advisor = tech?.mentor ? TECHNICIANS[tech.mentor] : null;

            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onSelectProject(project.id)}
                style={{
                  background: colors.white,
                  border: `1px solid ${isBlocked ? colors.red : isAwaiting ? colors.amber : colors.border}`,
                  borderLeft: `5px solid ${isBlocked ? colors.red : isAwaiting ? colors.amber : colors.green}`,
                  borderRadius: 8, padding: '18px 20px', marginBottom: 12,
                  cursor: 'pointer',
                  transition: 'box-shadow 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(11,31,58,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.textMuted, letterSpacing: 1, marginBottom: 3 }}>
                      {project.id}
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: colors.textPrimary, margin: '0 0 2px', letterSpacing: -0.2 }}>
                      {project.name}
                    </h3>
                    <div style={{ fontSize: 12, color: colors.textMuted }}>{project.customer}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                    <span style={{
                      fontFamily: fonts.mono, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 4,
                      background: isBlocked ? colors.redLight : isAwaiting ? colors.amberLight : colors.greenLight,
                      color: isBlocked ? colors.red : isAwaiting ? '#7A3D00' : '#177040',
                    }}>
                      {isBlocked ? 'BLOCKED' : isAwaiting ? 'SIGN-OFF' : 'ON TRACK'}
                    </span>
                    {fatDays !== null && (
                      <span style={{
                        fontFamily: fonts.mono, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 4,
                        background: fatDays <= 21 ? colors.redLight : fatDays <= 45 ? colors.amberLight : colors.navyLight,
                        color: fatDays <= 21 ? colors.red : fatDays <= 45 ? '#7A3D00' : colors.navy,
                      }}>
                        FAT {fatDays <= 0 ? 'OVERDUE' : `in ${fatDays}d`} · {project.plannedFATDate}
                      </span>
                    )}
                  </div>
                </div>

                {/* Technician + advisor row */}
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
                  {tech && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: '50%',
                        background: '#2a5a3a',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 700, color: colors.white,
                      }}>
                        {tech.name.split(' ').map(p => p[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary }}>{tech.name}</div>
                        <div style={{ fontSize: 10, color: colors.textMuted, fontFamily: fonts.mono }}>{tech.title}</div>
                      </div>
                    </div>
                  )}
                  {advisor && (
                    <>
                      <span style={{ fontSize: 11, color: colors.border }}>·</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%',
                          background: colors.navyMid,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 8, fontWeight: 700, color: colors.white,
                        }}>
                          {advisor.name.split(' ').map(p => p[0]).join('')}
                        </div>
                        <span style={{ fontSize: 11, color: colors.textMuted }}>{advisor.name} <em style={{ fontSize: 10 }}>(advisor)</em></span>
                      </div>
                    </>
                  )}
                  {currentInfo && (
                    <>
                      <span style={{ fontSize: 11, color: colors.border }}>·</span>
                      <span style={{ fontSize: 11, color: colors.textMuted }}>
                        Phase {currentInfo.phase.id} — {currentInfo.phase.name}
                      </span>
                    </>
                  )}
                </div>

                {/* Current step */}
                {currentInfo && (
                  <div style={{
                    fontSize: 12,
                    background: isBlocked ? colors.redLight : colors.lightGray,
                    color: isBlocked ? colors.red : colors.textMuted,
                    borderRadius: 4, padding: '5px 10px', marginBottom: 12,
                    fontFamily: fonts.mono, lineHeight: 1.4,
                    borderLeft: `3px solid ${isBlocked ? colors.red : colors.border}`,
                  }}>
                    Step {currentInfo.step.id}: {currentInfo.step.name.length > 68
                      ? currentInfo.step.name.slice(0, 68) + '...'
                      : currentInfo.step.name}
                  </div>
                )}

                {/* Blocker reason if blocked */}
                {isBlocked && currentInfo?.step?.blockReason && (
                  <div style={{
                    fontSize: 11, color: colors.red, fontStyle: 'italic',
                    marginBottom: 12, lineHeight: 1.5, paddingLeft: 4,
                  }}>
                    "{currentInfo.step.blockReason.slice(0, 100)}{currentInfo.step.blockReason.length > 100 ? '...' : ''}"
                  </div>
                )}

                {/* Progress */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 11, color: colors.textMuted }}>
                      Phase {currentInfo?.phase.id || '—'} of 6
                    </span>
                    <span style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted }}>
                      {stats.done}/{stats.total} steps · {stats.pct}%
                    </span>
                  </div>
                  <div style={{ height: 7, background: colors.border, borderRadius: 3.5, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${stats.pct}%`,
                      background: isBlocked ? colors.red : isAwaiting ? colors.amber : colors.navy,
                      borderRadius: 3.5, transition: 'width 0.4s ease',
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Pending approvals */}
          {pendingApprovals.length > 0 && (
            <div style={{
              background: colors.white,
              border: `1px solid ${colors.amber}`,
              borderTop: `3px solid ${colors.amber}`,
              borderRadius: 8, padding: '16px 18px',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: colors.textPrimary, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={colors.amber} strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                Pending Sign-Off
                <span style={{ fontFamily: fonts.mono, fontSize: 10, color: '#7A3D00', background: colors.amberLight, padding: '2px 7px', borderRadius: 10 }}>
                  {pendingApprovals.length}
                </span>
              </div>
              {pendingApprovals.map(a => {
                const project = projects.find(p => p.id === a.projectId);
                return (
                  <div key={`${a.projectId}-${a.phaseId}`} style={{
                    paddingBottom: 14, marginBottom: 14,
                    borderBottom: `1px solid ${colors.border}`,
                  }}>
                    <div style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.textMuted, marginBottom: 2 }}>
                      {a.projectId} · Phase {a.phaseId}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: colors.textPrimary, marginBottom: 2 }}>
                      {a.phaseName}
                    </div>
                    {project && (
                      <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 3 }}>
                        {project.customer}
                      </div>
                    )}
                    <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 10 }}>
                      Submitted by <strong style={{ color: colors.textPrimary }}>{a.submittedBy}</strong>
                    </div>
                    <button
                      onClick={() => onApprove(a.projectId, a.phaseId)}
                      style={{
                        background: colors.green, color: colors.white,
                        border: 'none', borderRadius: 5, padding: '8px 0',
                        fontSize: 12, fontWeight: 700, cursor: 'pointer', width: '100%',
                        fontFamily: fonts.sans,
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#177040'}
                      onMouseLeave={e => e.currentTarget.style.background = colors.green}
                    >
                      ✓ Approve Phase Gate
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Knowledge Vault panel */}
          <div style={{
            background: colors.white,
            border: `1px solid ${colors.border}`,
            borderTop: `3px solid ${colors.navy}`,
            borderRadius: 8, padding: '16px 18px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: 7 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
                </svg>
                Knowledge Vault
              </div>
              <div style={{ fontSize: 10, color: colors.textMuted, fontFamily: fonts.mono }}>
                {knowledgeVault.length} techniques · {totalCitations} citations
              </div>
            </div>

            <div style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, letterSpacing: 1.1, fontFamily: fonts.mono, marginBottom: 12, textTransform: 'uppercase' }}>
              Contributor Leaderboard
            </div>

            {leaderboard.map((c, i) => {
              const tech = TECHNICIANS[c.name];
              const barColor = BAR_COLORS[i] || '#4A6680';
              const textColor = BAR_TEXT_COLORS[i] || '#3D5265';
              return (
                <div key={c.name} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: barColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 8, fontWeight: 700, color: colors.white, flexShrink: 0,
                    }}>
                      {c.name.split(' ').map(p => p[0]).join('')}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary }}>{c.name}</div>
                      {tech && <div style={{ fontSize: 9, color: colors.textMuted, fontFamily: fonts.mono }}>{tech.title} · {tech.yearsExp}yr</div>}
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: fonts.mono, fontSize: 13, fontWeight: 800, color: textColor }}>{c.citations}</div>
                      <div style={{ fontSize: 9, color: colors.textMuted }}>{c.count} technique{c.count !== 1 ? 's' : ''}</div>
                    </div>
                  </div>
                  <div style={{ height: 5, background: colors.border, borderRadius: 2.5, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.round((c.citations / maxCitations) * 100)}%`,
                      background: barColor, borderRadius: 2.5,
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
              );
            })}

            {/* Vault summary by phase */}
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${colors.border}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, letterSpacing: 1.1, fontFamily: fonts.mono, marginBottom: 10, textTransform: 'uppercase' }}>
                By Phase
              </div>
              {['Mechanical Assembly', 'Electrical Integration', 'Software & Controls', 'Calibration & Verification'].map(phaseName => {
                const count = knowledgeVault.filter(e => e.phase === phaseName).length;
                if (count === 0) return null;
                const verified = knowledgeVault.filter(e => e.phase === phaseName && e.citations > 0).length;
                return (
                  <div key={phaseName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: colors.textMuted }}>{phaseName}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span style={{ fontFamily: fonts.mono, fontSize: 10, fontWeight: 700, color: colors.textPrimary }}>{count}</span>
                      {verified > 0 && (
                        <span style={{ fontSize: 9, color: '#177040', background: colors.greenLight, padding: '1px 5px', borderRadius: 3, fontFamily: fonts.mono }}>
                          {verified} verified
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
