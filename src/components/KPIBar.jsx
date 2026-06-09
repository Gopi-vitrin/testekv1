import { colors, fonts } from '../styles/tokens.js';

function Tile({ value, label, color, accent }) {
  return (
    <div style={{
      flex: 1,
      background: colors.white,
      border: `1px solid ${colors.border}`,
      borderTop: `3px solid ${accent}`,
      borderRadius: 6,
      padding: '14px 18px',
      minWidth: 0,
    }}>
      <div style={{
        fontFamily: fonts.mono,
        fontSize: 28,
        fontWeight: 600,
        color: accent,
        lineHeight: 1,
        marginBottom: 4,
      }}>
        {value}
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, letterSpacing: 0.8, textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  );
}

export default function KPIBar({ projects, pendingApprovals, vaultCount = 0 }) {
  const totalActive = projects.length;
  const blocked = projects.filter(p => p.phases.some(ph => ph.steps.some(s => s.status === 'blocked'))).length;
  const awaitingSignoff = pendingApprovals.length;
  const onTrack = projects.filter(p =>
    !p.phases.some(ph => ph.steps.some(s => s.status === 'blocked')) &&
    !p.phases.some(ph => ph.status === 'awaiting-signoff')
  ).length;

  let totalComplete = 0, totalSteps = 0;
  for (const p of projects) {
    for (const ph of p.phases) {
      for (const s of ph.steps) {
        totalSteps++;
        if (s.status === 'complete' || s.status === 'awaiting-signoff') totalComplete++;
      }
    }
  }
  const overallPct = Math.round((totalComplete / totalSteps) * 100);

  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
      <Tile value={totalActive}    label="Active Projects"      accent={colors.navy}  />
      <Tile value={blocked}        label="Projects Blocked"     accent={blocked > 0 ? colors.red : colors.green} />
      <Tile value={awaitingSignoff}label="Awaiting Sign-off"    accent={awaitingSignoff > 0 ? colors.amber : colors.green} />
      <Tile value={onTrack}        label="On Track"             accent={colors.green} />
      <Tile value={vaultCount}     label="Vault Techniques"     accent={colors.navyMid} />
      <div style={{
        flex: 1.5,
        background: colors.white,
        border: `1px solid ${colors.border}`,
        borderTop: `3px solid ${colors.navy}`,
        borderRadius: 6,
        padding: '14px 18px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, letterSpacing: 0.8, textTransform: 'uppercase' }}>
            Fleet Progress
          </span>
          <span style={{ fontFamily: fonts.mono, fontSize: 14, fontWeight: 600, color: colors.navy }}>
            {totalComplete}/{totalSteps} steps
          </span>
        </div>
        <div style={{ height: 8, background: colors.border, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${overallPct}%`, background: colors.navy, borderRadius: 4, transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ fontFamily: fonts.mono, fontSize: 20, fontWeight: 600, color: colors.navy, marginTop: 4 }}>
          {overallPct}%
        </div>
      </div>
    </div>
  );
}
