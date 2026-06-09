const TECHS = ['M. Chen', 'K. Williams', 'J. Patel', 'T. Rodriguez', 'S. Kim', 'R. Okonkwo'];

const PHASE_DEFS = [
  {
    id: 1, name: 'Mechanical Assembly',
    assignedTo: 'T. Rodriguez',
    steps: [
      { id: 1,  name: 'Inspect and verify base frame dimensions per drawing TSK-BF-001',         isPhaseGate: false },
      { id: 2,  name: 'Install leveling pads and confirm floor load capacity',                    isPhaseGate: false },
      { id: 3,  name: 'Mount main structural uprights — torque to spec per ENG-MECH-047',         isPhaseGate: false },
      { id: 4,  name: 'Install hydraulic reservoir mounting brackets',                            isPhaseGate: false },
      { id: 5,  name: 'Attach hydraulic manifold assembly to mounting plate',                     isPhaseGate: false },
      { id: 6,  name: 'Install main pump motor and align shaft coupling',                         isPhaseGate: false },
      { id: 7,  name: 'Route hydraulic supply lines — high pressure circuit',                     isPhaseGate: false },
      { id: 8,  name: 'Route hydraulic return lines — low pressure circuit',                      isPhaseGate: false },
      { id: 9,  name: 'Install hydraulic filter assemblies (supply and return)',                   isPhaseGate: false },
      { id: 10, name: 'Pressure test hydraulic circuit at 150% rated pressure — hold 30 min',     isPhaseGate: false },
      { id: 11, name: 'Install pneumatic supply manifold and regulators',                         isPhaseGate: false },
      { id: 12, name: 'Route pneumatic lines per P&ID drawing TSK-PN-003',                        isPhaseGate: false },
      { id: 13, name: 'Install mechanical interlocks and limit switches',                         isPhaseGate: false },
      { id: 14, name: 'Mount operator console frame',                                             isPhaseGate: false },
      { id: 15, name: 'Install cable management tray system',                                     isPhaseGate: false },
      { id: 16, name: 'Verify all mechanical fasteners torqued to spec — sign off checklist',     isPhaseGate: false },
      { id: 17, name: 'Dimensional inspection — record all critical measurements',                isPhaseGate: false },
      { id: 18, name: 'Phase 1 internal review and documentation package complete',               isPhaseGate: true  },
    ],
  },
  {
    id: 2, name: 'Electrical Integration',
    assignedTo: 'K. Williams',
    steps: [
      { id: 19, name: 'Install main electrical enclosure and verify grounding',                   isPhaseGate: false },
      { id: 20, name: 'Pull power distribution cables from main disconnect',                      isPhaseGate: false },
      { id: 21, name: 'Terminate high-voltage feeds at MCC panel',                               isPhaseGate: false },
      { id: 22, name: 'Install control transformer and verify output voltages',                   isPhaseGate: false },
      { id: 23, name: 'Route control wiring harness — Zone A',                                   isPhaseGate: false },
      { id: 24, name: 'Route control wiring harness — Zone B',                                   isPhaseGate: false },
      { id: 25, name: 'Install I/O terminal blocks and label per wiring diagram',                 isPhaseGate: false },
      { id: 26, name: 'Wire motor starters and overloads',                                        isPhaseGate: false },
      { id: 27, name: 'Install emergency stop circuit and verify hardwired interlock',            isPhaseGate: false },
      { id: 28, name: 'Wire all limit switches and proximity sensors to I/O modules',             isPhaseGate: false },
      { id: 29, name: 'Install instrumentation (pressure transducers, flow meters, thermocouples)',isPhaseGate: false },
      { id: 30, name: 'Terminate instrumentation signal cables at junction boxes',                isPhaseGate: false },
      { id: 31, name: 'Wire data acquisition system inputs',                                      isPhaseGate: false },
      { id: 32, name: 'Label all cables per IEC 60445 standard',                                 isPhaseGate: false },
      { id: 33, name: 'Megger test all power circuits — record insulation resistance values',     isPhaseGate: false },
      { id: 34, name: 'Point-to-point wiring verification — complete continuity check',           isPhaseGate: false },
      { id: 35, name: 'Phase 2 internal review and sign-off',                                     isPhaseGate: true  },
    ],
  },
  {
    id: 3, name: 'Software & Controls',
    assignedTo: 'J. Patel',
    steps: [
      { id: 36, name: 'Install PLC hardware and verify power-up',                                 isPhaseGate: false },
      { id: 37, name: 'Load baseline PLC program — version TSK-SW-051-v2.1',                      isPhaseGate: false },
      { id: 38, name: 'Configure I/O map and verify all digital inputs',                          isPhaseGate: false },
      { id: 39, name: 'Configure analog input scaling for all sensors',                           isPhaseGate: false },
      { id: 40, name: 'Commission motor drives — enter nameplate data and run auto-tune',         isPhaseGate: false },
      { id: 41, name: 'Test all E-stop functions and safety interlocks',                          isPhaseGate: false },
      { id: 42, name: 'Verify HMI communication with PLC',                                        isPhaseGate: false },
      { id: 43, name: 'Configure HMI screens per customer specification',                         isPhaseGate: false },
      { id: 44, name: 'Test all manual control modes from HMI',                                   isPhaseGate: false },
      { id: 45, name: 'Configure data logging — set sample rates and storage parameters',         isPhaseGate: false },
      { id: 46, name: 'Commission closed-loop pressure control — tune PID parameters',            isPhaseGate: false },
      { id: 47, name: 'Commission closed-loop flow control — tune PID parameters',               isPhaseGate: false },
      { id: 48, name: 'Configure alarm limits per customer test specification',                   isPhaseGate: false },
      { id: 49, name: 'Run simulation mode — verify all sequences execute correctly',             isPhaseGate: false },
      { id: 50, name: 'Conduct internal FAT readiness review',                                    isPhaseGate: false },
      { id: 51, name: 'Generate software configuration record — lock program revision',           isPhaseGate: false },
      { id: 52, name: 'Phase 3 internal review and sign-off',                                     isPhaseGate: true  },
    ],
  },
  {
    id: 4, name: 'Calibration & Verification',
    assignedTo: 'M. Chen',
    steps: [
      { id: 53, name: 'Calibrate all pressure transducers — NIST traceable standard',             isPhaseGate: false },
      { id: 54, name: 'Calibrate all flow meters — document calibration certificates',            isPhaseGate: false },
      { id: 55, name: 'Calibrate all temperature sensors',                                        isPhaseGate: false },
      { id: 56, name: 'Verify load cell calibration (if applicable)',                             isPhaseGate: false },
      { id: 57, name: 'Perform system accuracy verification — compare to reference standard',     isPhaseGate: false },
      { id: 58, name: 'Conduct repeatability test — 10 consecutive measurements',                isPhaseGate: false },
      { id: 59, name: 'Document all calibration data in test report TSK-CAL-058',                isPhaseGate: false },
      { id: 60, name: 'Verify data acquisition accuracy end-to-end',                             isPhaseGate: false },
      { id: 61, name: 'Run full system functional test — all modes',                              isPhaseGate: false },
      { id: 62, name: 'Conduct endurance run — 4 hours continuous operation',                    isPhaseGate: false },
      { id: 63, name: 'Inspect all connections and fasteners post-endurance',                     isPhaseGate: false },
      { id: 64, name: 'Address and document all punch list items',                                isPhaseGate: false },
      { id: 65, name: 'Customer witness test preparation — clean and organize stand',             isPhaseGate: false },
      { id: 66, name: 'Prepare customer documentation package',                                   isPhaseGate: false },
      { id: 67, name: 'Final QA inspection — sign off inspection checklist',                      isPhaseGate: false },
      { id: 68, name: 'Phase 4 internal review and sign-off',                                     isPhaseGate: true  },
    ],
  },
  {
    id: 5, name: 'Factory Acceptance Testing',
    assignedTo: 'R. Okonkwo',
    steps: [
      { id: 69, name: 'Customer arrival and stand orientation briefing',                          isPhaseGate: false },
      { id: 70, name: 'Customer witness — hydraulic system functional demonstration',             isPhaseGate: false },
      { id: 71, name: 'Customer witness — electrical system demonstration',                       isPhaseGate: false },
      { id: 72, name: 'Customer witness — software and HMI demonstration',                       isPhaseGate: false },
      { id: 73, name: 'Customer witness — calibration verification',                              isPhaseGate: false },
      { id: 74, name: 'Customer witness — full system functional test',                           isPhaseGate: false },
      { id: 75, name: 'Customer witness — simulated test sequence execution',                     isPhaseGate: false },
      { id: 76, name: 'Address customer observations and punch list items',                       isPhaseGate: false },
      { id: 77, name: 'Re-run affected test sequences after corrections',                         isPhaseGate: false },
      { id: 78, name: 'Customer sign-off on FAT test report',                                     isPhaseGate: false },
      { id: 79, name: 'Obtain customer approval on documentation package',                        isPhaseGate: false },
      { id: 80, name: 'Photograph stand for final delivery records',                              isPhaseGate: false },
      { id: 81, name: 'Update as-built drawings with any field changes',                          isPhaseGate: false },
      { id: 82, name: 'FAT complete — customer acceptance obtained',                              isPhaseGate: true  },
    ],
  },
  {
    id: 6, name: 'Shipping Prep & Documentation',
    assignedTo: 'S. Kim',
    steps: [
      { id: 83, name: 'Drain and flush all fluid systems',                                        isPhaseGate: false },
      { id: 84, name: 'Install shipping blanks on all fluid ports',                               isPhaseGate: false },
      { id: 85, name: 'Protect instrumentation and sensors for transit',                          isPhaseGate: false },
      { id: 86, name: 'Disassemble any sub-assemblies required for shipping',                     isPhaseGate: false },
      { id: 87, name: 'Crate and secure all components per shipping plan',                        isPhaseGate: false },
      { id: 88, name: 'Generate packing list and shipping documentation',                         isPhaseGate: false },
      { id: 89, name: 'Arrange freight and confirm delivery schedule with customer',              isPhaseGate: false },
      { id: 90, name: 'Final walk-through and photography before crate seal',                     isPhaseGate: false },
      { id: 91, name: 'Seal crates and apply shipping labels',                                    isPhaseGate: false },
      { id: 92, name: 'Ship — transfer of custody to freight carrier',                            isPhaseGate: false },
    ],
  },
];

