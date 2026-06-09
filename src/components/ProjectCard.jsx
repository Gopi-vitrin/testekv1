import { colors, fonts } from '../styles/tokens.js';

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

function getActivePhase(project) {
  return project.phases.find(p => p.status === 'active' || p.status === 'awaiting-signoff') || project.phases[0];
}

function getActiveStep(project) {
  for (const phase of project.phases) {
    for (const step of phase.steps) {
      if (step.status === 'active' || step.status === 'blocked' || step.status === 'awaiting-signoff') return step;
    }
  }
  return null;
}

function hasBlocked(project) {
  return project.phases.some(ph => ph.steps.some(s => s.status === 'blocked'));
}

function hasAwaitingSignoff(project) {
  return project.phases.some(ph => ph.status === 'awaiting-signoff');
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / 86400000);
}

function FATBadge({ project }) {
  const activePhaseId = (project.phases.find(p => p.status === 'active' || p.status === 'awaiting-signoff') || {}).id || 0;
  if (activePhaseId < 3) return null;
  const days = daysUntil(project.plannedFATDate);
  if (days === null) return null;
  const color = days <= 7 ? colors.red : days <= 21 ? '#7A3D00' : colors.textMuted;
  return (
    <div style={{ fontSize: 11, color, fontFamily: fonts.mono, fontWeight: 600, marginTop: 6 }}>
      FAT: {days <= 0 ? 'OVERDUE' : `${days}d`} · {project.plannedFATDate}
    </div>
  );
}

export default function ProjectCard({ project, onSelect }) {
  const stats = getProjectStats(project);
  const activePhase = getActivePhase(project);
  const activeStep = getActiveStep(project);
  const blocked = hasBlocked(project);
  const awaitingSignoff = hasAwaitingSignoff(project);

  let badge;
  if (blocked) {
    badge = { label: 'BLOCKED', bg: colors.redLight, color: colors.red };
  } else if (awaitingSignoff) {
    badge = { label: 'AWAITING SIGN-OFF', bg: colors.amberLight, color: '#7A3D00' };
  } else {
    badge = { label: 'ON TRACK', bg: colors.greenLight, color: '#177040' };
  }

  const topBorderColor = blocked ? colors.red : awaitingSignoff ? colors.amber : colors.green;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(project.id)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(project.id); } }}
      aria-label={`Open ${project.name} — ${project.customer} in Technician View`}
      className="anim-fade-in"
      style={{
        background: colors.white,
        border: `1px solid ${colors.border}`,
        borderTop: `3px solid ${topBorderColor}`,
        borderRadius: 8,
        padding: '18px 20px',
        cursor: 'pointer',
        transition: 'box-shadow 0.15s, transform 0.1s',
        position: 'relative',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(11,31,58,0.11)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ fontFamily: fonts.mono, fontSize: 10, fontWeight: 600, color: colors.textMuted, letterSpacing: 1, marginBottom: 4 }}>
            {project.id}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary, lineHeight: 1.25, maxWidth: 220 }}>
            {project.name}
          </div>
        </div>
        <span style={{
          background: badge.bg,
          color: badge.color,
          fontSize: 10,
          fontWeight: 700,
          padding: '3px 9px',
          borderRadius: 4,
          letterSpacing: 0.6,
          whiteSpace: 'nowrap',
          fontFamily: fonts.mono,
          marginLeft: 10,
          flexShrink: 0,
        }}>
          {badge.label}
        </span>
      </div>

      {/* Customer + lead */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 12, color: colors.textMuted, fontWeight: 500 }}>
          &#9679; {project.customer}
        </span>
        <span style={{ fontSize: 11, color: colors.textMuted }}>
          Lead: {project.leadTech}
        </span>
      </div>

      {/* Phase + step */}
      <div style={{
        background: colors.lightGray,
        border: `1px solid ${colors.border}`,
        borderRadius: 5,
        padding: '8px 12px',
        marginBottom: 12,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: colors.textPrimary }}>
            Phase {activePhase.id} — {activePhase.name}
          </span>
          <span style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted }}>
            {activeStep ? `#${activeStep.id}` : '—'} / {stats.total}
          </span>
        </div>
        {activeStep && (
          <div style={{ fontSize: 11, color: colors.textMuted, lineHeight: 1.3, marginTop: 2 }}>
            {blocked ? '🚩 ' : awaitingSignoff ? '⏳ ' : '▶ '}
            {activeStep.name.length > 58 ? activeStep.name.slice(0, 58) + '…' : activeStep.name}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ height: 6, background: colors.border, borderRadius: 3, overflow: 'hidden', marginBottom: 4 }}>
          <div style={{
            height: '100%',
            width: `${stats.pct}%`,
            background: blocked ? colors.red : awaitingSignoff ? colors.amber : colors.navy,
            borderRadius: 3,
            transition: 'width 0.4s ease',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: fonts.mono, fontSize: 12, fontWeight: 600, color: colors.textPrimary }}>
            {stats.pct}%
          </span>
          <span style={{ fontSize: 11, color: colors.textMuted }}>
            {stats.done} of {stats.total} steps
          </span>
        </div>
      </div>

      <FATBadge project={project} />

      {/* Click hint */}
      <div style={{ marginTop: 12, fontSize: 11, color: colors.textMuted, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ fontSize: 9 }}>▶</span> Open in Technician View
      </div>
    </div>
  );
}
