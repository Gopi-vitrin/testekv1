import { colors, fonts } from '../styles/tokens.js';

function formatTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function hoursWaiting(isoString) {
  if (!isoString) return '';
  const h = Math.floor((Date.now() - new Date(isoString)) / 3600000);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h waiting`;
  return `${h}h waiting`;
}

function SLAIndicator({ submittedAt }) {
  const h = Math.floor((Date.now() - new Date(submittedAt)) / 3600000);
  const target = 24;
  const pct = Math.min((h / target) * 100, 100);
  const color = pct >= 100 ? colors.red : pct >= 75 ? colors.amber : colors.green;
  return (
    <div style={{ minWidth: 100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: colors.textMuted, fontWeight: 600, letterSpacing: 0.5 }}>SLA 24H</span>
        <span style={{ fontFamily: fonts.mono, fontSize: 10, color, fontWeight: 700 }}>{h}h / {target}h</span>
      </div>
      <div style={{ height: 4, background: colors.border, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2 }} />
      </div>
    </div>
  );
}

export default function ApprovalsPanel({ pendingApprovals, projects, onApprove }) {
  return (
    <div style={{
      background: colors.white,
      border: `1px solid ${colors.border}`,
      borderTop: `3px solid ${pendingApprovals.length > 0 ? colors.amber : colors.border}`,
      borderRadius: 8,
      overflow: 'hidden',
      marginTop: 24,
    }}>
      <div style={{
        padding: '14px 20px',
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: pendingApprovals.length > 0 ? colors.amberLight : colors.white,
      }}>
        <span style={{ fontSize: 14 }}>⏳</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary }}>Pending Phase Approvals</span>
        <span style={{
          background: pendingApprovals.length > 0 ? colors.amber : colors.border,
          color: pendingApprovals.length > 0 ? colors.white : colors.textMuted,
          fontSize: 11,
          fontWeight: 700,
          padding: '1px 8px',
          borderRadius: 10,
          fontFamily: fonts.mono,
        }}>
          {pendingApprovals.length}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: colors.textMuted }}>
          Supervisor sign-off required to unlock next phase
        </span>
      </div>

      {pendingApprovals.length === 0 ? (
        <div style={{ padding: '20px', color: colors.textMuted, fontSize: 13 }}>
          No pending approvals — all phases are clear.
        </div>
      ) : (
        <div>
          {pendingApprovals.map(approval => {
            const project = projects.find(p => p.id === approval.projectId);
            const nextPhaseId = approval.phaseId + 1;
            const nextPhase = project?.phases.find(ph => ph.id === nextPhaseId);
            return (
              <div
                key={`${approval.projectId}-${approval.phaseId}`}
                style={{
                  padding: '16px 20px',
                  borderBottom: `1px solid ${colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted, marginBottom: 2 }}>
                    {approval.projectId}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: colors.textPrimary, marginBottom: 3 }}>
                    {project?.name || approval.projectId}
                  </div>
                  <div style={{ fontSize: 12, color: colors.textMuted }}>
                    Phase {approval.phaseId} — {approval.phaseName} complete
                  </div>
                  <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>
                    Submitted by <strong>{approval.submittedBy}</strong> · {formatTime(approval.submittedAt)}
                  </div>
                </div>

                <SLAIndicator submittedAt={approval.submittedAt} />

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <div style={{ fontSize: 11, color: colors.textMuted, textAlign: 'right' }}>
                    {hoursWaiting(approval.submittedAt)}
                  </div>
                  <button
                    onClick={() => onApprove(approval.projectId, approval.phaseId)}
                    style={{
                      background: colors.navy,
                      color: colors.white,
                      border: 'none',
                      borderRadius: 6,
                      padding: '10px 20px',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: fonts.sans,
                      whiteSpace: 'nowrap',
                      letterSpacing: 0.2,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = colors.navyMid}
                    onMouseLeave={e => e.currentTarget.style.background = colors.navy}
                  >
                    ✓ Approve &amp; Unlock Phase {nextPhaseId}
                    {nextPhase ? ` — ${nextPhase.name}` : ''}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
