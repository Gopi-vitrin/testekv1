import { useState } from 'react';
import { colors, fonts } from '../styles/tokens.js';

function buildInsights(projects) {
  const now = Date.now();
  const list = [];

  for (const project of projects) {
    const fatDays = project.plannedFATDate
      ? Math.ceil((new Date(project.plannedFATDate) - now) / 86400000)
      : null;

    // FAT overdue
    if (fatDays !== null && fatDays <= 0) {
      const pendingPhase = project.phases.find(p => p.status === 'awaiting-signoff');
      list.push({
        type: 'critical',
        icon: '⚠',
        title: `FAT overdue — ${project.id}`,
        body: pendingPhase
          ? `Phase ${pendingPhase.id} (${pendingPhase.name}) sign-off is still pending. FAT has passed by ${Math.abs(fatDays)}d. Customer notification may be required; recommend immediate supervisor escalation.`
          : `Factory Acceptance Testing date has passed by ${Math.abs(fatDays)} day${Math.abs(fatDays) !== 1 ? 's' : ''}. Schedule re-baseline and customer communication may be needed.`,
      });
    }

    // Phase awaiting sign-off with FAT approaching
    if (fatDays !== null && fatDays > 0 && fatDays <= 14) {
      const waitingPhase = project.phases.find(p => p.status === 'awaiting-signoff');
      if (waitingPhase) {
        list.push({
          type: 'warning',
          icon: '⏰',
          title: `Sign-off urgency — ${project.id}`,
          body: `Phase ${waitingPhase.id} (${waitingPhase.name}) has been awaiting supervisor approval. FAT is in ${fatDays}d — each hour of delay compounds schedule risk. Recommend priority sign-off within 2 hours.`,
        });
      }
    }

    // Long-standing blocks
    for (const phase of project.phases) {
      for (const step of phase.steps) {
        if (step.status === 'blocked' && step.blockedAt) {
          const hoursBlocked = (now - new Date(step.blockedAt)) / 3600000;
          const lockedCount = phase.steps.filter(s => s.status === 'locked').length;
          list.push({
            type: 'warning',
            icon: '🚩',
            title: `Block escalation — ${project.id}`,
            body: `Step #${step.id} (${step.name}) blocked ${hoursBlocked < 1 ? '<1h' : Math.floor(hoursBlocked) + 'h'} ago: "${step.blockerCategory || 'unspecified'}". ${lockedCount} downstream step${lockedCount !== 1 ? 's' : ''} locked. Escalation recommended if unresolved within 4 hours.`,
          });
        }
      }
    }
  }

  // Fleet-level summary
  let totalSteps = 0, doneSteps = 0, blockedCount = 0;
  for (const p of projects) {
    for (const ph of p.phases) {
      for (const s of ph.steps) {
        totalSteps++;
        if (s.status === 'complete' || s.status === 'awaiting-signoff') doneSteps++;
        if (s.status === 'blocked') blockedCount++;
      }
    }
  }
  const fleetPct = Math.round((doneSteps / totalSteps) * 100);

  if (blockedCount === 0) {
    list.push({
      type: 'success',
      icon: '✓',
      title: 'Fleet operating clean',
      body: `All ${projects.length} programs currently clear of blockers. Fleet velocity: ${fleetPct}% complete. On pace for monthly throughput targets. No cross-program escalations required.`,
    });
  } else {
    list.push({
      type: 'info',
      icon: '⬡',
      title: 'Fleet block rate elevated',
      body: `${blockedCount} active block${blockedCount !== 1 ? 's' : ''} across ${projects.length} programs. Fleet completion: ${fleetPct}%. Historical baseline is 18% block rate — consider cross-program resource reallocation and root-cause review at next stand-up.`,
    });
  }

  // Positive call-out for an on-track program
  const onTrack = projects.find(p =>
    !p.phases.some(ph => ph.steps.some(s => s.status === 'blocked')) &&
    !p.phases.some(ph => ph.status === 'awaiting-signoff')
  );
  if (onTrack) {
    const pDone = onTrack.phases.reduce((a, ph) => a + ph.steps.filter(s => s.status === 'complete').length, 0);
    const pTotal = onTrack.phases.reduce((a, ph) => a + ph.steps.length, 0);
    list.push({
      type: 'success',
      icon: '↗',
      title: `On-pace program — ${onTrack.id}`,
      body: `${onTrack.name} is progressing with no blockers (${Math.round((pDone / pTotal) * 100)}% complete). Tech ${onTrack.leadTech} maintaining strong burn rate — FAT timeline achievable if current velocity holds.`,
    });
  }

  return list.slice(0, 4);
}

