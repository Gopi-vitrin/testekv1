export const procedure = {
  id: 'TSK-2024-047',
  title: 'Hydraulic Power Unit Test Stand',
  customer: 'U.S. Navy',
  unit: 'HPU-047 / Bay 3',
  revision: 'Procedure Rev C',
  sourceBaseline: 'PDM package TSK-BF-001 / ECO-4421',
  security: 'On-prem CMMC workspace',
  fatDate: 'Sep 15, 2026',
  shift: 'Day shift / 06:00-14:00',
  currentStep: 24,
  totalSteps: 86,
  nextNotify: 'Electrical crew lead after QA witness',
  assignedMentor: 'E. Falkowski',
  suggestedMentor: 'M. Chen',
  recruit: 'A. Morgan',
  recruitExperience: '6 months',
  type: 'new-build',
  assignedModuleId: 'module-hpu',
  lifecycle: [
    { year: 1998, event: 'Legacy Navy hydraulic stand built', by: 'Original HPU team' },
    { year: 2010, event: 'ADAS signal conditioning upgrade', by: 'R. Thompson' },
    { year: 2026, event: 'HPU-047 build with captured module methods', by: 'E. Falkowski / A. Morgan' },
  ],
};

export const buildProjects = [
  {
    id: 'TSK-2024-047',
    title: 'Hydraulic Power Unit Test Stand',
    customer: 'U.S. Navy',
    type: 'new-build',
    assignedModuleId: 'module-hpu',
    lifecycle: procedure.lifecycle,
  },
  {
    id: 'TSK-2024-051',
    title: 'Avionics Integration Test Bench',
    customer: 'Collins',
    type: 'new-build',
    assignedModuleId: 'module-daq',
    lifecycle: [
      { year: 2024, event: 'NI PXI and FPGA bench released', by: 'J. Martinez' },
      { year: 2025, event: 'MIL-1553 TPS kit reused', by: 'K. Williams' },
    ],
  },
  {
    id: 'TSK-1998-012-R',
    title: 'ADAS 2.0 Retrofit on Legacy Hydraulic Stand',
    customer: 'U.S. Navy',
    type: 'retrofit',
    originalYear: 1998,
    originalTeam: 'Original HPU team retired',
    assignedModuleId: 'module-daq',
    lifecycle: [
      { year: 1998, event: 'Original hydraulic stand commissioned', by: 'Original HPU team' },
      { year: 2010, event: 'DAQ cabinet refreshed for ADAS 1.x', by: 'R. Thompson' },
      { year: 2026, event: 'ADAS 2.0 retrofit using captured lineage', by: 'J. Martinez / A. Morgan' },
    ],
  },
];

