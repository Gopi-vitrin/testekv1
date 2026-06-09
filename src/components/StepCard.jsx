import { useState } from 'react';
import { colors, fonts } from '../styles/tokens.js';
import { BLOCKER_CATEGORIES } from '../data/initialState.js';

const AI_VAULT_DRAFTS = {
  1:  'Check all four frame diagonals in addition to length and width — 1/16" racking at this stage accumulates to 3/8" misalignment at the manifold surface. Record all measurements including diagonals in the inspection sheet.',
  3:  'Torque uprights in a diagonal star pattern (center pair first, alternate outward) rather than clockwise. This prevents frame racking under cyclic hydraulic load. Confirm all fasteners to spec per ENG-MECH-047 using a calibrated torque wrench.',
  8:  'Leave 10% extra slack on return lines before clamping — return side sees thermal expansion under max load. Mark final clamp positions with a paint pen before tightening to make post-test inspection easier.',
  10: 'Perform pressure test in two stages: hold at 50% rated pressure for 5 min before stepping to 150%. Inspect all joints at the 50% hold — catching weeps early prevents test stand teardown. Torque hydraulic fittings in two passes (50% then full spec) to avoid brass seat deformation.',
  23: 'Segregate power and signal cables to opposite sides of the cable tray. On servo-hydraulic stands, drive PWM frequency couples into signal cables on the same tray and causes erratic transducer readings above 4,000 PSI. Document cable routing in the as-built drawing package.',
  33: 'Record insulation resistance values per circuit in the test log — not just pass/fail. Baseline readings provide a reference for field troubleshooting years after delivery. Values below 100 MΩ at 1 kV warrant investigation before proceeding.',
  46: 'Start with P-only at gain 0.5 and achieve stable null before introducing integral term. Adding I too early with large initial error causes integrator windup that trips the pressure safety on first auto-mode engagement. Document final PID parameters in the configuration record.',
  53: 'Zero all transducers after a 15-minute warm-up at ambient temperature — not immediately on power-up. Cold zero drifts 0.2–0.4% full-scale on common unit types. Record ambient temp at time of zero in the calibration log.',
};

function getDraftTechnique(step, phase) {
  if (AI_VAULT_DRAFTS[step.id]) return AI_VAULT_DRAFTS[step.id];
  return `Document all key measurements, parameter values, and observations at time of completing "${step.name}". Note the ambient conditions (temperature, humidity) if calibration or leak testing is involved. Capturing specific readings — not just pass/fail — provides a historical baseline that helps future technicians distinguish normal variation from genuine out-of-spec conditions.`;
}

