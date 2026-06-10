import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  Database,
  FileText,
  FileCheck2,
  Gauge,
  HelpCircle,
  ListChecks,
  Mic,
  Radio,
  Search,
  Send,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react';
import testekLogo from './assets/testek-logo.png';
import {
  advisorContributions,
  advisorQuestions,
  advisorRecruits,
  adminSignals,
  adminRiskSignals,
  captureQualityChecks,
  intakeItems,
  procedure,
  recruitHelpTopics,
  seniorCaptureDrafts,
  technicianGuardrails,
  technicianSteps,
  validationQueue,
  vaultEntries,
  workstreams,
} from './data.js';

const views = [
  { key: 'technician', label: 'Technician', icon: ListChecks },
  { key: 'advisor', label: 'Advisor', icon: UserCheck },
  { key: 'admin', label: 'Admin', icon: Users },
];

function StatusPill({ children, tone = 'neutral' }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

function ModeSwitch({ activeView, onChange }) {
  return (
    <nav className="mode-switch" aria-label="Workspace views">
      {views.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          className={activeView === key ? 'active' : ''}
          aria-current={activeView === key ? 'page' : undefined}
          onClick={() => onChange(key)}
        >
          <Icon size={17} aria-hidden="true" />
          {label}
        </button>
      ))}
    </nav>
  );
}

function ShellHeader({ activeView, setActiveView }) {
  return (
    <header className="topbar">
      <div className="brand-lockup">
        <img src={testekLogo} alt="Testek Solutions" />
        <div>
          <strong>Knowledge Vault</strong>
          <span>Role-based procedure execution</span>
        </div>
      </div>
      <ModeSwitch activeView={activeView} onChange={setActiveView} />
    </header>
  );
}

function PageHeader({ eyebrow, title, detail, children }) {
  return (
    <section className="page-header" aria-labelledby="page-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1 id="page-heading">{title}</h1>
        <p>{detail}</p>
      </div>
      {children}
    </section>
  );
}

function Metric({ label, value, detail, tone = 'neutral' }) {
  return (
    <section className={`metric metric-${tone}`} aria-label={label}>
      <strong>{value}</strong>
      <span>{label}</span>
      {detail && <small>{detail}</small>}
    </section>
  );
}

function TechnicianView() {
  const activeStep = technicianSteps.find((step) => step.status === 'active');
  const nextStep = technicianSteps.find((step) => step.status === 'blocked');

  return (
    <>
      <PageHeader
        eyebrow={`${procedure.recruit} / ${procedure.recruitExperience} experience`}
        title="Follow the procedure path"
        detail="This view keeps the new recruit focused on what to do now, what unlocks next, and who to ask for help."
      >
        <div className="contact-card">
          <span>Assigned advisor</span>
          <strong>{procedure.assignedMentor}</strong>
          <small>Suggested: {procedure.suggestedMentor}</small>
        </div>
      </PageHeader>

      <section className="role-grid technician-grid">
        <div className="primary-stack">
          <CurrentStepCard step={activeStep} />
          <ProcedurePath />
        </div>
        <aside className="assist-stack">
          <RecruitCopilot />
          <NeedHelpCard blockedStep={nextStep} />
        </aside>
      </section>
    </>
  );
}

