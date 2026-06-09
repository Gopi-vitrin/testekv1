import { useState } from 'react';
import { colors, fonts } from '../styles/tokens.js';
import StepCard from './StepCard.jsx';

function formatTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function CompletedRow({ step }) {
  return (
    <div style={{
      display: 'flex',
      gap: 8,
      padding: '6px 10px',
      alignItems: 'center',
      borderRadius: 4,
      borderBottom: `1px solid ${colors.border}`,
    }}>
      <div style={{
        width: 16, height: 16, borderRadius: '50%',
        background: colors.green, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span style={{ fontFamily: fonts.mono, fontSize: 10, color: '#177040', flexShrink: 0, width: 28 }}>
        #{step.id}
      </span>
      <span style={{ fontSize: 12, color: '#3d6e50', textDecoration: 'line-through', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {step.name}
      </span>
      <span style={{ fontSize: 11, color: '#177040', fontFamily: fonts.mono, flexShrink: 0, marginLeft: 8 }}>
        {formatTime(step.completedAt)}
      </span>
    </div>
  );
}

export default function StepList({ phases, knowledgeVault, onComplete, onFlag, onResolve }) {
  const [showAllCompleted, setShowAllCompleted] = useState(false);

  const activePhase = phases.find(p => p.status === 'active' || p.status === 'awaiting-signoff');
  if (!activePhase) return null;

  const completedSteps = activePhase.steps.filter(s => s.status === 'complete');
  const nonCompletedSteps = activePhase.steps.filter(s => s.status !== 'complete');
  const completedCount = completedSteps.length;
  const totalCount = activePhase.steps.length;
  const pct = Math.round((completedCount / totalCount) * 100);

  const SHOW_RECENT = 2;
  const recentCompleted = completedSteps.slice(-SHOW_RECENT);
  const olderCompleted = completedSteps.slice(0, -SHOW_RECENT);
  const hasHidden = olderCompleted.length > 0;

  return (
    <div>
      {/* Phase header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
        flexWrap: 'wrap',
        gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            background: colors.navy,
            color: colors.white,
            fontFamily: fonts.mono,
            fontSize: 10,
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: 4,
            letterSpacing: 1,
          }}>
            PHASE {activePhase.id}
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary }}>
            {activePhase.name}
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: colors.textMuted }}>
            Assigned: <strong style={{ color: colors.textPrimary }}>{activePhase.assignedTo}</strong>
          </span>
          <span style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted }}>
            {completedCount}/{totalCount} steps · {pct}%
          </span>
        </div>
      </div>

      {/* Phase progress mini-bar */}
      <div style={{ height: 4, background: colors.border, borderRadius: 2, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: colors.navy, borderRadius: 2, transition: 'width 0.4s ease' }} />
      </div>

      {/* Collapsed completed steps */}
      {completedCount > 0 && (
        <div style={{
          background: colors.greenLight,
          border: `1px solid #C3E6D2`,
          borderRadius: 6,
          marginBottom: 10,
          overflow: 'hidden',
        }}>
          {/* Header row */}
          <button
            onClick={() => setShowAllCompleted(v => !v)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderBottom: (showAllCompleted || recentCompleted.length > 0) ? `1px solid #C3E6D2` : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                background: colors.green,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#177040' }}>
                {completedCount} step{completedCount !== 1 ? 's' : ''} completed
              </span>
            </div>
            <span style={{ fontSize: 11, color: '#177040', fontFamily: fonts.mono }}>
              {showAllCompleted ? '▲ Collapse' : `▼ Show all`}
            </span>
          </button>

          {/* Expanded: all completed rows */}
          {showAllCompleted && (
            <div style={{ padding: '4px 0' }}>
              {completedSteps.map(step => <CompletedRow key={step.id} step={step} />)}
            </div>
          )}

          {/* Collapsed: show only recent 2, with count banner for older */}
          {!showAllCompleted && (
            <>
              {hasHidden && (
                <div style={{
                  padding: '5px 12px',
                  fontSize: 11,
                  color: '#177040',
                  background: 'rgba(26,127,75,0.06)',
                  textAlign: 'center',
                  fontFamily: fonts.mono,
                  borderBottom: `1px solid #C3E6D2`,
                }}>
                  + {olderCompleted.length} earlier step{olderCompleted.length !== 1 ? 's' : ''} complete
                </div>
              )}
              <div style={{ padding: '4px 0' }}>
                {recentCompleted.map(step => <CompletedRow key={step.id} step={step} />)}
              </div>
            </>
          )}
        </div>
      )}

      {/* Active / blocked / locked / awaiting-signoff steps */}
      {nonCompletedSteps.map(step => {
        const vaultHint = knowledgeVault
          ? knowledgeVault.find(v => v.stepId === step.id && v.citations > 0)
          : null;
        return (
          <StepCard
            key={step.id}
            step={step}
            phase={activePhase}
            phases={phases}
            vaultHint={vaultHint}
            onComplete={onComplete}
            onFlag={onFlag}
            onResolve={onResolve}
          />
        );
      })}
    </div>
  );
}