function makeStep(stepDef, status, opts = {}) {
  return {
    id: stepDef.id,
    name: stepDef.name,
    isPhaseGate: stepDef.isPhaseGate,
    status,
    completedAt:   opts.completedAt   || null,
    note:          opts.note          || null,
    blockReason:   opts.blockReason   || null,
    blockerCategory: opts.blockerCategory || null,
    blockedAt:     opts.blockedAt     || null,
  };
}

function makeLockedPhase(phaseDef) {
  return {
    id: phaseDef.id, name: phaseDef.name, status: 'locked', assignedTo: phaseDef.assignedTo,
    steps: phaseDef.steps.map(s => makeStep(s, 'locked')),
  };
}

function makeCompletePhase(phaseDef, baseTime) {
  return {
    id: phaseDef.id, name: phaseDef.name, status: 'complete', assignedTo: phaseDef.assignedTo,
    steps: phaseDef.steps.map((s, i) =>
      makeStep(s, 'complete', { completedAt: new Date(baseTime + i * 3600000).toISOString() })
    ),
  };
}

const BASE = new Date('2026-04-01T08:00:00').getTime();

export const TECHNICIANS = {
  'M. Chen':     { name: 'M. Chen',     yearsExp: 2, title: 'Technician II',   mentor: 'R. Okonkwo' },
  'K. Williams': { name: 'K. Williams', yearsExp: 3, title: 'Technician II',   mentor: 'T. Rodriguez' },
  'J. Patel':    { name: 'J. Patel',    yearsExp: 1, title: 'Technician I',    mentor: 'R. Okonkwo' },
  'T. Rodriguez':{ name: 'T. Rodriguez',yearsExp: 18, title: 'Senior Tech',    mentor: null },
  'S. Kim':      { name: 'S. Kim',      yearsExp: 4, title: 'Technician III',  mentor: 'K. Williams' },
  'R. Okonkwo':  { name: 'R. Okonkwo',  yearsExp: 22, title: 'Senior Tech',   mentor: null },
};

