import { colors, fonts } from '../styles/tokens.js';

function hoursAgo(isoString) {
  if (!isoString) return null;
  const diff = Date.now() - new Date(isoString).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h`;
  return `${h}h`;
}

function ageSeverity(isoString) {
  if (!isoString) return '#595959';
  const h = Math.floor((Date.now() - new Date(isoString).getTime()) / 3600000);
  if (h >= 48) return colors.red;
  if (h >= 16) return colors.amber;
  return '#595959';
}

export default function BlockedItemsPanel({ projects }) {
  const blocked = [];
  for (const project of projects) {
    for (const phase of project.phases) {
      for (const step of phase.steps) {
        if (step.status === 'blocked') {
          blocked.push({ project, phase, step });
        }
      }
    }
  }

  if (blocked.length === 0) return null;

  blocked.sort((a, b) => new Date(a.step.blockedAt) - new Date(b.step.blockedAt));

  return (
    <div style={{
      background: colors.white,
      border: `1px solid ${colors.border}`,
      borderTop: `3px solid ${colors.red}`,
      borderRadius: 8,
      marginBottom: 24,
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '14px 20px',
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: colors.redLight,
      }}>
        <span style={{ fontSize: 14 }}>🚩</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: colors.red }}>Blocked Items</span>
        <span style={{
          background: colors.red,
          color: colors.white,
          fontSize: 11,
          fontWeight: 700,
          padding: '1px 8px',
          borderRadius: 10,
          fontFamily: fonts.mono,
        }}>
          {blocked.length}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: colors.textMuted }}>
          Sorted by age — oldest first
        </span>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: colors.lightGray }}>
            {['Project', 'Phase', 'Step', 'Block Reason', 'Category', 'Age Blocked'].map(h => (
              <th key={h} style={{
                padding: '8px 16px',
                textAlign: 'left',
                fontSize: 10,
                fontWeight: 700,
                color: colors.textMuted,
                letterSpacing: 0.8,
                textTransform: 'uppercase',
                borderBottom: `1px solid ${colors.border}`,
                whiteSpace: 'nowrap',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {blocked.map(({ project, phase, step }, i) => {
            const ageColor = ageSeverity(step.blockedAt);
            return (
              <tr key={`${project.id}-${step.id}`} style={{
                borderBottom: i < blocked.length - 1 ? `1px solid ${colors.border}` : 'none',
                background: i % 2 === 0 ? colors.white : '#FAFBFD',
              }}>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ fontFamily: fonts.mono, fontSize: 11, fontWeight: 600, color: colors.navy }}>{project.id}</div>
                  <div style={{ fontSize: 12, color: colors.textMuted }}>{project.customer}</div>
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <span style={{ fontSize: 12, color: colors.textPrimary }}>Ph.{phase.id} — {phase.name}</span>
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <span style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted }}>#{step.id}</span>
                  <div style={{ fontSize: 12, color: colors.textPrimary, maxWidth: 200 }}>{step.name}</div>
                </td>
                <td style={{ padding: '10px 16px', maxWidth: 260 }}>
                  <span style={{ fontSize: 12, color: colors.textPrimary, fontStyle: 'italic' }}>"{step.blockReason}"</span>
                </td>
                <td style={{ padding: '10px 16px' }}>
                  {step.blockerCategory && (
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#7A3D00',
                      background: colors.amberLight,
                      padding: '2px 8px',
                      borderRadius: 4,
                      whiteSpace: 'nowrap',
                    }}>
                      {step.blockerCategory}
                    </span>
                  )}
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <span style={{
                    fontFamily: fonts.mono,
                    fontSize: 13,
                    fontWeight: 700,
                    color: ageColor,
                  }}>
                    {hoursAgo(step.blockedAt) || '—'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