export const buildModules = [
  {
    id: 'module-frame',
    order: 1,
    buildId: 'TSK-2024-047',
    name: 'Structural / Frame',
    duration: '4-8 weeks',
    status: 'complete',
    station: 'Mechanical/Frame',
    master: 'E. Falkowski',
    steps: [22],
    plm: {
      drawing: 'TSK-2024-047-FRM-100 chassis weldment',
      rev: 'Rev B',
      status: 'Released',
      spec: 'Base frame, isolation mounts, drip containment, shop-floor datum controls',
      bom: [
        { part: 'Welded base frame', qty: 1 },
        { part: 'Vibration isolator set', qty: 8 },
        { part: 'Containment pan', qty: 2 },
      ],
    },
    reusedFrom: { buildId: 'TSK-2021-033', pct: 68, author: 'E. Falkowski', changed: ['Bay 3 anchor pattern', 'Updated containment pan depth'] },
  },
  {
    id: 'module-hpu',
    order: 2,
    buildId: 'TSK-2024-047',
    name: 'Hydraulic Power Unit (HPU)',
    duration: '8-12 weeks',
    status: 'active',
    station: 'Calibration',
    master: 'R. Thompson',
    steps: [22, 23, 24],
    plm: {
      drawing: 'TSK-2024-047-HPU-240 manifold and pressure test package',
      rev: 'Rev C',
      status: 'Released',
      spec: 'Closed-loop 150 percent pressure decay test with calibrated gauge chain',
      bom: [
        { part: 'Servo valve manifold', qty: 1 },
        { part: 'Pressure transducer 5000 psi', qty: 2 },
        { part: 'Gauge certificate pack', qty: 1 },
      ],
    },
    reusedFrom: { buildId: 'TSK-2022-018', pct: 70, author: 'R. Thompson', changed: ['150 percent hold window', 'Return-line label routing'] },
  },
  {
    id: 'module-fluid',
    order: 3,
    buildId: 'TSK-2024-047',
    name: 'Fluid Conditioning',
    duration: '3-5 weeks',
    status: 'locked',
    station: 'Hydraulic-Pneumatic',
    master: 'M. Chen',
    steps: [],
    plm: {
      drawing: 'TSK-2024-047-FLD-310 filtration skid',
      rev: 'Rev A',
      status: 'Released',
      spec: 'Temperature conditioning, filtration, and leak-check loop',
      bom: [
        { part: 'Filter housing', qty: 2 },
        { part: 'Heat exchanger', qty: 1 },
        { part: 'LVDT service port kit', qty: 1 },
      ],
    },
  },
  {
    id: 'module-power',
    order: 4,
    buildId: 'TSK-2024-047',
    name: 'Electrical / Power Distribution',
    duration: '6-10 weeks',
    status: 'blocked',
    station: 'Wiring-Panel',
    master: 'K. Williams',
    steps: [25],
    plm: {
      drawing: 'TSK-2024-047-PWR-420 Zone B termination',
      rev: 'Rev D pending ECO',
      status: 'Engineering hold',
      spec: 'Signal/power separation, cabinet grounding, released schematic match',
      bom: [
        { part: 'Zone B terminal rail', qty: 1 },
        { part: 'Shielded cable bundle', qty: 6 },
        { part: 'Panel grounding kit', qty: 1 },
      ],
    },
  },
  {
    id: 'module-control',
    order: 5,
    buildId: 'TSK-2024-047',
    name: 'Control System (NI PXI / FPGA)',
    duration: '5-8 weeks',
    status: 'locked',
    station: 'Controls-Software',
    master: 'J. Patel',
    steps: [26],
    plm: {
      drawing: 'TSK-2024-047-CTL-500 PXI chassis baseline',
      rev: 'Rev B',
      status: 'Released',
      spec: 'NI PXI chassis, FPGA timing, closed-loop command verification',
      bom: [
        { part: 'NI PXI chassis', qty: 1 },
        { part: 'FPGA timing card', qty: 2 },
        { part: 'I/O checkout harness', qty: 1 },
      ],
    },
  },
  {
    id: 'module-daq',
    order: 6,
    buildId: 'TSK-1998-012-R',
    name: 'Data Acquisition - ADAS 2.0',
    duration: '6-9 weeks',
    status: 'awaiting-signoff',
    station: 'Instrumentation',
    master: 'J. Martinez',
    steps: [],
    plm: {
      drawing: 'ADAS2-DAQ-610 signal conditioning rack',
      rev: 'Rev C',
      status: 'Released',
      spec: 'ADAS 2.0 DAQ retrofit, signal conditioning, legacy hydraulic stand interface',
      bom: [
        { part: 'ADAS 2.0 DAQ rack', qty: 1 },
        { part: 'Signal conditioning module', qty: 8 },
        { part: 'Legacy connector adapter', qty: 4 },
      ],
    },
    reusedFrom: { buildId: 'TSK-2024-051', pct: 62, author: 'J. Martinez', changed: ['Legacy connector adapter', 'Channel labels for 1998 stand'] },
  },
  {
    id: 'module-console',
    order: 7,
    buildId: 'TSK-2024-047',
    name: 'Operator Console',
    duration: '4-6 weeks',
    status: 'locked',
    station: 'Controls-Software',
    master: 'S. Reyes',
    steps: [],
    plm: {
      drawing: 'TSK-2024-047-CON-700 dual touchscreen console',
      rev: 'Rev A',
      status: 'Released',
      spec: 'Industrial PC, dual touchscreen, ruggedized enclosure',
      bom: [
        { part: 'Industrial PC', qty: 1 },
        { part: 'Touchscreen display', qty: 2 },
        { part: 'Rugged console enclosure', qty: 1 },
      ],
    },
  },
  {
    id: 'module-uut',
    order: 8,
    buildId: 'TSK-2024-047',
    name: 'UUT Interface / TPS',
    duration: 'Order-specific',
    status: 'locked',
    station: 'Instrumentation',
    master: 'K. Williams',
    steps: [],
    plm: {
      drawing: 'TSK-2024-047-TPS-800 UUT cabling kit',
      rev: 'Draft B',
      status: 'Customer-specific',
      spec: 'Test Program Set, UUT cabling, MIL-1553 path validation',
      bom: [
        { part: 'TPS cable kit', qty: 1 },
        { part: 'MIL-1553 coupler', qty: 2 },
        { part: 'UUT adapter plate', qty: 1 },
      ],
    },
  },
  {
    id: 'module-testex',
    order: 9,
    buildId: 'TSK-2024-047',
    name: 'Test Software - TestEx NxG',
    duration: 'Order-specific',
    status: 'locked',
    station: 'Controls-Software',
    master: 'J. Patel',
    steps: [],
    plm: {
      drawing: 'TESTEX-NXG-900 acceptance script',
      rev: 'Draft A',
      status: 'In software review',
      spec: 'TestEx NxG sequence, safety interlocks, FAT report generation',
      bom: [
        { part: 'TestEx NxG project', qty: 1 },
        { part: 'Acceptance script set', qty: 1 },
        { part: 'FAT report template', qty: 1 },
      ],
    },
  },
];