// TSK-2024-047: Phase 1 complete, Phase 2 active (steps 19–24 done, step 25 active)
const project047 = {
  id: 'TSK-2024-047',
  name: 'Hydraulic Power Unit Test Stand',
  customer: 'U.S. Navy',
  plannedFATDate: '2026-09-15',
  plannedShipDate: '2026-10-01',
  leadTech: 'T. Rodriguez',
  phases: [
    makeCompletePhase(PHASE_DEFS[0], BASE),
    {
      id: 2, name: 'Electrical Integration', status: 'active', assignedTo: 'K. Williams',
      steps: PHASE_DEFS[1].steps.map((s, i) => {
        if (i <= 5) return makeStep(s, 'complete', { completedAt: new Date(BASE + 500 * 3600000 + i * 4800000).toISOString() });
        if (i === 6) return makeStep(s, 'active');
        return makeStep(s, 'locked');
      }),
    },
    makeLockedPhase(PHASE_DEFS[2]),
    makeLockedPhase(PHASE_DEFS[3]),
    makeLockedPhase(PHASE_DEFS[4]),
    makeLockedPhase(PHASE_DEFS[5]),
  ],
};

// TSK-2024-051: Phases 1–2 complete, Phase 3 active with one step BLOCKED
const project051 = {
  id: 'TSK-2024-051',
  name: 'Avionics Integration Test Bench',
  customer: 'Collins Aerospace',
  plannedFATDate: '2026-07-30',
  plannedShipDate: '2026-08-15',
  leadTech: 'J. Patel',
  phases: [
    makeCompletePhase(PHASE_DEFS[0], BASE),
    makeCompletePhase(PHASE_DEFS[1], BASE + 480 * 3600000),
    {
      id: 3, name: 'Software & Controls', status: 'active', assignedTo: 'J. Patel',
      steps: PHASE_DEFS[2].steps.map((s, i) => {
        if (i <= 14) return makeStep(s, 'complete', { completedAt: new Date(BASE + 1100 * 3600000 + i * 3600000).toISOString() });
        if (i === 15) return makeStep(s, 'blocked', {
          blockerCategory: 'Drawing revision mismatch',
          blockReason: 'Wiring harness routed incorrectly — awaiting corrected schematic from engineering. Raised with J. Patel 06/09.',
          blockedAt: new Date('2026-06-07T09:30:00').toISOString(),
        });
        return makeStep(s, 'locked');
      }),
    },
    makeLockedPhase(PHASE_DEFS[3]),
    makeLockedPhase(PHASE_DEFS[4]),
    makeLockedPhase(PHASE_DEFS[5]),
  ],
};

