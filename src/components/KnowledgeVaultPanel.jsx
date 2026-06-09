import { useState } from 'react';
import { colors, fonts } from '../styles/tokens.js';

function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString);
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function buildLeaderboard(vault) {
  const map = {};
  for (const entry of vault) {
    if (!map[entry.contributor]) map[entry.contributor] = { name: entry.contributor, citations: 0, entries: 0 };
    map[entry.contributor].citations += entry.citations;
    map[entry.contributor].entries += 1;
  }
  return Object.values(map).sort((a, b) => b.citations - a.citations);
}

function EntryCard({ entry }) {
  const [expanded, setExpanded] = useState(false);
  const preview = entry.technique.length > 130 ? entry.technique.slice(0, 130) + '…' : entry.technique;

  return (
    <div
      className="anim-fade-in"
      style={{
        padding: '12px 14px',
        background: colors.white,
        border: `1px solid ${colors.border}`,
        borderLeft: `3px solid ${colors.navy}`,
        borderRadius: 6,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.textMuted, marginBottom: 2 }}>
            {entry.phase}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: colors.textPrimary, lineHeight: 1.3 }}>
            {entry.stepName.length > 55 ? entry.stepName.slice(0, 55) + '…' : entry.stepName}
          </div>
        </div>
        {entry.citations > 0 && (
          <div style={{
            flexShrink: 0,
            background: colors.navyLight,
            color: colors.navy,
            fontFamily: fonts.mono,
            fontSize: 10,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 10,
            whiteSpace: 'nowrap',
          }}>
            {entry.citations} cite{entry.citations !== 1 ? 's' : ''}
          </div>
        )}
        {entry.citations === 0 && (
          <div style={{
            flexShrink: 0,
            background: colors.greenLight,
            color: '#177040',
            fontFamily: fonts.mono,
            fontSize: 10,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 10,
          }}>
            NEW
          </div>
        )}
      </div>

      <div style={{ fontSize: 12, color: colors.textMuted, lineHeight: 1.55, marginBottom: 8 }}>
        {expanded ? entry.technique : preview}
        {!expanded && entry.technique.length > 130 && (
          <button
            onClick={() => setExpanded(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.navy, fontSize: 12, fontWeight: 600, padding: '0 0 0 4px' }}
          >
            Read more
          </button>
        )}
        {expanded && (
          <button
            onClick={() => setExpanded(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted, fontSize: 12, padding: '0 0 0 4px' }}
          >
            Collapse
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, fontSize: 11, color: colors.textMuted, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{
            width: 18, height: 18, borderRadius: '50%',
            background: colors.navy,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 8, fontWeight: 700, color: colors.white, flexShrink: 0,
          }}>
            {entry.contributor.split(' ').map(p => p[0]).join('').slice(0, 2)}
          </div>
          <span style={{ fontWeight: 500, color: colors.textPrimary }}>{entry.contributor}</span>
        </div>
        <span>· {timeAgo(entry.capturedAt)}</span>
        {entry.citations === 0 ? (
          <span style={{
            fontFamily: fonts.mono, fontSize: 9, fontWeight: 700,
            color: '#7A3D00', background: colors.amberLight,
            padding: '1px 6px', borderRadius: 3, letterSpacing: 0.5,
          }}>
            PENDING REVIEW
          </span>
        ) : (
          <span style={{
            fontFamily: fonts.mono, fontSize: 9, fontWeight: 700,
            color: '#177040', background: colors.greenLight,
            padding: '1px 6px', borderRadius: 3, letterSpacing: 0.5,
          }}>
            ✓ VERIFIED
          </span>
        )}
      </div>
    </div>
  );
}