export const technicianSteps = [
  {
    id: 22,
    title: 'Verify manifold bracket torque pattern',
    moduleId: 'module-hpu',
    workstream: 'Hydraulic',
    station: 'Calibration',
    owner: 'M. Chen',
    status: 'complete',
    completedBy: 'M. Chen',
    completedAt: 'Jun 13, 2026 09:10',
    duration: '38 min',
    evidence: ['Torque log uploaded', 'Photo set accepted'],
    vaultRefs: ['KV-1042'],
    techniqueNotes: [],
    questions: [],
  },
  {
    id: 23,
    title: 'Route hydraulic return circuit and label service ports',
    moduleId: 'module-hpu',
    workstream: 'Hydraulic',
    station: 'Hydraulic-Pneumatic',
    owner: 'M. Chen',
    status: 'complete',
    completedBy: 'J. Martinez',
    completedAt: 'Jun 13, 2026 10:25',
    duration: '52 min',
    evidence: ['Port labels verified', 'Routing photo accepted'],
    vaultRefs: ['KV-1184'],
    techniqueNotes: [
      {
        id: 'TN-023-JM',
        author: 'J. Martinez',
        text: "Leave the last clamp loose until the return line warms during leak check. Cold-fit lines can pull the label sleeve out of view.",
        createdAt: 'Jun 13, 2026 10:30',
        endorsed: false,
        endorsedBy: null,
        appliedAcrossBuilds: 2,
      },
    ],
    questions: [],
  },
  {
    id: 24,
    title: 'Pressure decay test at 150 percent rated pressure',
    moduleId: 'module-hpu',
    workstream: 'Hydraulic',
    station: 'Calibration',
    owner: 'M. Chen',
    status: 'active',
    duration: '75 min planned',
    dependencies: ['Step 22 complete', 'Step 23 complete', 'QA witness assigned'],
    evidence: ['Pressure chart', 'Gauge serial number', 'QA initials', 'Hold time reading'],
    guidance:
      'Follow the released pressure ramp sequence. Do not advance if pressure drop exceeds acceptance band or if gauge certificate is expired.',
    vaultRefs: ['KV-1042', 'KV-1210'],
    completedBy: 'R. Thompson',
    techniqueNotes: [
      {
        id: 'TN-024-RT',
        author: 'R. Thompson',
        named: true,
        name: 'Thompson Pressure-Ramp Method',
        text: "Ramp pressure in 25% increments and hold 5 min at each stage. If you jump straight to 150% you'll trip the relief valve and have to start over.",
        createdAt: 'Jun 12, 2026 13:40',
        endorsed: true,
        endorsedBy: 'S. Reyes',
        appliedAcrossBuilds: 14,
        citations: {
          buildCount: 14,
          customers: ['U.S. Navy', 'Collins', 'Delta TechOps'],
          technicians: ['D. Okafor', 'A. Morgan', 'M. Chen', 'J. Martinez', 'N. Shah', 'T. Rodriguez', 'K. Williams', 'J. Patel', 'R. Wells'],
        },
      },
    ],
    questions: [],
  },
  {
    id: 25,
    title: 'Release electrical Zone B termination',
    moduleId: 'module-power',
    workstream: 'Electrical',
    station: 'Wiring-Panel',
    owner: 'K. Williams',
    status: 'blocked',
    duration: 'Waiting 6h',
    blocker: 'Drawing revision mismatch between router and released schematic.',
    evidence: ['ECO note', 'Wiring photo'],
    vaultRefs: ['KV-1098'],
    identifiedBy: 'J. Martinez',
    completedBy: 'J. Martinez',
    techniqueNotes: [],
    questions: [
      {
        id: 'Q-025-DO',
        askedBy: 'D. Okafor',
        text: 'Is the corrected schematic for the DAQ wiring posted anywhere yet?',
        askedAt: 'Jun 14, 2026 14:12',
        answer: {
          author: 'R. Thompson',
          text: "Not yet. Engineering has it. Don't proceed on the old one, you'll have to rewire. I'll ping you when it's released.",
          answeredAt: 'Jun 14, 2026 14:31',
        },
      },
    ],
  },
  {
    id: 26,
    title: 'Notify controls team for PLC baseline load',
    moduleId: 'module-control',
    workstream: 'Controls',
    station: 'Controls-Software',
    owner: 'J. Patel',
    status: 'locked',
    duration: 'Next safe step',
    dependencies: ['Electrical Zone B released', 'I/O map verified'],
    evidence: ['Program hash', 'I/O checkout file'],
    vaultRefs: ['KV-1304'],
    techniqueNotes: [],
    questions: [],
  },
];