// TSK-2024-058: Phases 1–3 complete, Phase 4 awaiting supervisor sign-off
const project058 = {
  id: 'TSK-2024-058',
  name: 'Fuel System Test Rig',
  customer: 'Delta TechOps',
  plannedFATDate: '2026-06-28',
  plannedShipDate: '2026-07-12',
  leadTech: 'M. Chen',
  phases: [
    makeCompletePhase(PHASE_DEFS[0], BASE),
    makeCompletePhase(PHASE_DEFS[1], BASE + 430 * 3600000),
    makeCompletePhase(PHASE_DEFS[2], BASE + 900 * 3600000),
    {
      id: 4, name: 'Calibration & Verification', status: 'awaiting-signoff', assignedTo: 'M. Chen',
      steps: PHASE_DEFS[3].steps.map((s, i) => {
        if (i < 15) return makeStep(s, 'complete', { completedAt: new Date(BASE + 1400 * 3600000 + i * 3200000).toISOString() });
        return makeStep(s, 'awaiting-signoff', {
          completedAt: new Date(BASE + 1450 * 3600000).toISOString(),
          note: 'All calibration and verification complete. Documentation package ready. FAT date confirmed with Delta TechOps.',
        });
      }),
    },
    makeLockedPhase(PHASE_DEFS[4]),
    makeLockedPhase(PHASE_DEFS[5]),
  ],
};

export const BLOCKER_CATEGORIES = [
  'Missing kit / parts not received',
  'Calibration tool unavailable',
  'Engineering hold / question',
  'QA hold / inspection pending',
  'Awaiting material certification',
  'Drawing revision mismatch',
  'Equipment malfunction',
  'Customer information pending',
  'Other',
];