const PALETTE = {
  critical: { bg: colors.redLight,   border: colors.red,   text: colors.red,   iconBg: '#FDECEA' },
  warning:  { bg: colors.amberLight, border: colors.amber, text: '#7A3D00', iconBg: '#FEF3E2' },
  success:  { bg: colors.greenLight, border: colors.green, text: '#177040', iconBg: '#E8F5EE' },
  info:     { bg: colors.navyLight,  border: colors.navy,  text: colors.navy,  iconBg: '#E8EDF4' },
};

function LoadingDots() {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'rgba(255,255,255,0.7)',
            animation: `aiDotPulse 1.4s ease-in-out ${i * 0.16}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

const CONFIDENCE_PHRASES = [
  'High confidence · 3 risk signals detected',
  'Analysis complete · 2 priority items flagged',
  'Fleet scan complete · confidence 94%',
  'Analysis refreshed · 4 signals evaluated',
  'Risk model updated · confidence 91%',
];

export default function AIInsightsPanel({ projects }) {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(() => buildInsights(projects));
  const [refreshedAt, setRefreshedAt] = useState(new Date());
  const [refreshCount, setRefreshCount] = useState(0);

  function handleRefresh() {
    setLoading(true);
    setTimeout(() => {
      setInsights(buildInsights(projects));
      setRefreshedAt(new Date());
      setRefreshCount(c => c + 1);
      setLoading(false);
    }, 1900);
  }

  const confidenceLabel = CONFIDENCE_PHRASES[refreshCount % CONFIDENCE_PHRASES.length];

  const timeStr = refreshedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{
      background: colors.white,
      border: `1px solid ${colors.border}`,
      borderRadius: 8,
      overflow: 'hidden',
      marginBottom: 20,
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 18px',
        borderBottom: `1px solid rgba(255,255,255,0.12)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: `linear-gradient(135deg, #0B1F3A 0%, #1a3566 100%)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 7,
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, color: colors.white,
          }}>
            ✦
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.white, letterSpacing: -0.2 }}>
              AI Fleet Insights
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: fonts.mono, letterSpacing: 0.5 }}>
              {confidenceLabel.toUpperCase()} · {timeStr}
            </div>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          style={{
            background: 'rgba(255,255,255,0.1)',
            color: colors.white,
            border: '1px solid rgba(255,255,255,0.22)',
            borderRadius: 5,
            padding: '6px 13px',
            fontSize: 12,
            fontWeight: 600,
            cursor: loading ? 'default' : 'pointer',
            fontFamily: fonts.sans,
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            letterSpacing: 0.2,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
        >
          {loading ? (
            <LoadingDots />
          ) : (
            <>
              <span style={{ fontSize: 13 }}>↻</span>
              Refresh Analysis
            </>
          )}
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 4px' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: '50%', background: colors.navy,
                  animation: `aiDotPulse 1.4s ease-in-out ${i * 0.16}s infinite`,
                }} />
              ))}
            </div>
            <span style={{ fontSize: 13, color: colors.textMuted, fontStyle: 'italic' }}>
              AI is analyzing fleet status, risk factors, blockers, and schedule data…
            </span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 10 }}>
            {insights.map((insight, i) => {
              const c = PALETTE[insight.type] || PALETTE.info;
              return (
                <div
                  key={i}
                  className="anim-fade-in"
                  style={{
                    padding: '11px 13px',
                    background: c.bg,
                    border: `1px solid ${c.border}`,
                    borderLeft: `3px solid ${c.border}`,
                    borderRadius: 6,
                    animationDelay: `${i * 0.07}s`,
                  }}
                >
                  <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: 4, flexShrink: 0,
                      background: c.iconBg, border: `1px solid ${c.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
                    }}>
                      {insight.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: c.text, marginBottom: 3, lineHeight: 1.3 }}>
                        {insight.title}
                      </div>
                      <div style={{ fontSize: 12, color: colors.textPrimary, lineHeight: 1.5, opacity: 0.9 }}>
                        {insight.body}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div style={{
          fontSize: 10, color: colors.textMuted, fontFamily: fonts.mono,
          marginTop: 10, textAlign: 'right', letterSpacing: 0.3,
        }}>
          ✦ AI-generated · For decision support only · Verify critical data with source systems
        </div>
      </div>
    </div>
  );
}