export const technicianProfiles = [
  {
    name: 'R. Thompson',
    role: 'Senior Test Technician',
    yearsExperience: 31,
    yearsAtTestek: 31,
    stepsCompleted: 412,
    projectsContributed: 9,
    techniqueNotesAuthored: 23,
    endorsementsReceived: 19,
    questionsAnswered: 31,
    totalCitations: 47,
    techniciansTrained: 23,
    buildsShaped: ['Navy HPU test stand', 'Collins flight-control rig', 'Delta TechOps hydraulic cart'],
    legacyLine: 'When R. Thompson retires, his pressure-ramp judgment stays in every build that cites his method.',
    signatureMethods: ['Thompson Pressure-Ramp Method', 'DAQ wiring hold discipline', 'Pre-FAT hydraulic leak triage'],
    menteeLinks: ['D. Okafor used Thompson Pressure-Ramp Method', 'A. Morgan trained on staged pressure holds', 'N. Shah confirmed relief-valve prevention cue'],
    stationMastery: ['Master of Calibration / 47 citations here'],
  },
  {
    name: 'J. Martinez',
    role: 'Test Technician',
    yearsExperience: 12,
    yearsAtTestek: 12,
    stepsCompleted: 287,
    projectsContributed: 7,
    techniqueNotesAuthored: 11,
    endorsementsReceived: 6,
    questionsAnswered: 14,
    totalCitations: 18,
    techniciansTrained: 8,
    buildsShaped: ['787 flight control rig', 'Navy HPU electrical bay'],
    legacyLine: 'Known for turning field catches into named methods junior technicians can reuse safely.',
    signatureMethods: ['Martinez Thermal-Settle Procedure', 'Return-line routing checks', 'Revision mismatch identification'],
    menteeLinks: ['D. Okafor used thermal-settle cue', 'A. Morgan reused return-line routing check'],
    stationMastery: ['Master of Instrumentation / 18 citations here'],
  },
  {
    name: 'D. Okafor',
    role: 'Junior Technician',
    yearsExperience: 2,
    yearsAtTestek: 2,
    stepsCompleted: 64,
    projectsContributed: 2,
    techniqueNotesAuthored: 1,
    endorsementsReceived: 0,
    questionsAnswered: 0,
    totalCitations: 0,
    techniciansTrained: 0,
    buildsShaped: ['Navy HPU electrical bay'],
    legacyLine: 'Uses direct questions to turn uncertainty into reusable step knowledge.',
    signatureMethods: ['Escalation questions', 'Evidence packet preparation'],
  },
  {
    name: 'S. Reyes',
    role: 'Supervisor',
    yearsExperience: 16,
    yearsAtTestek: 16,
    stepsCompleted: 338,
    projectsContributed: 11,
    techniqueNotesAuthored: 7,
    endorsementsReceived: 12,
    questionsAnswered: 18,
    totalCitations: 12,
    techniciansTrained: 10,
    buildsShaped: ['FAT readiness program', 'Hydraulic Power Unit Test Stand'],
    legacyLine: 'Protects the official procedure by validating field tips before release.',
    signatureMethods: ['Technique endorsement', 'Module-gate signoff', 'QA-ready evidence reviews'],
  },
  {
    name: 'M. Chen',
    role: 'Hydraulic Systems Lead',
    yearsExperience: 8,
    yearsAtTestek: 8,
    stepsCompleted: 231,
    projectsContributed: 6,
    techniqueNotesAuthored: 14,
    endorsementsReceived: 8,
    questionsAnswered: 17,
    totalCitations: 22,
    techniciansTrained: 11,
    buildsShaped: ['787 flight control rig', 'F-35 hydraulic cart'],
    legacyLine: 'Makes hydraulic setup repeatable for new recruits.',
    signatureMethods: ['Gauge setup', 'Pressure decay evidence', 'Manifold torque verification'],
  },
  {
    name: 'E. Falkowski',
    role: 'Hydraulics Senior Tech',
    yearsExperience: 26,
    yearsAtTestek: 26,
    stepsCompleted: 384,
    projectsContributed: 10,
    techniqueNotesAuthored: 21,
    endorsementsReceived: 16,
    questionsAnswered: 24,
    totalCitations: 31,
    techniciansTrained: 17,
    buildsShaped: ['Hydraulic Power Unit Test Stand', 'Legacy HPU stand'],
    legacyLine: 'Senior tech of record for pressure acceptance and legacy stand behavior.',
    signatureMethods: ['Bleed-down safety', 'Legacy pressure acceptance', 'Recruit escalation routing'],
  },
  {
    name: 'K. Williams',
    role: 'Electrical Senior Tech',
    yearsExperience: 14,
    yearsAtTestek: 14,
    stepsCompleted: 302,
    projectsContributed: 8,
    techniqueNotesAuthored: 13,
    endorsementsReceived: 7,
    questionsAnswered: 19,
    totalCitations: 16,
    techniciansTrained: 9,
    buildsShaped: ['Navy HPU electrical bay', 'Controls checkout bench'],
    legacyLine: 'Keeps electrical holds visible before they become rework.',
    signatureMethods: ['ECO hold triage', 'Zone B termination checks', 'Signal/power separation'],
  },
];

export const stationMeta = {
  'Mechanical/Frame': { master: 'E. Falkowski', citations: 31 },
  'Hydraulic-Pneumatic': { master: 'E. Falkowski', citations: 31 },
  'Wiring-Panel': {
    master: 'J. Martinez',
    citations: 18,
    handoff: {
      fromCrew: 'Crew A',
      toCrew: 'Crew B',
      note: 'Torqued 14/20 manifold bolts; rest blocked on corrected DAQ schematic.',
      leftAt: 'Jun 14, 2026 14:00',
    },
  },
  Instrumentation: { master: 'J. Martinez', citations: 18 },
  'Controls-Software': { master: 'K. Williams', citations: 16 },
  Calibration: { master: 'R. Thompson', citations: 47 },
  'FAT/Run-off': { master: 'S. Reyes', citations: 12 },
  'Crating-Shipping': { master: 'M. Chen', citations: 22 },
};