const AI_RESOLUTIONS = {
  'Missing kit / parts not received': [
    'Check procurement status in ERP system — verify PO number and current ETA',
    'Contact Supply Chain directly; confirm with vendor if shipment is in transit',
    'Escalate to Program Manager if ETA is >24h past required on-dock date',
    'Identify any certified substitute parts or alternate sources (document deviation)',
    'Log material shortage in quality system with expected resolution date',
  ],
  'Calibration tool unavailable': [
    'Submit calibration tool request to Metrology lab via work order system',
    'Check tool crib for certified alternate with valid calibration status',
    'Contact adjacent shift or program for shared-tool access agreement',
    'Request calibration expedite from lab if FAT is within 48 hours',
    'Confirm all instrument recall dates are current in MET-Track before use',
  ],
  'Engineering hold / question': [
    'Submit Engineering Query (EQ) through PLM system with drawing reference',
    'Tag Lead Engineer and Program Manager in EQ for immediate visibility',
    'Include current vs. expected condition with photo documentation',
    'Request formal disposition within 4 hours if step is on critical path',
    'Identify non-hold adjacent steps to maintain productivity while awaiting response',
  ],
  'Drawing revision mismatch': [
    'Contact Engineering Lead to request current approved drawing package',
    'Verify ECO status in PLM system — confirm latest approved revision letter',
    'Cross-reference assembly router to determine the required revision',
    'If ECO is pending, request engineering hold waiver for non-critical steps',
    'Document discrepancy in quality log (actual rev. vs. required rev.) with date/time',
  ],
  'QA hold / inspection pending': [
    'Contact QA Inspector to schedule first-article or in-process inspection',
    'Verify all pre-inspection prerequisites: torque records, test data, cleanliness',
    'Confirm inspection criteria per Quality Plan on file for this program',
    'If QA is unavailable, escalate to Quality Manager to assign alternate inspector',
    'Protect hardware and preserve work area per handling procedures during hold',
  ],
  'Awaiting material certification': [
    'Contact receiving/inspection for status of incoming material cert package',
    'Submit cert request to vendor via procurement — flag as urgent',
    'Check if an existing lot cert can be applied per engineering disposition',
    'Escalate to Material Review Board if cert delay exceeds 8 hours',
    'Document cert gap in quality system with expected resolution timestamp',
  ],
  'Equipment malfunction': [
    'Tag-out and secure malfunctioning equipment per LOTO procedure immediately',
    'Notify Facilities/Maintenance — submit high-priority work order with symptoms',
    'Identify alternate test equipment or approved workaround fixture',
    'Contact OEM field service engineer if equipment is under active warranty',
    'Document malfunction mode in equipment log for root-cause analysis',
  ],
  'Customer information pending': [
    'Notify Program Manager of the open information gap immediately',
    'Document open question in Action Item log with responsible party assigned',
    'Identify adjacent build steps to maintain productivity while awaiting response',
    'Set 2-hour follow-up reminder; escalate to PM if no response by then',
    'Capture all customer communication in program records for audit trail',
  ],
  'Other': [
    'Document the specific block in the quality system with full description',
    'Notify Supervisor and Program Manager immediately with impact assessment',
    'Identify all affected downstream steps and quantify schedule impact',
    'Hold a quick team stand-up to explore resolution options and assign owner',
    'Set a 4-hour resolution target; update status at each hour check-in',
  ],
};

function getResolution(category) {
  return AI_RESOLUTIONS[category] || AI_RESOLUTIONS['Other'];
}

function formatTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function hoursAgo(isoString) {
  if (!isoString) return '';
  const h = Math.floor((Date.now() - new Date(isoString)) / 3600000);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h`;
  if (h > 0) return `${h}h`;
  return '<1h';
}

export default function StepCard({ step, phase, phases, vaultHint, onComplete, onFlag, onResolve }) {
  const [note, setNote] = useState('');
  const [showFlagInput, setShowFlagInput] = useState(false);
  const [category, setCategory] = useState(BLOCKER_CATEGORIES[0]);
  const [blockReason, setBlockReason] = useState('');
  const [completing, setCompleting] = useState(false);
  const [aiSuggestionOpen, setAiSuggestionOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [vaultThis, setVaultThis] = useState(false);
  const [vaultDesc, setVaultDesc] = useState('');
  const [vaultDrafting, setVaultDrafting] = useState(false);

  function handleAISuggest() {
    setAiSuggestionOpen(true);
    if (aiSuggestions) return;
    setAiLoading(true);
    setTimeout(() => {
      setAiSuggestions(getResolution(step.blockerCategory));
      setAiLoading(false);
    }, 1100);
  }

  function handleVaultDraft() {
    setVaultDrafting(true);
    setTimeout(() => {
      setVaultDesc(getDraftTechnique(step, phase));
      setVaultDrafting(false);
    }, 1300);
  }

  function handleComplete() {
    setCompleting(true);
    const vaultEntry = vaultThis && vaultDesc.trim()
      ? { technique: vaultDesc.trim(), stepId: step.id, stepName: step.name, phase: phase.name, contributor: phase.assignedTo }
      : null;
    setTimeout(() => {
      onComplete(step.id, note, vaultEntry);
      setNote('');
      setVaultThis(false);
      setVaultDesc('');
      setCompleting(false);
    }, 350);
  }

  function handleFlag() {
    if (!blockReason.trim()) return;
    onFlag(step.id, blockReason.trim(), category);
    setBlockReason('');
    setShowFlagInput(false);
  }

  // COMPLETED
  if (step.status === 'complete') {
    return (
      <div style={{
        display: 'flex',
        gap: 10,
        padding: '10px 14px',
        background: colors.greenLight,
        border: `1px solid #C3E6D2`,
        borderLeft: `3px solid ${colors.green}`,
        borderRadius: 5,
        marginBottom: 6,
        alignItems: 'flex-start',
      }}>
        <div style={{
          width: 20, height: 20, borderRadius: '50%',
          background: colors.green,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginTop: 1,
        }}>
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: fonts.mono, fontSize: 10, fontWeight: 600, color: '#177040', flexShrink: 0 }}>
              #{step.id}
            </span>
            <span style={{ fontSize: 13, color: '#3d6e50', textDecoration: 'line-through' }}>{step.name}</span>
          </div>
          <div style={{ fontSize: 11, color: '#177040', marginTop: 2, fontFamily: fonts.mono }}>
            {formatTime(step.completedAt)}
          </div>
          {step.note && (
            <div style={{ fontSize: 11, color: '#2a5a3a', marginTop: 3, fontStyle: 'italic', opacity: 0.8 }}>
              "{step.note}"
            </div>
          )}
        </div>
      </div>
    );
  }

  // BLOCKED
  if (step.status === 'blocked') {
    return (
      <div
        className="anim-fade-in"
        style={{
          padding: '14px 16px',
          background: colors.redLight,
          border: `1px solid #F5C6CB`,
          borderLeft: `4px solid ${colors.red}`,
          borderRadius: 5,
          marginBottom: 8,
          animation: 'blockPulse 0.5s ease-out',
        }}
      >
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
          <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>🚩</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{ fontFamily: fonts.mono, fontSize: 10, fontWeight: 700, color: colors.red, background: colors.redLight, border: `1px solid ${colors.red}`, padding: '1px 6px', borderRadius: 3 }}>
                BLOCKED #{step.id}
              </span>
              {step.blockerCategory && (
                <span style={{ fontSize: 11, fontWeight: 600, color: '#7A3D00', background: colors.amberLight, padding: '1px 7px', borderRadius: 3 }}>
                  {step.blockerCategory}
                </span>
              )}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary, marginBottom: 6, lineHeight: 1.3 }}>
              {step.name}
            </div>
            <div style={{ fontSize: 13, color: colors.red, fontStyle: 'italic', marginBottom: 6, lineHeight: 1.4 }}>
              "{step.blockReason}"
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 11, color: colors.textMuted }}>
              <span>Flagged {formatTime(step.blockedAt)}</span>
              <span style={{ fontFamily: fonts.mono, fontWeight: 700, color: colors.red }}>
                {hoursAgo(step.blockedAt)} ago
              </span>
            </div>
          </div>
        </div>
        {/* AI Suggestion panel */}
        {aiSuggestionOpen && (
          <div className="anim-fade-in" style={{
            marginTop: 12,
            padding: '12px 14px',
            background: `linear-gradient(135deg, #F0F4FA 0%, #E8EDF4 100%)`,
            border: `1px solid ${colors.border}`,
            borderLeft: `3px solid ${colors.navy}`,
            borderRadius: 6,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
              <span style={{ fontSize: 13 }}>✦</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: colors.navy }}>AI Resolution Suggestions</span>
              <span style={{ fontSize: 10, color: colors.textMuted, fontFamily: fonts.mono }}>
                · {step.blockerCategory || 'General'}
              </span>
              <button
                onClick={() => setAiSuggestionOpen(false)}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted, fontSize: 16, lineHeight: 1, padding: 0 }}
              >×</button>
            </div>
            {aiLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 0' }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 5, height: 5, borderRadius: '50%', background: colors.navy,
                      animation: `aiDotPulse 1.4s ease-in-out ${i * 0.16}s infinite`,
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: 12, color: colors.textMuted, fontStyle: 'italic' }}>
                  Analyzing block category and generating resolution steps…
                </span>
              </div>
            ) : (
              <ol style={{ paddingLeft: 18, margin: 0 }}>
                {aiSuggestions?.map((tip, i) => (
                  <li key={i} style={{
                    fontSize: 12,
                    color: colors.textPrimary,
                    lineHeight: 1.55,
                    marginBottom: i < aiSuggestions.length - 1 ? 5 : 0,
                    animation: `aiReveal 0.25s ease-out ${i * 0.06}s both`,
                  }}>
                    {tip}
                  </li>
                ))}
              </ol>
            )}
            <div style={{ fontSize: 10, color: colors.textMuted, fontFamily: fonts.mono, marginTop: 9 }}>
              ✦ AI-generated · Verify all actions per program procedures
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          <button
            onClick={() => onResolve(step.id)}
            style={{
              background: colors.white,
              color: colors.red,
              border: `1.5px solid ${colors.red}`,
              borderRadius: 5,
              padding: '7px 16px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: fonts.sans,
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = colors.red; e.currentTarget.style.color = colors.white; }}
            onMouseLeave={e => { e.currentTarget.style.background = colors.white; e.currentTarget.style.color = colors.red; }}
          >
            ✓ Resolve Block
          </button>
          {!aiSuggestionOpen && (
            <button
              onClick={handleAISuggest}
              style={{
                background: `linear-gradient(135deg, #0B1F3A 0%, #1a3566 100%)`,
                color: colors.white,
                border: 'none',
                borderRadius: 5,
                padding: '7px 14px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: fonts.sans,
                letterSpacing: 0.2,
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              ✦ AI Suggest Resolution
            </button>
          )}
        </div>
      </div>
    );
  }

  // AWAITING SIGN-OFF
  if (step.status === 'awaiting-signoff') {
    return (
      <div style={{
        padding: '14px 16px',
        background: colors.amberLight,
        border: `1px solid #F0C070`,
        borderLeft: `4px solid ${colors.amber}`,
        borderRadius: 5,
        marginBottom: 8,
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>⏳</span>
          <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontFamily: fonts.mono, fontSize: 10, fontWeight: 700, color: colors.amber, border: `1px solid ${colors.amber}`, padding: '1px 6px', borderRadius: 3 }}>
                PHASE GATE #{step.id}
              </span>
              <span style={{
                background: colors.amber, color: colors.white,
                fontSize: 10, fontWeight: 700, padding: '1px 8px', borderRadius: 3, letterSpacing: 0.5,
              }}>
                AWAITING SUPERVISOR SIGN-OFF
              </span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary, marginBottom: 5 }}>
              {step.name}
            </div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>
              Completed {formatTime(step.completedAt)} — next phase locked until supervisor approves
            </div>
            {step.note && (
              <div style={{ fontSize: 12, color: '#7a4d00', marginTop: 5, fontStyle: 'italic' }}>
                "{step.note}"
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // LOCKED
  if (step.status === 'locked') {
    return (
      <div style={{
        display: 'flex',
        gap: 10,
        padding: '8px 14px',
        background: colors.lightGray,
        border: `1px solid ${colors.border}`,
        borderRadius: 4,
        marginBottom: 4,
        alignItems: 'center',
      }}>
        <span style={{ fontSize: 12, color: colors.textMuted, flexShrink: 0 }}>🔒</span>
        <span style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.textMuted, flexShrink: 0 }}>#{step.id}</span>
        <span style={{ fontSize: 12, color: colors.textMuted }}>{step.name}</span>
      </div>
    );
  }

  // ACTIVE
  return (
    <div
      className="anim-fade-in"
      style={{
        padding: '18px 20px',
        background: colors.white,
        border: `1.5px solid ${colors.border}`,
        borderLeft: `4px solid ${colors.navy}`,
        borderRadius: 6,
        marginBottom: 10,
        boxShadow: '0 2px 10px rgba(11,31,58,0.07)',
        opacity: completing ? 0.6 : 1,
        transition: 'opacity 0.3s',
      }}
    >
      {/* Step header */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{
          background: colors.navy,
          color: colors.white,
          fontFamily: fonts.mono,
          fontSize: 11,
          fontWeight: 600,
          padding: '4px 9px',
          borderRadius: 4,
          flexShrink: 0,
          letterSpacing: 0.5,
          marginTop: 1,
        }}>
          STEP {step.id}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary, lineHeight: 1.35 }}>
            {step.name}
          </div>
          {phase && (
            <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 3 }}>
              Assigned: <strong style={{ color: colors.textPrimary }}>{phase.assignedTo || '—'}</strong>
              {step.isPhaseGate && (
                <span style={{
                  marginLeft: 10,
                  fontFamily: fonts.mono,
                  fontSize: 10,
                  color: '#7A3D00',
                  background: colors.amberLight,
                  padding: '1px 6px',
                  borderRadius: 3,
                  fontWeight: 700,
                }}>
                  PHASE GATE
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Vault hint for this step — learning moment for new recruit */}
      {vaultHint && (
        <div className="anim-fade-in" style={{
          display: 'flex', gap: 8, alignItems: 'flex-start',
          padding: '10px 12px',
          background: '#FFFBEB',
          border: `1px solid #F0C070`,
          borderLeft: `3px solid ${colors.amber}`,
          borderRadius: 5,
          marginBottom: 14,
        }}>
          <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#7A3D00' }}>Advisor Tip</span>
              <span style={{ fontFamily: fonts.mono, fontSize: 9, color: '#7A3D00', background: colors.amberLight, padding: '1px 6px', borderRadius: 3 }}>
                {vaultHint.citations} cite{vaultHint.citations !== 1 ? 's' : ''} · from {vaultHint.contributor}
              </span>
            </div>
            <div style={{ fontSize: 12, color: colors.textPrimary, lineHeight: 1.5 }}>
              {vaultHint.technique.length > 160 ? vaultHint.technique.slice(0, 160) + '…' : vaultHint.technique}
            </div>
          </div>
        </div>
      )}

      {/* Phase gate: show next assigned tech */}
      {step.isPhaseGate && phases && (() => {
        const nextPhase = phases.find(p => p.id === phase.id + 1);
        if (!nextPhase) return null;
        return (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px',
            background: colors.navyLight,
            border: `1px solid #C5D6F0`,
            borderLeft: `3px solid ${colors.navy}`,
            borderRadius: 5,
            marginBottom: 14,
            fontSize: 12,
          }}>
            <span style={{ fontSize: 14 }}>⟶</span>
            <span style={{ color: colors.textMuted }}>Next phase:</span>
            <span style={{ fontWeight: 700, color: colors.textPrimary }}>{nextPhase.name}</span>
            <span style={{ color: colors.textMuted }}>→ assigned to</span>
            <span style={{ fontWeight: 700, color: colors.navy }}>{nextPhase.assignedTo}</span>
          </div>
        );
      })()}

      {/* Note input */}
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Add a completion note (optional) — e.g. torque values, measurements, observations"
        rows={2}
        style={{
          width: '100%',
          padding: '9px 12px',
          fontSize: 13,
          border: `1px solid ${colors.border}`,
          borderRadius: 5,
          resize: 'vertical',
          marginBottom: 10,
          fontFamily: fonts.sans,
          color: colors.textPrimary,
          background: colors.lightGray,
          outline: 'none',
          lineHeight: 1.5,
          transition: 'border-color 0.15s',
        }}
        onFocus={e => e.target.style.borderColor = colors.navy}
        onBlur={e => e.target.style.borderColor = colors.border}
      />

      {/* Vault This Technique toggle */}
      <div style={{ marginBottom: 14 }}>
        <button
          onClick={() => setVaultThis(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: vaultThis ? colors.navyLight : 'none',
            border: `1px solid ${vaultThis ? colors.navy : colors.border}`,
            borderRadius: 5,
            padding: '6px 12px',
            fontSize: 12,
            fontWeight: 600,
            color: vaultThis ? colors.navy : colors.textMuted,
            cursor: 'pointer',
            transition: 'background 0.15s, border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { if (!vaultThis) { e.currentTarget.style.borderColor = colors.navy; e.currentTarget.style.color = colors.navy; } }}
          onMouseLeave={e => { if (!vaultThis) { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.textMuted; } }}
        >
          <span style={{ fontSize: 13 }}>🗂</span>
          Vault This Technique
          {vaultThis && <span style={{ fontFamily: fonts.mono, fontSize: 10, marginLeft: 4, color: colors.navy }}>ON</span>}
        </button>

        {vaultThis && (
          <div className="anim-fade-in" style={{
            marginTop: 10,
            padding: '12px 14px',
            background: colors.navyLight,
            border: `1px solid #C5D6F0`,
            borderLeft: `3px solid ${colors.navy}`,
            borderRadius: 6,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: colors.navy, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Technique / Lesson Learned
              </label>
              <button
                onClick={handleVaultDraft}
                disabled={vaultDrafting}
                style={{
                  background: vaultDrafting ? 'rgba(11,31,58,0.08)' : `linear-gradient(135deg, #0B1F3A 0%, #1a3566 100%)`,
                  color: vaultDrafting ? colors.textMuted : colors.white,
                  border: 'none',
                  borderRadius: 4,
                  padding: '5px 11px',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: vaultDrafting ? 'default' : 'pointer',
                  fontFamily: fonts.sans,
                  display: 'flex', alignItems: 'center', gap: 5,
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => { if (!vaultDrafting) e.currentTarget.style.opacity = '0.85'; }}
                onMouseLeave={e => { if (!vaultDrafting) e.currentTarget.style.opacity = '1'; }}
              >
                {vaultDrafting ? (
                  <>
                    <div style={{ display: 'flex', gap: 3 }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{
                          width: 4, height: 4, borderRadius: '50%', background: colors.textMuted,
                          animation: `aiDotPulse 1.4s ease-in-out ${i * 0.16}s infinite`,
                        }} />
                      ))}
                    </div>
                    Drafting…
                  </>
                ) : (
                  <><span>✦</span> AI Draft</>
                )}
              </button>
            </div>
            <textarea
              value={vaultDesc}
              onChange={e => setVaultDesc(e.target.value)}
              placeholder="Describe the technique, trick, or lesson learned for this step — what would help the next technician do this better?"
              rows={3}
              style={{
                width: '100%',
                padding: '8px 10px',
                fontSize: 12,
                border: `1px solid #C5D6F0`,
                borderRadius: 5,
                resize: 'vertical',
                marginBottom: 6,
                fontFamily: fonts.sans,
                color: colors.textPrimary,
                background: colors.white,
                outline: 'none',
                lineHeight: 1.55,
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = colors.navy}
              onBlur={e => e.target.style.borderColor = '#C5D6F0'}
            />
            {/* Media capture options */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              <button
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: colors.white, border: `1px solid ${colors.border}`,
                  borderRadius: 4, padding: '4px 10px', fontSize: 11,
                  color: colors.textMuted, cursor: 'pointer', fontFamily: fonts.sans,
                  transition: 'border-color 0.12s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = colors.navy}
                onMouseLeave={e => e.currentTarget.style.borderColor = colors.border}
                onClick={() => {}}
                title="Attach voice memo — AI will transcribe and draft"
              >
                🎤 Voice Memo
              </button>
              <button
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: colors.white, border: `1px solid ${colors.border}`,
                  borderRadius: 4, padding: '4px 10px', fontSize: 11,
                  color: colors.textMuted, cursor: 'pointer', fontFamily: fonts.sans,
                  transition: 'border-color 0.12s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = colors.navy}
                onMouseLeave={e => e.currentTarget.style.borderColor = colors.border}
                onClick={() => {}}
                title="Attach photo documentation"
              >
                📷 Photo
              </button>
              <span style={{ fontSize: 10, color: colors.textMuted, alignSelf: 'center', fontStyle: 'italic' }}>
                AI will draft from recording
              </span>
            </div>
            <div style={{ fontSize: 10, color: colors.textMuted, fontFamily: fonts.mono }}>
              Contributor: {phase.assignedTo} · Pending engineering review before vault publication
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={handleComplete}
          disabled={completing}
          style={{
            background: completing ? colors.green : colors.navy,
            color: colors.white,
            border: 'none',
            borderRadius: 6,
            padding: '10px 22px',
            fontSize: 14,
            fontWeight: 700,
            cursor: completing ? 'default' : 'pointer',
            fontFamily: fonts.sans,
            letterSpacing: 0.2,
            transition: 'background 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
          onMouseEnter={e => { if (!completing) e.currentTarget.style.background = colors.navyMid; }}
          onMouseLeave={e => { if (!completing) e.currentTarget.style.background = colors.navy; }}
        >
          {completing ? '✓ Saving…' : vaultThis && vaultDesc.trim() ? '✓ Complete & Vault Technique' : '✓ Mark Complete'}
        </button>

        {!showFlagInput && (
          <button
            onClick={() => setShowFlagInput(true)}
            style={{
              background: colors.white,
              color: colors.red,
              border: `1.5px solid ${colors.red}`,
              borderRadius: 6,
              padding: '10px 18px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: fonts.sans,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = colors.redLight}
            onMouseLeave={e => e.currentTarget.style.background = colors.white}
          >
            🚩 Flag as Blocked
          </button>
        )}
      </div>

      {/* Flag input */}
      {showFlagInput && (
        <div
          className="anim-fade-in"
          style={{
            marginTop: 14,
            padding: '14px 16px',
            background: colors.redLight,
            border: `1px solid #F5C6CB`,
            borderRadius: 6,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: colors.red, marginBottom: 10 }}>
            Report a block — select reason category and describe
          </div>

          {/* Category selector */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, letterSpacing: 0.5, display: 'block', marginBottom: 5 }}>
              BLOCK CATEGORY
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {BLOCKER_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    background: category === cat ? colors.red : colors.white,
                    color: category === cat ? colors.white : colors.red,
                    border: `1px solid ${colors.red}`,
                    borderRadius: 4,
                    padding: '4px 10px',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.12s, color 0.12s',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Free text detail */}
          <label style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, letterSpacing: 0.5, display: 'block', marginBottom: 5 }}>
            DESCRIPTION (required)
          </label>
          <textarea
            value={blockReason}
            onChange={e => setBlockReason(e.target.value)}
            placeholder="Describe what is blocking this step and what action is needed…"
            rows={2}
            style={{
              width: '100%',
              padding: '8px 10px',
              fontSize: 13,
              border: `1px solid #F5C6CB`,
              borderRadius: 5,
              resize: 'vertical',
              marginBottom: 10,
              fontFamily: fonts.sans,
              color: colors.textPrimary,
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleFlag}
              disabled={!blockReason.trim()}
              style={{
                background: blockReason.trim() ? colors.red : '#ccc',
                color: colors.white,
                border: 'none',
                borderRadius: 5,
                padding: '8px 18px',
                fontSize: 13,
                fontWeight: 700,
                cursor: blockReason.trim() ? 'pointer' : 'not-allowed',
                fontFamily: fonts.sans,
              }}
            >
              Confirm Block Report
            </button>
            <button
              onClick={() => { setShowFlagInput(false); setBlockReason(''); }}
              style={{
                background: 'none',
                color: colors.textMuted,
                border: `1px solid ${colors.border}`,
                borderRadius: 5,
                padding: '8px 14px',
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: fonts.sans,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