export const KNOWLEDGE_VAULT_SEED = [
  {
    id: 'kv-001',
    technique: 'Torque main structural uprights in a diagonal star pattern — not clockwise. Tighten the center pair first, then alternate outward. Prevents frame racking under cyclic hydraulic loads. Confirmed on six prior builds; clockwise sequence causes 0.015" cumulative bow at manifold mounting surface.',
    stepId: 3,
    stepName: 'Mount main structural uprights',
    phase: 'Mechanical Assembly',
    contributor: 'T. Rodriguez',
    capturedAt: '2026-04-14T11:20:00',
    citations: 12,
  },
  {
    id: 'kv-002',
    technique: 'Check frame diagonals during base frame inspection, not just length and width. A 1/16" racking error at Phase 1 becomes a 3/8" accumulation at the manifold mounting surface by the time uprights are installed. Measuring diagonals adds 3 minutes and catches issues that cost 4+ hours to fix later.',
    stepId: 1,
    stepName: 'Inspect and verify base frame dimensions',
    phase: 'Mechanical Assembly',
    contributor: 'T. Rodriguez',
    capturedAt: '2026-03-28T09:45:00',
    citations: 9,
  },
  {
    id: 'kv-003',
    technique: 'Leave 10% extra slack on hydraulic return lines before final clamp. Return side sees significant thermal expansion from fluid temp rise under max load cycles. Tight lines at ambient develop micro-fractures at fitting seats within 500 test cycles — this failure mode does not show up during initial pressure test.',
    stepId: 8,
    stepName: 'Route hydraulic return lines — low pressure circuit',
    phase: 'Mechanical Assembly',
    contributor: 'R. Okonkwo',
    capturedAt: '2026-05-02T14:30:00',
    citations: 5,
  },
  {
    id: 'kv-004',
    technique: 'Route power and signal cables on opposite sides of the cable tray without exception. On hydraulic test stands, servo drive PWM carrier frequency couples into adjacent signal cables, causing erratic pressure transducer readings above 4,000 PSI. Separation eliminates this with zero added cost.',
    stepId: 23,
    stepName: 'Route control wiring harness — Zone A',
    phase: 'Electrical Integration',
    contributor: 'K. Williams',
    capturedAt: '2026-04-22T16:10:00',
    citations: 11,
  },
  {
    id: 'kv-005',
    technique: 'Zero pressure transducers after a 15-minute warm-up at ambient temperature — not immediately on power-up. Cold zero on Kistler 4075A and equivalent units drifts +0.2 to 0.4% full-scale. Document zero offset and ambient temp in the calibration record to support any future recal deviation.',
    stepId: 53,
    stepName: 'Calibrate all pressure transducers',
    phase: 'Calibration & Verification',
    contributor: 'M. Chen',
    capturedAt: '2026-02-18T10:55:00',
    citations: 6,
  },
  {
    id: 'kv-006',
    technique: 'Start closed-loop pressure PID with P-only at gain 0.5 and confirm stable null before adding integral term. Adding I-term with large initial error causes integrator windup that trips the pressure safety on first auto-mode engagement. Wait for P-term to achieve steady state before introducing I.',
    stepId: 46,
    stepName: 'Commission closed-loop pressure control',
    phase: 'Software & Controls',
    contributor: 'J. Patel',
    capturedAt: '2026-03-11T13:40:00',
    citations: 4,
  },
  {
    id: 'kv-007',
    technique: 'Hydraulic fittings require two torque passes — 50% spec first, then full spec. Single-pass torquing causes brass seat deformation that weeps under thermal cycling at operating temp. Re-torque after the first thermal cycle catches 90% of potential leak points before customer FAT.',
    stepId: 10,
    stepName: 'Pressure test hydraulic circuit at 150% rated pressure',
    phase: 'Mechanical Assembly',
    contributor: 'R. Okonkwo',
    capturedAt: '2026-01-30T08:15:00',
    citations: 7,
  },
];

export const initialState = {
  activeView: 'admin',
  activeTechnicianProject: 'TSK-2024-051',
  shiftNotes: '',
  projects: [project047, project051, project058],
  knowledgeVault: KNOWLEDGE_VAULT_SEED,
  pendingApprovals: [
    {
      projectId: 'TSK-2024-058',
      phaseId: 4,
      phaseName: 'Calibration & Verification',
      submittedBy: 'M. Chen',
      submittedAt: new Date(BASE + 1450 * 3600000).toISOString(),
    },
  ],
};