export const crews = [
  { id: 'crew-a', shift: '06:00-14:00', members: ['M. Chen', 'J. Martinez', 'A. Morgan'] },
  { id: 'crew-b', shift: '14:00-22:00', members: ['K. Williams', 'D. Okafor', 'N. Shah'] },
];

export const reusableModules = [
  {
    id: 'MOD-TH-HPU',
    name: 'Thompson Hydraulic Manifold Module',
    author: 'R. Thompson',
    reuseCount: 11,
    builds: ['TSK-2024-051', 'Navy HPU test stand', 'Collins hydraulic cart'],
    customers: ['U.S. Navy', 'Collins', 'Delta TechOps'],
    station: 'Calibration',
  },
  {
    id: 'MOD-JM-DAQ',
    name: 'Martinez DAQ Rack Config',
    author: 'J. Martinez',
    reuseCount: 7,
    builds: ['TSK-2024-051', '787 flight control rig'],
    customers: ['Boeing', 'U.S. Navy'],
    station: 'Instrumentation',
  },
];

export const vaultEntries = [
  {
    id: 'KV-1042',
    title: 'Hydraulic manifold torque verification',
    system: 'Hydraulic',
    status: 'Validated',
    owner: 'M. Chen',
    reviewer: 'QA - R. Wells',
    source: 'Voice memo + torque sheet',
    revision: 'Rev B',
    confidence: 96,
    citations: 18,
    summary:
      'Reusable technique for verifying manifold fasteners, logging torque values, and capturing photo evidence before pressure testing.',
    tags: ['torque', 'pressure test', 'evidence'],
  },
  {
    id: 'KV-1098',
    title: 'Drawing revision mismatch triage',
    system: 'Engineering Hold',
    status: 'Supervisor review',
    owner: 'J. Patel',
    reviewer: 'Engineering',
    source: 'Shift handoff note',
    revision: 'Draft 3',
    confidence: 84,
    citations: 7,
    summary:
      'Compares router, ECO status, released drawing package, and field condition before work continues.',
    tags: ['ECO', 'router', 'hold'],
  },
  {
    id: 'KV-1127',
    title: 'FAT witness readiness package',
    system: 'FAT',
    status: 'Validated',
    owner: 'R. Okonkwo',
    reviewer: 'Program Mgmt',
    source: 'PDF manual + video walkdown',
    revision: 'Rev A',
    confidence: 91,
    citations: 12,
    summary:
      'Pre-customer sequence for staging calibration certs, spare kit records, as-built drawings, and customer signoff forms.',
    tags: ['FAT', 'customer', 'documentation'],
  },
  {
    id: 'KV-1210',
    title: 'Pressure ramp acceptance band',
    system: 'Calibration',
    status: 'Validated',
    owner: 'E. Falkowski',
    reviewer: 'Quality Engineering',
    source: 'Legacy manual + senior tech review',
    revision: 'Rev A',
    confidence: 89,
    citations: 9,
    summary:
      'Legacy pressure ramp procedure converted into a controlled acceptance checklist with hold-time readings.',
    tags: ['calibration', 'legacy', 'acceptance'],
  },
];

export const workstreams = [
  {
    name: 'F-35 hydraulic cart',
    owner: 'T. Rodriguez',
    experience: '14 yrs',
    progress: 74,
    activeStep: 'Cable tray clearance verification',
    blocked: false,
    next: 'Dimensional inspection with QA witness',
    evidence: ['photo set', 'torque log'],
  },
  {
    name: '787 flight control rig',
    owner: 'M. Chen',
    experience: '8 yrs',
    progress: 58,
    activeStep: 'Pressure decay test',
    blocked: false,
    next: 'Release to electrical crew lead',
    evidence: ['pressure chart', 'QA initials'],
  },
  {
    name: 'Navy HPU electrical bay',
    owner: 'K. Williams',
    experience: '3 yrs',
    progress: 46,
    activeStep: 'Zone B termination hold',
    blocked: true,
    next: 'Engineering disposition for revision mismatch',
    evidence: ['wiring photo', 'ECO note'],
  },
  {
    name: 'Controls checkout bench',
    owner: 'J. Patel',
    experience: '11 yrs',
    progress: 31,
    activeStep: 'Waiting on electrical release',
    blocked: false,
    next: 'Verify digital input map',
    evidence: ['program hash'],
  },
  {
    name: 'ADAS 2.0 Retrofit - Legacy Navy Hydraulic Stand',
    owner: 'A. Morgan',
    experience: '6 months',
    progress: 42,
    activeStep: 'Instrumentation interface mapping',
    blocked: false,
    next: 'Senior tech approval against 1998 stand notes',
    evidence: ['legacy drawing', 'signal map'],
    legacy: 'Built 1998 / original team retired / captured knowledge here',
  },
];

export const advisorRecruits = [
  {
    name: 'A. Morgan',
    experience: '6 months',
    project: 'Hydraulic Power Unit Test Stand',
    currentStep: 'Pressure decay test',
    mentor: 'E. Falkowski',
    suggestedMentor: 'M. Chen for hydraulic pressure module',
    status: 'Needs QA witness before advance',
  },
  {
    name: 'D. Rivera',
    experience: '1 year',
    project: '787 flight control rig',
    currentStep: 'Servo valve checkout',
    mentor: 'E. Falkowski',
    suggestedMentor: 'K. Williams for electrical hold triage',
    status: 'On track',
  },
  {
    name: 'N. Shah',
    experience: '3 months',
    project: 'F-35 hydraulic cart',
    currentStep: 'Torque verification',
    mentor: 'E. Falkowski',
    suggestedMentor: 'T. Rodriguez for mechanical fit-up',
    status: 'Needs mentor review',
  },
];

