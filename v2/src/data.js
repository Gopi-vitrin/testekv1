export const procedure = {
  id: 'TSK-PROC-047',
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
};

export const technicianSteps = [
  {
    id: 22,
    title: 'Verify manifold bracket torque pattern',
    workstream: 'Hydraulic',
    owner: 'M. Chen',
    status: 'complete',
    duration: '38 min',
    evidence: ['Torque log uploaded', 'Photo set accepted'],
    vaultRefs: ['KV-1042'],
  },
  {
    id: 23,
    title: 'Route hydraulic return circuit and label service ports',
    workstream: 'Hydraulic',
    owner: 'M. Chen',
    status: 'complete',
    duration: '52 min',
    evidence: ['Port labels verified', 'Routing photo accepted'],
    vaultRefs: ['KV-1184'],
  },
  {
    id: 24,
    title: 'Pressure decay test at 150 percent rated pressure',
    workstream: 'Hydraulic',
    owner: 'M. Chen',
    status: 'active',
    duration: '75 min planned',
    dependencies: ['Steps 22-23 complete', 'Calibrated gauge cert attached', 'QA witness assigned'],
    evidence: ['Pressure chart', 'Gauge serial number', 'QA initials', 'Hold time reading'],
    guidance:
      'Follow the released pressure ramp sequence. Do not advance if pressure drop exceeds acceptance band or if gauge certificate is expired.',
    vaultRefs: ['KV-1042', 'KV-1210'],
  },
  {
    id: 25,
    title: 'Release electrical Zone B termination',
    workstream: 'Electrical',
    owner: 'K. Williams',
    status: 'blocked',
    duration: 'Waiting 6h',
    blocker: 'Drawing revision mismatch between router and released schematic.',
    evidence: ['ECO note', 'Wiring photo'],
    vaultRefs: ['KV-1098'],
  },
  {
    id: 26,
    title: 'Notify controls team for PLC baseline load',
    workstream: 'Controls',
    owner: 'J. Patel',
    status: 'locked',
    duration: 'Next safe step',
    dependencies: ['Electrical Zone B released', 'I/O map verified'],
    evidence: ['Program hash', 'I/O checkout file'],
    vaultRefs: ['KV-1304'],
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
    source: 'Legacy manual + advisor review',
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
    answer: 'Start with assigned advisor E. Falkowski. For the hydraulic pressure module, M. Chen is the suggested mentor.',
  },
  {
    question: 'What is blocking the next crew?',
    answer: 'Electrical Zone B is on hold because the router and released schematic do not match. Wait for ECO-4421 disposition.',
  },
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

export const advisorContributions = [
  {
    advisor: 'E. Falkowski',
    role: 'Hydraulics advisor',
    entries: 8,
    approved: 5,
    pending: 3,
    focus: 'Pressure ramp acceptance, bleed-down safety, legacy test stand patterns',
  },
  {
    advisor: 'M. Chen',
    role: 'Hydraulic systems lead',
    entries: 6,
    approved: 4,
    pending: 2,
    focus: 'Manifold torque verification, gauge setup, pressure decay evidence',
  },
  {
    advisor: 'K. Williams',
    role: 'Electrical advisor',
    entries: 4,
    approved: 2,
    pending: 2,
    focus: 'Revision mismatch triage, Zone B termination checks, ECO holds',
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
  'Flag whether QA, engineering, or advisor validation is required.',
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
    detail: 'Recruit questions converted into advisor capture prompts.',
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
    title: 'Advisor explains safe hydraulic bleed-down',
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
    status: 'Ready for advisor review',
    linkedProcedure: 'TSK-PROC-047 step 24',
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
  'Mark whether QA, engineering, or advisor approval is required.',
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
    action: 'Advisor approve',
  },
];

export const adminSignals = [
  { label: 'Open procedures', value: '7', detail: '3 with active blockers' },
  { label: 'Evidence packets', value: '42', detail: '5 awaiting QA witness' },
  { label: 'Vault drafts', value: '14', detail: '8 from advisor capture' },
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
    detail: 'Advisor knowledge is captured in natural formats, then validated.',
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
    detail: 'Current V2 should be reviewed beside the older prototype, left to right: operations layer, advisor layer, then admin.',
  },
  {
    label: 'Product posture',
    detail: 'Position as a packaged Knowledge Vault module, while tomorrow’s call may open a separate production scheduling pitch.',
  },
];

export const integrationTargets = [
  { name: 'PDM Vault', status: 'Phase 1 rollout', detail: 'Released CAD, revision control, approval workflow' },
  { name: 'PLM', status: 'Phase 2 design', detail: 'Engineering metadata, related documents, BOM handoff' },
  { name: 'Epicor ERP', status: 'Downstream system', detail: 'BOMs, production schedule, inventory visibility gaps' },
  { name: 'SQL File Index', status: 'Existing internal tool', detail: 'Legacy file/path discovery and engineer-led cleansing' },
];

export const questionnairePrompts = [
  'Which document types should be eligible for vault citation on day one?',
  'Where should approved procedure revisions live: PDM, PLM, or the Knowledge Vault with PLM reference?',
  'Which steps require QA witness, engineering disposition, or supervisor-only signoff?',
  'What is the minimum evidence packet for FAT readiness?',
  'Which legacy projects are safe pilot candidates for similarity search?',
];