function CurrentStepCard({ step }) {
  return (
    <section className="panel current-step" aria-labelledby="current-step-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Do this now</span>
          <h2 id="current-step-heading">Step {step.id}: {step.title}</h2>
        </div>
        <StatusPill tone="blue">Active</StatusPill>
      </div>
      <p className="instruction">{step.guidance}</p>
      <div className="action-block">
        <h3>Required before advance</h3>
        <ul>
          {step.dependencies.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
      <div className="evidence-grid" aria-label="Evidence required">
        {step.evidence.map((item) => (
          <span key={item}><ClipboardCheck size={15} aria-hidden="true" /> {item}</span>
        ))}
      </div>
      <details className="inline-disclosure">
        <summary>Quality guardrails for this step</summary>
        <div className="guardrail-grid">
          {technicianGuardrails.map((item) => (
            <article key={item.label}>
              <strong>{item.label}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </details>
      <button type="button" className="primary-action">
        <CheckCircle2 size={18} aria-hidden="true" />
        Submit evidence for review
      </button>
    </section>
  );
}

function ProcedurePath() {
  const [selectedStepId, setSelectedStepId] = useState(procedure.currentStep);
  const selectedStep = technicianSteps.find((step) => step.id === selectedStepId) || technicianSteps[0];

  return (
    <section className="panel" aria-labelledby="path-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{procedure.id} / {procedure.revision}</span>
          <h2 id="path-heading">Workflow path</h2>
        </div>
        <span className="step-count">Step {procedure.currentStep} of {procedure.totalSteps}</span>
      </div>
      <div className="path-list" aria-label="Procedure workflow steps">
        {technicianSteps.map((step) => (
          <button
            key={step.id}
            type="button"
            className={`path-step status-${step.status} ${selectedStep.id === step.id ? 'is-selected' : ''}`}
            aria-pressed={selectedStep.id === step.id}
            aria-describedby="selected-step-detail"
            onClick={() => setSelectedStepId(step.id)}
          >
            <div className="path-marker">
              {step.status === 'complete' ? <CheckCircle2 size={17} aria-hidden="true" /> : step.id}
            </div>
            <div>
              <h3>{step.title}</h3>
              <p>{step.workstream} / {step.duration}</p>
            </div>
            <StatusPill tone={step.status === 'active' ? 'blue' : step.status === 'blocked' ? 'red' : step.status === 'complete' ? 'green' : 'neutral'}>
              {step.status}
            </StatusPill>
          </button>
        ))}
      </div>
      <StepDetailPanel step={selectedStep} />
    </section>
  );
}

function StepDetailPanel({ step }) {
  return (
    <section id="selected-step-detail" className={`step-detail status-${step.status}`} aria-labelledby="selected-step-heading">
      <div className="section-heading compact-heading">
        <div>
          <span className="eyebrow">Selected step details</span>
          <h3 id="selected-step-heading">Step {step.id}: {step.title}</h3>
        </div>
        <StatusPill tone={step.status === 'active' ? 'blue' : step.status === 'blocked' ? 'red' : step.status === 'complete' ? 'green' : 'neutral'}>
          {step.status}
        </StatusPill>
      </div>
      {step.guidance && <p className="step-detail-note">{step.guidance}</p>}
      {step.blocker && <p className="step-detail-note blocker-detail">{step.blocker}</p>}
      <div className="step-detail-grid">
        <div>
          <strong>Evidence</strong>
          <ul>
            {step.evidence.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div>
          <strong>Prerequisites</strong>
          <ul>
            {(step.dependencies || ['Previous step complete']).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div>
          <strong>Vault references</strong>
          <ul>
            {step.vaultRefs.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

function RecruitCopilot() {
  const [selected, setSelected] = useState(recruitHelpTopics[0]);
  const [question, setQuestion] = useState('');

  function handleAsk(event) {
    event.preventDefault();
    const q = question.trim().toLowerCase();
    if (!q) return;
    const intent = q.includes('contact') || q.includes('who')
      ? 'who'
      : q.includes('block') || q.includes('hold') || q.includes('stuck')
        ? 'blocking'
        : q.includes('advance') || q.includes('next')
          ? 'advance'
          : '';
    const match = recruitHelpTopics.find((topic) => topic.question.toLowerCase().includes(intent));
    setSelected(match || recruitHelpTopics[0]);
    setQuestion('');
  }

  return (
    <section className="panel copilot-panel" aria-labelledby="copilot-heading">
      <div className="section-heading compact-heading">
        <div>
          <span className="eyebrow">Procedure copilot</span>
          <h2 id="copilot-heading">Ask before you act</h2>
        </div>
        <Bot size={22} aria-hidden="true" />
      </div>
      <div className="answer-box">
        <strong>{selected.question}</strong>
        <p>{selected.answer}</p>
        <small>Copilot uses released procedure, current step state, and validated vault notes only.</small>
      </div>
      <div className="prompt-list" aria-label="Common copilot questions">
        {recruitHelpTopics.map((topic) => (
          <button key={topic.question} type="button" onClick={() => setSelected(topic)}>
            {topic.question}
          </button>
        ))}
      </div>
      <form className="ask-form" onSubmit={handleAsk}>
        <label htmlFor="copilot-question" className="sr-only">Ask the procedure copilot</label>
        <input
          id="copilot-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask about next step, blocker, or contact"
        />
        <button type="submit" aria-label="Send question">
          <Send size={17} aria-hidden="true" />
        </button>
      </form>
    </section>
  );
}

function NeedHelpCard({ blockedStep }) {
  return (
    <section className="panel help-card" aria-labelledby="help-heading">
      <div className="section-heading compact-heading">
        <div>
          <span className="eyebrow">Reach out</span>
          <h2 id="help-heading">Who can help</h2>
        </div>
        <HelpCircle size={20} aria-hidden="true" />
      </div>
      <dl className="contact-list">
        <div><dt>Advisor</dt><dd>{procedure.assignedMentor}</dd></div>
        <div><dt>Suggested mentor</dt><dd>{procedure.suggestedMentor}</dd></div>
        <div><dt>Next notification</dt><dd>{procedure.nextNotify}</dd></div>
      </dl>
      {blockedStep && (
        <p className="blocker-note">
          <AlertTriangle size={15} aria-hidden="true" />
          {blockedStep.title}: {blockedStep.blocker}
        </p>
      )}
    </section>
  );
}

function AdvisorView() {
  const [textEntries, setTextEntries] = useState([]);

  function handleSubmit(entry) {
    setTextEntries((current) => [
      {
        id: `TEXT-${String(current.length + 1).padStart(3, '0')}`,
        title: entry.title,
        type: entry.mode,
        detail: entry.detail,
      },
      ...current,
    ]);
  }

  return (
    <>
      <PageHeader
        eyebrow="Senior advisor workspace"
        title="Advisor workspace"
        detail="Advisor sees recruit questions, records voice or text knowledge, and reviews draft vault entries."
      >
        <div className="header-metrics">
          <Metric value="3" label="Assigned recruits" />
          <Metric value={2 + textEntries.length} label="Drafts ready" tone="blue" />
        </div>
      </PageHeader>

      <section className="role-grid advisor-grid">
        <AdvisorCaptureForm onSubmit={handleSubmit} />
        <AdvisorQuestionQueue />
        <RecruitQueue />
        <AdvisorDraftQueue textEntries={textEntries} />
      </section>
    </>
  );
}

function AdvisorCaptureForm({ onSubmit }) {
  const [mode, setMode] = useState('Voice note');
  const [title, setTitle] = useState('Pressure decay test acceptance cue');
  const [detail, setDetail] = useState('If the return line warms before pressure stabilizes, verify bypass valve position before replacing the transducer.');

  function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim() || !detail.trim()) return;
    onSubmit({ mode, title: title.trim(), detail: detail.trim() });
    setTitle('');
    setDetail('');
  }

  return (
    <section className="panel capture-console" aria-labelledby="capture-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Knowledge capture</span>
          <h2 id="capture-heading">Add to vault review</h2>
        </div>
      </div>
      <div className="capture-toggle" role="group" aria-label="Capture mode">
        {['Voice note', 'Text note'].map((item) => (
          <button key={item} type="button" className={mode === item ? 'active' : ''} onClick={() => setMode(item)}>
            {item === 'Voice note' ? <Mic size={17} aria-hidden="true" /> : <FileCheck2 size={17} aria-hidden="true" />}
            {item}
          </button>
        ))}
      </div>
      <form className="capture-form" onSubmit={handleSubmit}>
        <label htmlFor="advisor-title">Title</label>
        <input id="advisor-title" value={title} onChange={(event) => setTitle(event.target.value)} />
        <label htmlFor="advisor-detail">Procedure detail</label>
        <textarea id="advisor-detail" rows="5" value={detail} onChange={(event) => setDetail(event.target.value)} />
        <button type="submit" className="primary-action" disabled={!title.trim() || !detail.trim()}>
          <Database size={17} aria-hidden="true" />
          Send to vault review
        </button>
      </form>
      <details className="inline-disclosure capture-checks">
        <summary>What makes a useful vault entry</summary>
        <ul>
          {captureQualityChecks.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </details>
    </section>
  );
}

function AdvisorQuestionQueue() {
  return (
    <section className="panel advisor-question-panel" aria-labelledby="advisor-question-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">New recruit questions</span>
          <h2 id="advisor-question-heading">Needs advisor answer</h2>
        </div>
      </div>
      <div className="question-queue">
        {advisorQuestions.map((item) => (
          <article key={item.question}>
            <div className="risk-icon">
              <AlertTriangle size={17} aria-hidden="true" />
            </div>
            <div>
              <span className="eyebrow">{item.recruit} / {item.project}</span>
              <h3>{item.question}</h3>
              <p>{item.cue}</p>
            </div>
            <StatusPill tone={item.urgency === 'High' ? 'red' : 'amber'}>{item.urgency}</StatusPill>
          </article>
        ))}
      </div>
    </section>
  );
}

function RecruitQueue() {
  return (
    <section className="panel recruit-panel" aria-labelledby="recruit-queue-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Recruit support</span>
          <h2 id="recruit-queue-heading">Questions and blockers</h2>
        </div>
      </div>
      <div className="recruit-table">
        {advisorRecruits.map((recruit) => (
          <article key={recruit.name}>
            <div>
              <h3>{recruit.name}</h3>
              <p>{recruit.project}</p>
            </div>
            <div>
              <strong>{recruit.currentStep}</strong>
              <span>{recruit.suggestedMentor}</span>
            </div>
            <StatusPill tone={recruit.status.includes('Needs') ? 'amber' : 'green'}>{recruit.status}</StatusPill>
          </article>
        ))}
      </div>
    </section>
  );
}

function AdvisorDraftQueue({ textEntries }) {
  return (
    <section className="panel draft-panel" aria-labelledby="draft-queue-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Vault draft queue</span>
          <h2 id="draft-queue-heading">Review before release</h2>
        </div>
      </div>
      <div className="draft-queue">
        {textEntries.map((entry) => (
          <article key={entry.id} className="draft-row new-draft">
            <div>
              <span className="eyebrow">{entry.id} / {entry.type}</span>
              <h3>{entry.title}</h3>
              <p>{entry.detail}</p>
            </div>
            <button type="button">Mark accurate</button>
          </article>
        ))}
        {seniorCaptureDrafts.map((draft) => (
          <article key={draft.id} className="draft-row">
            <div>
              <span className="eyebrow">{draft.id} / {draft.source}</span>
              <h3>{draft.title}</h3>
              <p>{draft.aiDraft}</p>
            </div>
            <button type="button">Review</button>
          </article>
        ))}
      </div>
    </section>
  );
}

function AdminView() {
  return (
    <>
      <PageHeader
        eyebrow="Admin control room"
        title="Operations control room"
        detail="Admin sees the full system: project status, who is working where, draft quality, and advisor participation."
      >
        <div className="header-metrics">
          {adminSignals.slice(0, 3).map((signal) => (
            <Metric key={signal.label} value={signal.value} label={signal.label} detail={signal.detail} />
          ))}
        </div>
      </PageHeader>

      <section className="admin-layout">
        <ProjectStatusBoard />
        <AdvisorContributionBoard />
        <AdminRiskBoard />
        <VaultHealthBoard />
      </section>
    </>
  );
}

function AdminRiskBoard() {
  return (
    <section className="panel admin-risk-board" aria-labelledby="admin-risk-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Risk and quality signals</span>
          <h2 id="admin-risk-heading">What needs attention</h2>
        </div>
      </div>
      <div className="risk-signal-grid">
        {adminRiskSignals.map((signal) => (
          <article key={signal.label} className={`risk-signal risk-${signal.tone}`}>
            <FileText size={18} aria-hidden="true" />
            <div>
              <strong>{signal.value}</strong>
              <span>{signal.label}</span>
              <p>{signal.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectStatusBoard() {
  return (
    <section className="panel" aria-labelledby="project-status-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Project status</span>
          <h2 id="project-status-heading">Who is working on what</h2>
        </div>
      </div>
      <div className="project-table">
        {workstreams.map((project) => (
          <article key={project.name}>
            <div>
              <h3>{project.name}</h3>
              <p>{project.activeStep}</p>
            </div>
            <div>
              <strong>{project.owner}</strong>
              <span>{project.experience} experience</span>
            </div>
            <div className="progress-cell">
              <span>{project.progress}%</span>
              <div className="progress-line" role="progressbar" aria-label={`${project.name} progress`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={project.progress}>
                <i style={{ width: `${project.progress}%` }} />
              </div>
            </div>
            <StatusPill tone={project.blocked ? 'red' : 'green'}>{project.blocked ? 'Blocked' : 'Ready'}</StatusPill>
          </article>
        ))}
      </div>
    </section>
  );
}

function AdvisorContributionBoard() {
  return (
    <section className="panel" aria-labelledby="advisor-contribution-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Advisor contribution</span>
          <h2 id="advisor-contribution-heading">Who is adding knowledge</h2>
        </div>
      </div>
      <div className="advisor-cards">
        {advisorContributions.map((advisor) => (
          <article key={advisor.advisor}>
            <div className="card-row">
              <div>
                <h3>{advisor.advisor}</h3>
                <p>{advisor.role}</p>
              </div>
              <strong>{advisor.entries}</strong>
            </div>
            <p>{advisor.focus}</p>
            <div className="mini-stats">
              <span>{advisor.approved} approved</span>
              <span>{advisor.pending} pending</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function VaultHealthBoard() {
  const validatedCount = useMemo(() => vaultEntries.filter((entry) => entry.status === 'Validated').length, []);

  return (
    <section className="panel vault-admin" aria-labelledby="vault-health-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Knowledge Vault</span>
          <h2 id="vault-health-heading">Drafts and validated entries</h2>
        </div>
        <div className="search-box">
          <Search size={16} aria-hidden="true" />
          <span>{validatedCount} validated</span>
        </div>
      </div>
      <div className="vault-admin-grid">
        <div>
          <h3>Waiting for review</h3>
          {validationQueue.map((item) => (
            <article key={item.title}>
              <div>
                <strong>{item.title}</strong>
                <span>{item.source}</span>
              </div>
              <StatusPill tone={item.risk === 'High' ? 'red' : item.risk === 'Medium' ? 'amber' : 'green'}>{item.action}</StatusPill>
            </article>
          ))}
        </div>
        <div>
          <h3>Recent intake</h3>
          {intakeItems.map((item) => (
            <article key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <span>{item.submittedBy} / {item.age}</span>
              </div>
              <StatusPill tone={item.status.includes('ready') ? 'green' : 'amber'}>{item.status}</StatusPill>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState('technician');
  const activeLabel = views.find((view) => view.key === activeView)?.label || 'Technician';

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <ShellHeader activeView={activeView} setActiveView={setActiveView} />
      <main id="main-content" className={`view-${activeView}`} tabIndex="-1" aria-label={`${activeLabel} workspace`}>
        {activeView === 'technician' && <TechnicianView />}
        {activeView === 'advisor' && <AdvisorView />}
        {activeView === 'admin' && <AdminView />}
      </main>
      <div className="security-footer" aria-label="Deployment posture">
        <ShieldCheck size={16} aria-hidden="true" />
        <span>On-prem / CMMC-aware / revision controlled</span>
        <Radio size={16} aria-hidden="true" />
        <span>Live project demo data</span>
      </div>
    </div>
  );
}