export const recruitHelpTopics = [
  {
    question: 'Can I advance to the next step?',
    answer: 'Not yet. Attach the pressure chart, gauge serial number, QA initials, and hold-time reading before Step 25 unlocks.',
  },
  {
    question: 'Who should I contact?',
    answer: 'Start with assigned senior tech E. Falkowski. For the hydraulic pressure module, M. Chen is the suggested mentor.',
  },
  {
    question: 'What is blocking the next crew?',
    answer: 'Electrical Zone B is on hold because the router and released schematic do not match. Wait for ECO-4421 disposition.',
  },
];

export const similarResolvedBlockers = [
  {
    id: 'SIM-118',
    title: 'Zone B schematic mismatch',
    project: '787 flight control rig',
    resolution: 'Held work, attached ECO disposition, resumed after released schematic Rev F.',
    owner: 'K. Williams',
    reused: 5,
  },
  {
    id: 'SIM-104',
    title: 'Pressure ramp relief trip',
    project: 'Legacy HPU stand',
    resolution: 'Used 25% staged ramp with 5 min stabilization holds.',
    owner: 'R. Thompson',
    reused: 14,
  },
];

export const repeatQuestionSignals = [
  {
    module: 'Pressure decay evidence',
    repeats: 7,
    owner: 'M. Chen',
    action: 'Add evidence checklist',
  },
  {
    module: 'ECO source of truth',
    repeats: 5,
    owner: 'K. Williams',
    action: 'Add source priority rule',
  },
  {
    module: 'Hydraulic bleed-down',
    repeats: 4,
    owner: 'E. Falkowski',
    action: 'Convert video to step note',
  },
];

export const systemHealth = [
  { label: 'Open blockers', value: '3', tone: 'red' },
  { label: 'Unanswered asks', value: '2', tone: 'amber' },
  { label: 'Draft backlog', value: '8', tone: 'amber' },
  { label: 'Approved updates', value: '14', tone: 'green' },
];

export const technicianGuardrails = [
  {
    label: 'Stop condition',
    detail: 'Do not advance if drawing, router, gauge cert, or ECO status conflicts with the released baseline.',
  },
  {
    label: 'Evidence rule',
    detail: 'Every completed step needs proof: measurement, photo, serial number, QA initials, or witness signoff.',
  },
  {
    label: 'Human factors',
    detail: 'If the step feels unclear, ask before acting. The system records questions as training gaps.',
  },
];

export const advisorProtectionFeatures = [
  {
    title: 'Private drafts',
    detail: 'Only visible to the senior tech.',
  },
  {
    title: 'Credited answers',
    detail: 'Author and reviewer stay attached.',
  },
  {
    title: 'Review gate',
    detail: 'Formal notes require approval.',
  },
];

export const adminAdoptionSignals = [
  {
    label: 'Credited saves',
    value: '11',
    detail: 'Rework prevented',
  },
  {
    label: 'Private drafts',
    value: '6',
    detail: 'Senior tech-owned',
  },
  {
    label: 'Repeat questions',
    value: '3',
    detail: 'Procedure gaps',
  },
  {
    label: 'Senior tech opt-in',
    value: '78%',
    detail: 'This month',
  },
];

export const advisorContributions = [
  {
    advisor: 'E. Falkowski',
    role: 'Hydraulics senior tech',
    entries: 8,
    approved: 5,
    pending: 3,
    focus: 'Pressure ramp acceptance, bleed-down safety, legacy test stand patterns',
    impact: '6 blockers resolved',
  },
  {
    advisor: 'M. Chen',
    role: 'Hydraulic systems lead',
    entries: 6,
    approved: 4,
    pending: 2,
    focus: 'Manifold torque verification, gauge setup, pressure decay evidence',
    impact: '9 evidence checks reused',
  },
  {
    advisor: 'K. Williams',
    role: 'Electrical senior tech',
    entries: 4,
    approved: 2,
    pending: 2,
    focus: 'Revision mismatch triage, Zone B termination checks, ECO holds',
    impact: '2 release conflicts caught',
  },
];

export const legacyTechniques = [
  {
    id: 'LEG-RT-010',
    name: 'Thompson Pressure-Ramp Method',
    author: 'R. Thompson',
    step: 'Step 10 / Step 24 pressure testing',
    usedOn: '14 builds',
    customers: '3 customers',
    technicians: '9 technicians',
    impact: 'Prevents relief-valve trips during 150 percent pressure hold.',
  },
  {
    id: 'LEG-JM-053',
    name: 'Martinez Thermal-Settle Procedure',
    author: 'J. Martinez',
    step: 'Step 53 hydraulic return validation',
    usedOn: '7 builds',
    customers: '2 customers',
    technicians: '6 technicians',
    impact: 'Avoids false sensor replacement when return-line temperature lags.',
  },
  {
    id: 'LEG-EF-024',
    name: 'Falkowski Bleed-Down Check',
    author: 'E. Falkowski',
    step: 'Step 24 pressure release',
    usedOn: '9 builds',
    customers: '2 customers',
    technicians: '7 technicians',
    impact: 'Keeps trapped pressure visible before manifold work starts.',
  },
];