export default function KnowledgeVaultPanel({ vault }) {
  const [showAll, setShowAll] = useState(false);

  if (!vault || vault.length === 0) return null;

  const totalCitations = vault.reduce((a, e) => a + e.citations, 0);
  const leaderboard = buildLeaderboard(vault);
  const maxCitations = leaderboard[0]?.citations || 1;
  const topThree = leaderboard.slice(0, 3);
  const recentEntries = vault.slice(0, showAll ? vault.length : 4);

  const RANK_COLORS = ['#B8860B', '#6B7C93', '#A0522D'];
  const RANK_LABELS = ['#1', '#2', '#3'];

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
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: `linear-gradient(135deg, #071528 0%, #162d52 100%)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 7,
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: colors.white,
          }}>
            🗂
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.white, letterSpacing: -0.2 }}>
              Knowledge Vault
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: fonts.mono, letterSpacing: 0.5 }}>
              {vault.length} TECHNIQUES · {totalCitations} TOTAL CITATIONS
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            fontFamily: fonts.mono, fontSize: 10,
            color: 'rgba(255,255,255,0.5)',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            padding: '4px 10px', borderRadius: 4, letterSpacing: 0.5,
          }}>
            TRIBAL KNOWLEDGE CAPTURE
          </div>
          <div style={{
            fontFamily: fonts.mono, fontSize: 10,
            color: 'rgba(74,222,128,0.85)',
            background: 'rgba(74,222,128,0.08)',
            border: '1px solid rgba(74,222,128,0.2)',
            padding: '4px 10px', borderRadius: 4, letterSpacing: 0.5,
          }}>
            ~65% MODULE REUSE
          </div>
        </div>
      </div>

      {/* Body — two column */}
      <div style={{ display: 'flex', gap: 0 }}>

        {/* Left: Leaderboard */}
        <div style={{
          width: 240,
          flexShrink: 0,
          borderRight: `1px solid ${colors.border}`,
          padding: '16px 18px',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: colors.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
            Top Contributors
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topThree.map((tech, idx) => (
              <div key={tech.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: fonts.mono, fontSize: 10, fontWeight: 700, color: RANK_COLORS[idx], width: 16 }}>
                      {RANK_LABELS[idx]}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: colors.textPrimary }}>{tech.name}</span>
                  </div>
                  <span style={{ fontFamily: fonts.mono, fontSize: 11, fontWeight: 700, color: colors.navy }}>
                    {tech.citations}
                  </span>
                </div>
                <div style={{ height: 5, background: colors.border, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.round((tech.citations / maxCitations) * 100)}%`,
                    background: idx === 0 ? colors.navy : idx === 1 ? '#6B7C93' : '#9BAEC0',
                    borderRadius: 3,
                    transition: 'width 0.6s ease',
                  }} />
                </div>
                <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 2 }}>
                  {tech.entries} technique{tech.entries !== 1 ? 's' : ''} · {tech.citations} citation{tech.citations !== 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>

          {/* All contributors */}
          {leaderboard.length > 3 && (
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${colors.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, marginBottom: 8 }}>All Contributors</div>
              {leaderboard.slice(3).map(tech => (
                <div key={tech.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: colors.textMuted, marginBottom: 4 }}>
                  <span>{tech.name}</span>
                  <span style={{ fontFamily: fonts.mono }}>{tech.citations}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recent technique cards */}
        <div style={{ flex: 1, padding: '16px 18px', minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: colors.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>
              Captured Techniques
            </div>
            <div style={{ fontSize: 11, color: colors.textMuted, fontFamily: fonts.mono }}>
              Sorted by most recent
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {recentEntries.map((entry, i) => (
              <div key={entry.id} style={{ animationDelay: `${i * 0.05}s` }}>
                <EntryCard entry={entry} />
              </div>
            ))}
          </div>
          {vault.length > 4 && (
            <button
              onClick={() => setShowAll(v => !v)}
              style={{
                marginTop: 12,
                background: 'none',
                border: `1px solid ${colors.border}`,
                borderRadius: 5,
                padding: '7px 16px',
                fontSize: 12,
                fontWeight: 600,
                color: colors.textMuted,
                cursor: 'pointer',
                width: '100%',
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = colors.navy; e.currentTarget.style.color = colors.navy; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.textMuted; }}
            >
              {showAll ? '▲ Show Less' : `▼ Show All ${vault.length} Techniques`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