export const recognitionLeaders = {
  technicians: [
    { name: 'R. Thompson', impact: '47 citations', detail: '23 technicians trained' },
    { name: 'E. Falkowski', impact: '31 citations', detail: '17 technicians trained' },
    { name: 'M. Chen', impact: '22 citations', detail: '11 technicians trained' },
  ],
  methods: [
    { name: 'Thompson Pressure-Ramp Method', impact: '14 builds', detail: 'U.S. Navy, Collins, Delta TechOps' },
    { name: 'Martinez Thermal-Settle Procedure', impact: '7 builds', detail: '6 technicians reused' },
    { name: 'Falkowski Bleed-Down Check', impact: '9 builds', detail: '7 technicians reused' },
  ],
  mentors: [
    { name: 'R. Thompson', impact: '23 trained', detail: 'Pressure testing and FAT readiness' },
    { name: 'E. Falkowski', impact: '17 trained', detail: 'Hydraulic acceptance judgment' },
    { name: 'S. Reyes', impact: '10 trained', detail: 'Quality gate discipline' },
  ],
};

export const conversationCaptures = [
  {
    id: 'CAPTURE-031',
    step: 'Step 31',
    project: 'Navy HPU electrical bay',
    capturedBy: 'D. Okafor',
    seniorTech: 'J. Martinez',
    source: 'In-person bay conversation',
    title: 'Return line warm before pressure stabilizes',
    summary: 'If the return line warms before pressure stabilizes, check bypass valve position before replacing the flow sensor.',
    status: 'Waiting for J. Martinez approval',
    legacyEffect: '+1 citation when approved',
  },
  {
    id: 'CAPTURE-053',
    step: 'Step 53',
    project: '787 flight control rig',
    capturedBy: 'A. Morgan',
    seniorTech: 'R. Thompson',
    source: 'Voice summary after shift handoff',
    title: 'Pressure ramp relief-valve prevention',
    summary: 'Ramp in 25 percent stages and hold five minutes at each stage before final acceptance pressure.',
    status: 'Approved by R. Thompson',
    legacyEffect: 'Added to Thompson Pressure-Ramp Method',
  },
];

export const retirementRecords = [
  {
    name: 'R. Thompson',
    role: 'Senior Test Technician',
    years: 31,
    headline: 'When R. Thompson retires, his pressure-ramp judgment stays in every build that cites his method.',
    metrics: ['47 citations', '9 builds shaped', '23 technicians trained', '3 named techniques'],
    highlights: [
      'Thompson Pressure-Ramp Method became the standard pressure-hold cue for HPU builds.',
      'Mentored hydraulic acceptance judgment across Navy, Collins, and Delta TechOps programs.',
      'His methods are reused by technicians who never worked the same shift with him.',
    ],
  },
];

export const advisorQuestions = [
  {
    recruit: 'A. Morgan',
    project: 'Hydraulic Power Unit Test Stand',
    question: 'Gauge is stable but return line is warming. Continue the hold?',
    urgency: 'High',
    cue: 'Likely bypass valve position check before sensor replacement.',
  },
  {
    recruit: 'N. Shah',
    project: 'F-35 hydraulic cart',
    question: 'Torque sheet calls out older bracket pattern. Which source wins?',
    urgency: 'Medium',
    cue: 'Compare released PDM package against router before work continues.',
  },
];

export const captureQualityChecks = [
  'Tie the note to a procedure step, project, or reusable module.',
  'Add acceptance criteria or a stop condition, not just advice.',
  'Name the evidence needed to prove the step was done correctly.',
  'Flag whether QA, engineering, or senior tech validation is required.',
];

export const adminRiskSignals = [
  {
    label: 'Configuration conflict',
    value: '1',
    detail: 'Router and released schematic mismatch on Zone B.',
    tone: 'red',
  },
  {
    label: 'Product safety holds',
    value: '2',
    detail: 'Steps blocked until QA witness or engineering disposition.',
    tone: 'amber',
  },
  {
    label: 'Training gaps',
    value: '5',
    detail: 'Recruit questions converted into senior tech capture prompts.',
    tone: 'blue',
  },
  {
    label: 'Validated reuse',
    value: '64%',
    detail: 'Procedure modules cited across active projects.',
    tone: 'green',
  },
];

export const intakeItems = [
  {
    id: 'CAP-221',
    type: 'Video walkthrough',
    title: 'Senior tech explains safe hydraulic bleed-down',
    submittedBy: 'T. Rodriguez',
    status: 'AI draft ready',
    age: '2h',
  },
  {
    id: 'CAP-224',
    type: 'Voice memo',
    title: 'How to identify a false flow-meter reading',
    submittedBy: 'K. Williams',
    status: 'Needs transcript review',
    age: '5h',
  },
  {
    id: 'CAP-229',
    type: 'Scanned note',
    title: 'Legacy pressure ramp sequence from 1998 rig',
    submittedBy: 'E. Falkowski',
    status: 'Needs source match',
    age: '1d',
  },
];

export const seniorCaptureDrafts = [
  {
    id: 'DRAFT-318',
    title: 'Bleed-down sequence for trapped hydraulic pressure',
    source: 'Video walkthrough',
    status: 'Ready for senior tech review',
    linkedProcedure: 'TSK-2024-047 step 24',
    transcript:
      'Open the low-point return valve first, watch for pressure creep, then verify the gauge returns to zero before loosening the manifold plug.',
    aiDraft:
      'Draft procedure note: Before removing manifold plugs, release trapped pressure through the low-point return valve and confirm gauge zero for 60 seconds.',
  },
  {
    id: 'DRAFT-322',
    title: 'False flow-meter reading diagnosis',
    source: 'Voice memo',
    status: 'Needs missing detail',
    linkedProcedure: 'Reusable hydraulic troubleshooting module',
    transcript:
      'If the HMI shows flow but the return line stays cold, check the bypass valve position and compare the analog input scaling.',
    aiDraft:
      'Draft troubleshooting pattern: Compare HMI flow, return-line temperature, bypass valve position, and analog scaling before replacing the sensor.',
  },
];

export const seniorReviewChecklist = [
  'Confirm the draft does not conflict with released drawings or ECO status.',
  'Add acceptance criteria, not just advice.',
  'Mark whether QA, engineering, or senior tech approval is required.',
  'Attach source evidence so future technicians can cite the entry.',
];

export const validationQueue = [
  {
    title: 'Pressure transducer zero-offset technique',
    source: 'Voice memo',
    risk: 'Medium',
    action: 'Engineering validation',
  },
  {
    title: 'Emergency stop checkout before full power-up',
    source: 'Manual section + photos',
    risk: 'High',
    action: 'QA signoff required',
  },
  {
    title: 'Shipping blank installation sequence',
    source: 'Video walkthrough',
    risk: 'Low',
    action: 'Senior tech approve',
  },
];

export const adminSignals = [
  { label: 'Open procedures', value: '7', detail: '3 with active blockers' },
  { label: 'Evidence packets', value: '42', detail: '5 awaiting QA witness' },
  { label: 'Legacy drafts', value: '14', detail: '8 from senior tech capture' },
  { label: 'Reuse rate', value: '64%', detail: 'modules cited this month' },
];

export const domainBasis = [
  {
    label: 'CUI boundary',
    detail: 'Workspace assumes controlled local processing for defense data.',
  },
  {
    label: 'Configuration control',
    detail: 'Procedure revisions, source baseline, PDM package, and ECO status stay visible.',
  },
  {
    label: 'Verification evidence',
    detail: 'Technicians cannot advance without required proof and witness fields.',
  },
  {
    label: 'Human factors',
    detail: 'Senior tech knowledge is captured in natural formats, then validated.',
  },
];

export const meetingContext = [
  {
    label: 'Systems roadmap',
    detail: 'SOLIDWORKS PDM is rolling out for CAD control; PLM becomes engineering system of record and pushes BOM data into Epicor.',
  },
  {
    label: 'Legacy data reality',
    detail: '60 years of files, 2M+ records, deep folders, duplicates, revision conflicts, and unclear source-of-truth documents.',
  },
  {
    label: 'Internal search already exists',
    detail: 'Their SQL indexer cut file search from about 30 minutes to seconds, so V2 complements it instead of replacing it.',
  },
  {
    label: 'Operations constraint',
    detail: 'Large custom machines stay fixed in place while parallel crews work across 2 shifts and 16 planned hours.',
  },
  {
    label: 'Adoption stance',
    detail: 'Keep changes light until Testek shares the actual workflow; start with selective migration and visible value around real procedures.',
  },
  {
    label: 'Prototype comparison',
    detail: 'Current V2 should be reviewed beside the older prototype, left to right: operations layer, senior tech layer, then admin.',
  },
  {
    label: 'Product posture',
    detail: 'Position as a packaged build-and-legacy module, while tomorrow’s call may open a separate production scheduling pitch.',
  },
];

export const integrationTargets = [
  { name: 'PDM', status: 'Module 1 rollout', detail: 'Released CAD, revision control, approval workflow' },
  { name: 'PLM', status: 'Module 2 design', detail: 'Engineering metadata, related documents, BOM handoff' },
  { name: 'Epicor ERP', status: 'Downstream system', detail: 'BOMs, production schedule, inventory visibility gaps' },
  { name: 'SQL File Index', status: 'Existing internal tool', detail: 'Legacy file/path discovery and engineer-led cleansing' },
];

export const questionnairePrompts = [
  'Which document types should be eligible for vault citation on day one?',
  'Where should approved procedure revisions live: PDM, PLM, or the build-and-legacy layer with PLM reference?',
  'Which steps require QA witness, engineering disposition, or supervisor-only signoff?',
  'What is the minimum evidence packet for FAT readiness?',
  'Which legacy projects are safe pilot candidates for similarity search?',
];
