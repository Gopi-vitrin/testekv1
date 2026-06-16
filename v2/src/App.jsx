import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
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
  advisorQuestions,
  advisorContributions,
  advisorRecruits,
  adminAdoptionSignals,
  adminRiskSignals,
  buildModules,
  buildProjects,
  intakeItems,
  legacyTechniques,
  conversationCaptures,
  procedure,
  recognitionLeaders,
  retirementRecords,
  repeatQuestionSignals,
  reusableModules,
  seniorCaptureDrafts,
  stationMeta,
  systemHealth,
  technicianProfiles,
  technicianGuardrails,
  technicianSteps,
  validationQueue,
  vaultEntries,
  workstreams,
} from './data.js';

const views = [
  { key: 'technician', label: 'Technician', icon: ListChecks },
  { key: 'advisor', label: 'Senior Tech', icon: UserCheck },
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
          <strong>TESTEK · BUILD</strong>
          <span>Aerospace test equipment lifecycle platform</span>
        </div>
      </div>
      <div className="header-cert-strip" aria-label="System controls">
        <span>AS9100 Rev D</span>
        <span>CMMC 2.0</span>
        <span>On-prem local server</span>
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
        {detail && <p>{detail}</p>}
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

function ProfileButton({ name, onOpen }) {
  if (!name) return null;
  return (
    <button type="button" className="profile-link" onClick={() => onOpen?.(name)}>
      {name}
    </button>
  );
}

function ProfileModal({ profile, onClose }) {
  if (!profile) return null;
  const stats = [
    ['Citations', profile.totalCitations ?? 0],
    ['Builds shaped', profile.projectsContributed],
    ['Techs trained', profile.techniciansTrained ?? 0],
    ['Named methods', profile.signatureMethods?.length ?? 0],
  ];

  return (
    <div className="modal-scrim" role="dialog" aria-modal="true" aria-labelledby="profile-title" onClick={onClose}>
      <section className="profile-modal" onClick={(event) => event.stopPropagation()}>
        <div className="profile-modal-header">
          <div>
            <span className="eyebrow">Career body of work</span>
            <h2 id="profile-title">{profile.name}</h2>
            <p>{profile.role} / {profile.yearsAtTestek || profile.yearsExperience} years at Testek</p>
          </div>
          <button type="button" aria-label="Close profile" onClick={onClose}>Close</button>
        </div>
        {profile.legacyLine && <p className="profile-legacy">{profile.legacyLine}</p>}
        <div className="profile-stats">
          {stats.map(([label, value]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="legacy-record-grid">
          {profile.buildsShaped?.length > 0 && (
            <div className="legacy-section">
              <h3>Builds shaped</h3>
              <ul>{profile.buildsShaped.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          )}
          {profile.signatureMethods?.length > 0 && (
            <div className="legacy-section">
              <h3>Techniques authored</h3>
              <ul>{profile.signatureMethods.map((method) => <li key={method}>{method}</li>)}</ul>
            </div>
          )}
          {profile.menteeLinks?.length > 0 && (
            <div className="legacy-section">
              <h3>People trained</h3>
              <ul>{profile.menteeLinks.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          )}
          {profile.stationMastery?.length > 0 && (
            <div className="legacy-section station-mastery-section">
              <h3>Station mastery</h3>
              <ul>{profile.stationMastery.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          )}
          <div className="legacy-section legacy-timeline">
            <h3>Career record</h3>
            <ul>
              <li>First cited method: pressure-ramp acceptance hold</li>
              <li>Most reused method: Thompson Pressure-Ramp Method</li>
              <li>Leadership action: eligible for weekly recognition</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function KnowledgeLayer({ step, onAddNote, onAskExpert, onSaveAnswerNote, onOpenProfile, compact = false }) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [questionText, setQuestionText] = useState('');
  const notes = step.techniqueNotes || [];
  const questions = step.questions || [];
  const expert = step.completedBy || notes[0]?.author;

  function submitNote() {
    if (!noteText.trim()) return;
    onAddNote?.(step.id, noteText.trim());
    setNoteText('');
    setNoteOpen(false);
  }

  function submitQuestion() {
    if (!questionText.trim()) return;
    onAskExpert?.(step.id, questionText.trim());
    setQuestionText('');
    setAskOpen(false);
  }

  if (compact && notes.length === 0 && questions.length === 0) return null;

  return (
    <div className={`knowledge-layer ${compact ? 'is-compact' : ''}`}>
      {step.completedBy && (
        <p className="built-by">
          Built by <ProfileButton name={step.completedBy} onOpen={onOpenProfile} />
          {step.completedAt && <span> / {step.completedAt}</span>}
        </p>
      )}

      {notes.map((note) => (
        <article key={note.id} className={`technique-note ${note.endorsed ? 'is-verified' : ''} ${note.named ? 'is-named' : ''}`}>
          <div>
            <span className="eyebrow">{note.named ? 'Named technique' : note.endorsed ? 'Credited senior method' : 'Waiting for senior approval'}</span>
            {note.name && <h3>{note.name}</h3>}
            <p>{note.text}</p>
          </div>
          <div className="note-meta">
            <span>by <ProfileButton name={note.author} onOpen={onOpenProfile} /></span>
            {note.sourceQuestion && <span>Captured from conversation</span>}
            {note.endorsed && <span>Approved by {note.endorsedBy}</span>}
            {note.citations ? (
              <span>{note.citations.buildCount} builds / {note.citations.customers.length} customers / {note.citations.technicians.length} technicians</span>
            ) : (note.appliedAcrossBuilds || 0) > 0 && <span>{note.appliedAcrossBuilds} builds</span>}
          </div>
        </article>
      ))}

      {questions.map((question) => (
        <article key={question.id} className="qa-thread">
          <p><strong>Q:</strong> <ProfileButton name={question.askedBy} onOpen={onOpenProfile} /> asked: {question.text}</p>
          {question.answer ? (
            <>
              <p><strong>A:</strong> <ProfileButton name={question.answer.author} onOpen={onOpenProfile} /> answered: {question.answer.text}</p>
              {!question.savedAsNote && (
                <button
                  type="button"
                  className="save-answer-note"
                  onClick={() => onSaveAnswerNote?.(step.id, question.id)}
                >
                  Save this answer as a credited technique note
                </button>
              )}
            </>
          ) : (
            <p className="pending-answer">Routed to {expert || 'expert'} - awaiting response</p>
          )}
        </article>
      ))}

      {!compact && (
        <div className="knowledge-actions">
          <button type="button" onClick={() => setNoteOpen((open) => !open)}>Add to body of work</button>
          {expert && <button type="button" onClick={() => setAskOpen((open) => !open)}>Ask senior tech</button>}
        </div>
      )}

      {noteOpen && (
        <div className="quick-entry">
          <label className="sr-only" htmlFor={`note-${step.id}`}>Add technique note</label>
          <textarea
            id={`note-${step.id}`}
            value={noteText}
            onChange={(event) => setNoteText(event.target.value)}
            placeholder="Capture what happened on the floor. A senior tech approves it before it joins their body of work."
            rows="2"
          />
          <button type="button" onClick={submitNote} disabled={!noteText.trim()}>Save</button>
        </div>
      )}

      {askOpen && (
        <div className="quick-entry">
          <label className="sr-only" htmlFor={`ask-${step.id}`}>Ask senior tech</label>
          <textarea
            id={`ask-${step.id}`}
            value={questionText}
            onChange={(event) => setQuestionText(event.target.value)}
            placeholder={`Ask ${expert} about this step`}
            rows="2"
          />
          <button type="button" onClick={submitQuestion} disabled={!questionText.trim()}>Ask</button>
        </div>
      )}
    </div>
  );
}

function TechnicianView({ steps, onAddNote, onAskExpert, onSaveAnswerNote, onOpenProfile }) {
  const defaultModuleId = procedure.assignedModuleId || buildModules.find((module) => module.status === 'active')?.id || buildModules[0].id;
  const defaultBuildId = buildProjects.find((build) => build.assignedModuleId === defaultModuleId)?.id || buildProjects[0].id;
  const [selectedBuildId, setSelectedBuildId] = useState(defaultBuildId);
  const [selectedModuleId, setSelectedModuleId] = useState(defaultModuleId);
  const activeBuild = buildProjects.find((build) => build.id === selectedBuildId) || buildProjects[0];
  const selectedModule = buildModules.find((module) => module.id === selectedModuleId) || buildModules[0];
  const moduleSteps = selectedModule.steps
    .map((stepId) => steps.find((step) => step.id === stepId))
    .filter(Boolean);
  const allModuleSteps = moduleSteps.length > 0 ? moduleSteps : steps.filter((step) => step.moduleId === selectedModule.id);
  const activeStep = allModuleSteps.find((step) => step.status === 'active') || allModuleSteps[0] || null;
  function selectBuild(buildId) {
    const build = buildProjects.find((item) => item.id === buildId);
    if (!build) return;
    setSelectedBuildId(build.id);
    setSelectedModuleId(build.assignedModuleId);
  }
  function selectModule(moduleId) {
    const module = buildModules.find((item) => item.id === moduleId);
    if (!module) return;
    setSelectedModuleId(module.id);
    setSelectedBuildId(module.buildId);
  }

  return (
    <>
      <PageHeader
        eyebrow={`${procedure.recruit} / ${procedure.recruitExperience} experience / ${activeBuild.id}`}
        title={selectedModule.name}
        detail={`${activeBuild.customer} / ${activeBuild.type === 'retrofit' ? 'Retrofit' : 'New build'}`}
      >
        <div className="contact-card">
          <span>Senior tech</span>
          <strong>{procedure.assignedMentor}</strong>
          <small>Backup: {procedure.suggestedMentor}</small>
        </div>
      </PageHeader>

      <BuildProjectSwitch activeBuildId={activeBuild.id} onSelect={selectBuild} />

      <section className="role-grid technician-grid">
        <div className="primary-stack">
          {activeStep ? (
            <>
              <CurrentStepCard step={activeStep} module={selectedModule} onAddNote={onAddNote} onAskExpert={onAskExpert} onSaveAnswerNote={onSaveAnswerNote} onOpenProfile={onOpenProfile} />
              <ModulePathStrip
                modules={buildModules}
                selectedModuleId={selectedModule.id}
                onSelect={selectModule}
              />
              <ShiftHandoffStrip step={activeStep} />
            </>
          ) : (
            <>
              <ModulePendingCard module={selectedModule} />
              <ModulePathStrip
                modules={buildModules}
                selectedModuleId={selectedModule.id}
                onSelect={selectModule}
              />
            </>
          )}
          <ModuleSequencePanel module={selectedModule} steps={allModuleSteps} onAddNote={onAddNote} onAskExpert={onAskExpert} onSaveAnswerNote={onSaveAnswerNote} onOpenProfile={onOpenProfile} />
        </div>
        <aside className="assist-stack">
          {activeStep && <TechnicianStepReference step={activeStep} />}
          <ModulePlmPanel module={selectedModule} />
        </aside>
      </section>
    </>
  );
}

function BuildProjectSwitch({ activeBuildId, onSelect }) {
  return (
    <section className="project-switch" aria-label="Active project">
      {buildProjects.map((build) => (
        <button
          key={build.id}
          type="button"
          className={build.id === activeBuildId ? 'is-selected' : ''}
          aria-pressed={build.id === activeBuildId}
          onClick={() => onSelect(build.id)}
        >
          <strong>{build.id}</strong>
          <span>{build.title}</span>
          {build.type === 'retrofit' && <small>Built {build.originalYear} / original team retired</small>}
        </button>
      ))}
    </section>
  );
}

function ModulePathStrip({ modules, selectedModuleId, onSelect }) {
  return (
    <section className="panel module-path-strip" aria-labelledby="module-path-strip-heading">
      <div className="section-heading compact-heading">
        <div>
          <span className="eyebrow">Module path</span>
          <h2 id="module-path-strip-heading">Modules</h2>
        </div>
        <span className="step-count">{modules.length} modules</span>
      </div>
      <div className="module-phase-row" aria-label="Build modules">
        {modules.map((module) => (
          <button
            key={module.id}
            type="button"
            className={`module-phase status-${module.status} ${module.id === selectedModuleId ? 'is-selected' : ''}`}
            aria-pressed={module.id === selectedModuleId}
            onClick={() => onSelect(module.id)}
          >
            <span>{module.order}</span>
            <strong>{module.name}</strong>
            <small>Station: {module.station}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

function TechnicianStepReference({ step }) {
  const [mode, setMode] = useState('Text');
  const [source, setSource] = useState(procedure.assignedMentor);
  const [summary, setSummary] = useState('');
  const [sent, setSent] = useState(false);
  const note = (step.techniqueNotes || []).find((item) => item.named || item.endorsed) || step.techniqueNotes?.[0];
  const citationText = note?.citations
    ? `${note.citations.buildCount} builds / ${note.citations.customers.length} customers`
    : note?.appliedAcrossBuilds
      ? `${note.appliedAcrossBuilds} builds`
      : null;

  function submitCapture(event) {
    event.preventDefault();
    if (mode === 'Text' && !summary.trim()) return;
    setSent(true);
  }

  return (
    <section className="panel technician-reference-panel" aria-labelledby="step-reference-heading">
      <div className="section-heading compact-heading">
        <div>
          <span className="eyebrow">Step reference</span>
          <h2 id="step-reference-heading">Help for this step</h2>
        </div>
        <UserCheck size={20} aria-hidden="true" />
      </div>

      {note && (
        <article className="method-summary">
          <span>Validated method</span>
          <strong>{note.name || 'Approved technique'}</strong>
          <small>{citationText || 'Validated field note'}</small>
        </article>
      )}

      <details className="capture-disclosure">
        <summary>
          <FileText size={15} aria-hidden="true" />
          Capture senior note
        </summary>
        <form className="capture-form compact-capture-form" onSubmit={submitCapture}>
          <div className="capture-toggle" role="group" aria-label="Capture format">
            {['Text', 'Voice'].map((item) => (
              <button key={item} type="button" className={mode === item ? 'active' : ''} onClick={() => setMode(item)}>
                {item === 'Voice' ? <Mic size={15} aria-hidden="true" /> : <FileText size={15} aria-hidden="true" />}
                {item}
              </button>
            ))}
          </div>
          <label htmlFor="tech-reference-source">Source</label>
          <input id="tech-reference-source" value={source} onChange={(event) => setSource(event.target.value)} />
          {mode === 'Voice' ? (
            <div className="voice-reply-box">
              <Mic size={16} aria-hidden="true" />
              <span>Voice note ready</span>
            </div>
          ) : (
            <>
              <label htmlFor="tech-reference-note">Note</label>
              <textarea
                id="tech-reference-note"
                rows="3"
                value={summary}
                onChange={(event) => {
                  setSummary(event.target.value);
                  setSent(false);
                }}
                placeholder="Capture what the senior tech told you."
              />
            </>
          )}
          <button type="submit" className="primary-action" disabled={mode === 'Text' && !summary.trim()}>
            <Send size={15} aria-hidden="true" />
            Send for approval
          </button>
        </form>
      </details>
      {sent && <p className="sent-state">Waiting for {source} approval / Step {step.id}</p>}
    </section>
  );
}

function ModuleOverviewCard({ module, build }) {
  return (
    <section className="panel module-overview-card" aria-labelledby="module-overview-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{build.id} / Module {module.order}</span>
          <h2 id="module-overview-heading">{module.name}</h2>
          <p>{module.plm.spec}</p>
        </div>
        <StatusPill tone={module.status === 'active' ? 'blue' : module.status === 'blocked' ? 'red' : module.status === 'complete' ? 'green' : 'neutral'}>
          {module.status}
        </StatusPill>
      </div>
      {module.reusedFrom && (
        <div className="reuse-lineage">
          <strong>{module.reusedFrom.pct}% reused from {module.reusedFrom.buildId}</strong>
          <span>Authored by {module.reusedFrom.author}</span>
          <ul>{module.reusedFrom.changed.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      )}
    </section>
  );
}

function ModulePendingCard({ module }) {
  return (
    <section className="panel module-pending-card" aria-labelledby="module-pending-heading">
      <div className="section-heading compact-heading">
        <div>
          <span className="eyebrow">Module staged</span>
          <h2 id="module-pending-heading">{module.name}</h2>
          <p>Waiting on released floor steps.</p>
        </div>
        <StatusPill tone="neutral">{module.status}</StatusPill>
      </div>
    </section>
  );
}

function ModulePlmPanel({ module }) {
  return (
    <section className="panel plm-panel" aria-labelledby="plm-panel-heading">
      <div className="section-heading compact-heading">
        <div>
          <span className="eyebrow">PLM</span>
          <h2 id="plm-panel-heading">{module.plm.rev} / {module.plm.status}</h2>
        </div>
        <FileCheck2 size={20} aria-hidden="true" />
      </div>
      <div className="drawing-card">
        <span>Drawing</span>
        <strong>{module.plm.drawing}</strong>
      </div>
      <div className="plm-spec">
        <strong>Spec</strong>
        <p>{module.plm.spec}</p>
      </div>
      <details className="bom-disclosure">
        <summary>BOM / {module.plm.bom.length} items</summary>
        <div className="bom-list" aria-label="Module bill of materials">
          {module.plm.bom.map((item) => (
            <article key={item.part}>
              <span>{item.part}</span>
              <strong>Qty {item.qty}</strong>
            </article>
          ))}
        </div>
      </details>
    </section>
  );
}

function ModuleHowPanel({ step, module, onOpenProfile }) {
  return (
    <section className="panel module-how-panel" aria-labelledby="module-how-heading">
      <div className="section-heading compact-heading">
        <div>
          <span className="eyebrow">Senior method</span>
          <h2 id="module-how-heading">{module.master || procedure.assignedMentor}</h2>
        </div>
        <UserCheck size={20} aria-hidden="true" />
      </div>
      <p className="module-how-lead">Step {step.id}: {step.title}</p>
      <KnowledgeLayer step={step} onOpenProfile={onOpenProfile} compact />
    </section>
  );
}

function ModuleSequencePanel({ module, steps, onAddNote, onAskExpert, onSaveAnswerNote, onOpenProfile }) {
  const [selectedStepId, setSelectedStepId] = useState(steps.find((step) => step.status === 'active')?.id || steps[0]?.id || null);
  const selectedStep = steps.find((step) => step.id === selectedStepId) || steps[0];
  const visibleSteps = steps.filter((step) => ['complete', 'active', 'blocked'].includes(step.status));

  return (
    <section className="panel module-sequence-panel" aria-labelledby="module-sequence-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{module.name}</span>
          <h2 id="module-sequence-heading">Build sequence</h2>
        </div>
        <span className="step-count">{steps.length || 0} released steps</span>
      </div>
      {steps.length > 0 ? (
        <>
          <div className="path-list module-step-list" aria-label={`${module.name} steps`}>
            {(visibleSteps.length > 0 ? visibleSteps : steps).map((step) => (
              <button
                key={step.id}
                type="button"
                className={`path-step status-${step.status} ${selectedStep?.id === step.id ? 'is-selected' : ''}`}
                aria-pressed={selectedStep?.id === step.id}
                aria-describedby="selected-module-step-detail"
                onClick={() => setSelectedStepId(step.id)}
              >
                <div className="path-marker">
                  {step.status === 'complete' ? <CheckCircle2 size={17} aria-hidden="true" /> : step.id}
                </div>
                <div>
                  <div className="path-title-row">
                    <h3>{step.title}</h3>
                    <span className="station-badge">Station: {step.station}</span>
                  </div>
                  <p>{step.duration} / {step.owner}</p>
                </div>
                <StatusPill tone={step.status === 'active' ? 'blue' : step.status === 'blocked' ? 'red' : step.status === 'complete' ? 'green' : 'neutral'}>
                  {step.status}
                </StatusPill>
              </button>
            ))}
          </div>
          <StepDetailPanel
            step={selectedStep}
            onAddNote={onAddNote}
            onAskExpert={onAskExpert}
            onSaveAnswerNote={onSaveAnswerNote}
            onOpenProfile={onOpenProfile}
          />
        </>
      ) : (
        <div className="empty-module-state">
          <strong>Steps not released to the floor yet</strong>
          <p>Waiting on released floor steps.</p>
        </div>
      )}
    </section>
  );
}

function ShiftHandoffStrip({ step }) {
  const station = stationMeta[step.station] || {};
  const handoff = station.handoff || {
    fromCrew: 'Crew A',
    toCrew: 'Crew B',
    note: 'Pressure hold is stable; verify gauge cert before release.',
    leftAt: 'Current shift',
  };
  const [note, setNote] = useState(handoff.note);
  const [saved, setSaved] = useState(false);

  function saveHandoff(event) {
    event.preventDefault();
    if (!note.trim()) return;
    setSaved(true);
  }

  return (
    <section className="panel shift-handoff" aria-labelledby="handoff-heading">
      <div>
        <span className="eyebrow">{step.station} / Shift handoff</span>
        <h2 id="handoff-heading">{handoff.fromCrew} to {handoff.toCrew}</h2>
        <p>{handoff.note} <span>{handoff.leftAt}</span></p>
      </div>
      <form onSubmit={saveHandoff}>
        <label className="sr-only" htmlFor="handoff-note">Leave handoff note</label>
        <input
          id="handoff-note"
          value={note}
          onChange={(event) => {
            setNote(event.target.value);
            setSaved(false);
          }}
          aria-label="Shift handoff note"
        />
        <button type="submit" disabled={!note.trim()}>{saved ? 'Saved' : 'Leave note'}</button>
      </form>
    </section>
  );
}

function ConversationCaptureCard({ step }) {
  const [mode, setMode] = useState('Text');
  const [seniorTech, setSeniorTech] = useState('J. Martinez');
  const [summary, setSummary] = useState('J. Martinez said to check bypass valve position before replacing the flow sensor if the return line warms first.');
  const [sent, setSent] = useState(false);

  function submitCapture(event) {
    event.preventDefault();
    if (!summary.trim()) return;
    setSent(true);
  }

  return (
    <section className="panel conversation-capture-card" aria-labelledby="conversation-capture-heading">
      <div className="section-heading compact-heading">
        <div>
          <span className="eyebrow">Capture</span>
          <h2 id="conversation-capture-heading">Senior input</h2>
        </div>
        <Mic size={20} aria-hidden="true" />
      </div>
      <form className="capture-form" onSubmit={submitCapture}>
        <div className="capture-toggle" role="group" aria-label="Capture format">
          {['Text', 'Voice'].map((item) => (
            <button key={item} type="button" className={mode === item ? 'active' : ''} onClick={() => setMode(item)}>
              {item === 'Voice' ? <Mic size={16} aria-hidden="true" /> : <FileText size={16} aria-hidden="true" />}
              {item}
            </button>
          ))}
        </div>
        <label htmlFor="capture-senior">Source</label>
        <input id="capture-senior" value={seniorTech} onChange={(event) => setSeniorTech(event.target.value)} />
        <label htmlFor="capture-summary">Note</label>
        {mode === 'Voice' ? (
          <div className="voice-reply-box">
            <Mic size={18} aria-hidden="true" />
            <span>Voice note ready for {seniorTech}</span>
          </div>
        ) : (
          <textarea id="capture-summary" rows="4" value={summary} onChange={(event) => setSummary(event.target.value)} />
        )}
        <button type="submit" className="primary-action" disabled={mode === 'Text' && !summary.trim()}>
          <Send size={16} aria-hidden="true" />
          Send for approval
        </button>
      </form>
      {sent && <p className="sent-state">Waiting for {seniorTech} approval / Step {step.id}</p>}
    </section>
  );
}

function StandingOnShoulders({ onOpenProfile }) {
  const [used, setUsed] = useState(false);
  const citationCount = used ? 15 : 14;

  return (
    <section className="panel standing-card" aria-labelledby="standing-heading">
      <div className="section-heading compact-heading">
        <div>
          <span className="eyebrow">Legacy in this step</span>
          <h2 id="standing-heading">Standing on Thompson's method</h2>
        </div>
        <UserCheck size={20} aria-hidden="true" />
      </div>
      <p>This pressure step uses the <strong>Thompson Pressure-Ramp Method</strong>.</p>
      <div className="mini-stats">
        <span>{citationCount} builds</span>
        <span>3 customers</span>
        <span>9 technicians</span>
      </div>
      <div className="method-actions">
        <button
          type="button"
          className={`method-action method-primary${used ? ' is-cited' : ''}`}
          onClick={() => setUsed(true)}
          disabled={used}
        >
          {used ? 'Method cited' : 'Used this method'}
        </button>
        <button type="button" className="method-action method-secondary" onClick={() => onOpenProfile?.('R. Thompson')}>
          View body of work
        </button>
      </div>
      {used && <p className="sent-state" role="status">Citation added to R. Thompson's body of work.</p>}
    </section>
  );
}

function ReusableModuleCard({ module: selectedModule, onOpenProfile }) {
  const [moduleUsage, setModuleUsage] = useState(reusableModules[0].reuseCount);
  const [cited, setCited] = useState(false);
  const reusableModule = reusableModules.find((item) => item.station === selectedModule.station) || reusableModules[0];

  function citeModule() {
    if (cited) return;
    setModuleUsage((count) => count + 1);
    setCited(true);
  }

  return (
    <section className="panel module-card" aria-labelledby="module-heading">
      <div className="section-heading compact-heading">
        <div>
          <span className="eyebrow">Reuse</span>
          <h2 id="module-heading">{reusableModule.name}</h2>
        </div>
        <Database size={20} aria-hidden="true" />
      </div>
      <p>Reused on {moduleUsage} builds / {reusableModule.customers.length} customers</p>
      <div className="module-actions">
        <button type="button" className="method-action method-primary" onClick={citeModule} disabled={cited}>
          {cited ? 'Citation added' : 'Reuse module'}
        </button>
        <button type="button" className="method-action method-secondary" onClick={() => onOpenProfile?.(reusableModule.author)}>
          {reusableModule.author}
        </button>
      </div>
    </section>
  );
}

function CurrentStepCard({ step, module, onAddNote, onAskExpert, onSaveAnswerNote, onOpenProfile }) {
  const [evidenceSent, setEvidenceSent] = useState(false);
  const [checkedEvidence, setCheckedEvidence] = useState({});
  const evidenceItems = step.evidence || [];
  const dependencies = step.dependencies || ['Previous module step complete', 'Released PLM package matches build bay'];
  const evidenceReady = evidenceItems.length > 0 && evidenceItems.every((item) => checkedEvidence[item]);
  const guidance = step.guidance || 'Follow the released procedure. Do not advance if PLM revision, station handoff, or evidence does not match.';
  const [actionCopy, stopCopyRaw] = guidance.split(/\. Do not advance/i);
  const stopCopy = stopCopyRaw ? `Do not advance${stopCopyRaw}` : 'Do not advance if PLM revision, station handoff, or evidence does not match.';
  const shortTitle = step.title.replace(' at 150 percent rated pressure', '');
  const stepDetail = step.title === shortTitle ? step.station : `${step.station} / 150 percent rated pressure`;

  return (
    <section className="panel current-step" aria-labelledby="current-step-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Do now</span>
          <h2 id="current-step-heading">Step {step.id}: {shortTitle}</h2>
          <p className="station-line">{stepDetail}</p>
        </div>
        <StatusPill tone="blue">Active</StatusPill>
      </div>
      <div className="do-now-focus">
        <div>
          <span>Action</span>
          <p>{actionCopy}.</p>
        </div>
        <div>
          <span>Hold point</span>
          <p>{stopCopy}</p>
        </div>
      </div>
      <div className="do-now-body">
        <div className="do-now-list">
          <h3>Before advance</h3>
          {dependencies.map((item) => (
            <div key={item}>
              <CheckCircle2 size={15} aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <div className="do-now-list proof-list" aria-label="Evidence required">
          <h3>Required proof</h3>
          {evidenceItems.map((item) => (
            <button
              key={item}
              type="button"
              className={checkedEvidence[item] ? 'is-checked' : ''}
              aria-pressed={Boolean(checkedEvidence[item])}
              onClick={() => setCheckedEvidence((current) => ({ ...current, [item]: !current[item] }))}
            >
              <ClipboardCheck size={15} aria-hidden="true" /> {item}
            </button>
          ))}
        </div>
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
      <button type="button" className="secondary-action proof-action" onClick={() => setEvidenceSent(true)} disabled={!evidenceReady}>
        <CheckCircle2 size={18} aria-hidden="true" />
        {evidenceSent ? 'Proof attached' : evidenceReady ? 'Attach proof' : 'Select required proof'}
      </button>
      <button type="button" className="advance-action" disabled={!evidenceSent}>
        <CheckCircle2 size={19} aria-hidden="true" />
        {evidenceSent ? 'Complete step and advance' : 'Complete 3 checks to advance'}
      </button>
      {evidenceSent && <p className="sent-state" role="status">Sent to QA witness and senior tech.</p>}
    </section>
  );
}

function ProcedurePath({ steps, onAddNote, onAskExpert, onSaveAnswerNote, onOpenProfile }) {
  const [selectedStepId, setSelectedStepId] = useState(procedure.currentStep);
  const selectedStep = steps.find((step) => step.id === selectedStepId) || steps[0];
  const activeStep = steps.find((step) => step.status === 'active') || selectedStep;

  return (
    <section className="panel" aria-labelledby="path-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{procedure.id} / {procedure.revision}</span>
          <h2 id="path-heading">Workflow path</h2>
        </div>
        <span className="step-count">Step {procedure.currentStep} of {procedure.totalSteps}</span>
      </div>
      <StationPhaseContext step={activeStep} />
      <div className="path-list" aria-label="Procedure workflow steps">
        {steps.map((step) => (
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
              <div className="path-title-row">
                <h3>{step.title}</h3>
                <span className="station-badge">{step.station}</span>
              </div>
              <p>
                Module: {step.workstream} / {step.duration}
                {step.completedBy ? ` / built by ${step.completedBy}` : ''}
              </p>
            </div>
            <StatusPill tone={step.status === 'active' ? 'blue' : step.status === 'blocked' ? 'red' : step.status === 'complete' ? 'green' : 'neutral'}>
              {step.status}
            </StatusPill>
          </button>
        ))}
      </div>
      <StepDetailPanel
        step={selectedStep}
        onAddNote={onAddNote}
        onAskExpert={onAskExpert}
        onSaveAnswerNote={onSaveAnswerNote}
        onOpenProfile={onOpenProfile}
      />
    </section>
  );
}

function StationPhaseContext({ step }) {
  const station = stationMeta[step.station] || {};

  return (
    <div className="station-phase-context" aria-label="Active module and station">
      <div>
        <span>Current module</span>
        <strong>{step.workstream}</strong>
      </div>
      <div>
        <span>Active station</span>
        <strong>{step.station}</strong>
      </div>
      <div>
        <span>Station master</span>
        <strong>{station.master || 'Unassigned'} / {station.citations || 0} citations</strong>
      </div>
    </div>
  );
}

function StepDetailPanel({ step, onAddNote, onAskExpert, onSaveAnswerNote, onOpenProfile }) {
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
      {step.blocker && (
        <p className="step-detail-note blocker-detail">
          {step.identifiedBy ? `${step.identifiedBy} identified an issue: ` : ''}
          {step.blocker}
        </p>
      )}
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
          <strong>Legacy references</strong>
          <ul>
            {step.vaultRefs.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div>
          <strong>Station</strong>
          <ul>
            <li>{step.station}</li>
            <li>Master: {stationMeta[step.station]?.master || 'Unassigned'}</li>
            <li>{stationMeta[step.station]?.citations || 0} citations here</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function AskSeniorTechCard({ step, onAskExpert }) {
  const [question, setQuestion] = useState('Can I continue if the pressure chart is stable but the return line is warming?');
  const [sent, setSent] = useState(false);

  function submitQuestion(event) {
    event.preventDefault();
    if (!question.trim()) return;
    onAskExpert?.(step.id, question.trim());
    setSent(true);
    setQuestion('');
  }

  return (
    <section className="panel ask-senior-card" aria-labelledby="ask-senior-heading">
      <div className="section-heading compact-heading">
        <div>
          <span className="eyebrow">Step {step.id}</span>
          <h2 id="ask-senior-heading">Ask senior tech</h2>
        </div>
        <UserCheck size={20} aria-hidden="true" />
      </div>
      <form className="senior-ask-form" onSubmit={submitQuestion}>
        <label htmlFor="senior-tech-question" className="sr-only">Question for senior tech</label>
        <textarea
          id="senior-tech-question"
          rows="3"
          value={question}
          onChange={(event) => {
            setQuestion(event.target.value);
            setSent(false);
          }}
        />
        <button type="submit" disabled={!question.trim()}>
          <Send size={16} aria-hidden="true" />
          Send
        </button>
      </form>
      {sent && <p className="sent-state">Sent to {procedure.assignedMentor}</p>}
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

function SimilarResolvedBlockers() {
  return (
    <section className="panel similar-panel" aria-labelledby="similar-heading">
      <div className="section-heading compact-heading">
        <div>
          <span className="eyebrow">Past fixes</span>
          <h2 id="similar-heading">Similar resolved blockers</h2>
        </div>
        <Search size={18} aria-hidden="true" />
      </div>
      <div className="similar-list">
        {similarResolvedBlockers.map((item) => (
          <article key={item.id}>
            <div>
              <span className="eyebrow">{item.id} / {item.project}</span>
              <h3>{item.title}</h3>
              <p>{item.resolution}</p>
            </div>
            <div className="mini-stats">
              <span>{item.owner}</span>
              <span>{item.reused} reuses</span>
            </div>
          </article>
        ))}
      </div>
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
        <div><dt>Senior tech</dt><dd>{procedure.assignedMentor}</dd></div>
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

function AdvisorView({ steps, onEndorseNote, onAnswerQuestion }) {
  const [textEntries, setTextEntries] = useState([]);

  function handleSubmit(entry) {
    setTextEntries((current) => [
      {
        id: `TEXT-${String(current.length + 1).padStart(3, '0')}`,
        title: entry.title,
        type: entry.mode,
        detail: entry.detail,
        visibility: entry.visibility,
      },
      ...current,
    ]);
  }

  return (
    <>
      <PageHeader
        eyebrow="Senior Tech"
        title="Senior tech workspace"
      >
        <div className="header-metrics">
          <Metric value="3" label="Assigned recruits" />
          <Metric value={2 + textEntries.length} label="Approvals ready" tone="blue" />
        </div>
      </PageHeader>

      <section className="role-grid advisor-grid">
        <SeniorLegacyRecord />
        <div className="advisor-columns">
          <div className="advisor-column">
            <AdvisorCaptureForm onSubmit={handleSubmit} />
            <RecruitQueue />
          </div>
          <div className="advisor-column">
            <LegacyApprovalInbox />
            <AdvisorKnowledgeReview steps={steps} onEndorseNote={onEndorseNote} onAnswerQuestion={onAnswerQuestion} />
          </div>
        </div>
      </section>
    </>
  );
}

function SeniorLegacyRecord() {
  return (
    <section className="panel senior-legacy-record" aria-labelledby="senior-legacy-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Record</span>
          <h2 id="senior-legacy-heading">E. Falkowski</h2>
        </div>
        <StatusPill tone="blue">26 years</StatusPill>
      </div>
      <p className="legacy-record-line">31 citations across active HPU builds.</p>
      <div className="legacy-metric-row compact">
        <span>31 citations</span>
        <span>17 techs trained</span>
        <span>10 builds shaped</span>
        <span>2 named methods</span>
      </div>
    </section>
  );
}

function AdvisorKnowledgeReview({ steps, onEndorseNote, onAnswerQuestion }) {
  const [answeringId, setAnsweringId] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const pendingQuestions = steps.flatMap((step) =>
    (step.questions || [])
      .filter((question) => !question.answer)
      .map((question) => ({ step, question }))
  );
  const unendorsedNotes = steps.flatMap((step) =>
    (step.techniqueNotes || [])
      .filter((note) => !note.endorsed)
      .map((note) => ({ step, note }))
  );

  function submitAnswer(stepId, questionId) {
    if (!answerText.trim()) return;
    onAnswerQuestion(stepId, questionId, answerText.trim());
    setAnsweringId(null);
    setAnswerText('');
  }

  return (
    <section className="panel knowledge-review-panel" aria-labelledby="knowledge-review-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Questions</span>
          <h2 id="knowledge-review-heading">Answer recruits</h2>
        </div>
      </div>
      <div className="review-list">
        {pendingQuestions.map(({ step, question }) => (
          <article key={question.id}>
            <div>
              <span className="eyebrow">Step {step.id} / Asked by {question.askedBy}</span>
              <h3>{question.text}</h3>
              {answeringId === question.id ? (
                <div className="quick-entry embedded">
                  <textarea
                    value={answerText}
                    onChange={(event) => setAnswerText(event.target.value)}
                    placeholder="Answer with the stop condition, proof needed, and who signs off."
                    rows="2"
                  />
                  <button type="button" onClick={() => submitAnswer(step.id, question.id)} disabled={!answerText.trim()}>
                    Send answer
                  </button>
                </div>
              ) : null}
            </div>
            {answeringId === question.id ? null : (
              <button type="button" onClick={() => setAnsweringId(question.id)}>Answer</button>
            )}
          </article>
        ))}
        {unendorsedNotes.map(({ step, note }) => (
          <article key={note.id}>
            <div>
              <span className="eyebrow">Step {step.id} / {note.author}</span>
              <h3>{note.text}</h3>
            </div>
              <button type="button" onClick={() => onEndorseNote(step.id, note.id)}>Approve</button>
          </article>
        ))}
        {pendingQuestions.length === 0 && unendorsedNotes.length === 0 && (
          <p className="empty-state">No pending notes waiting for senior tech approval.</p>
        )}
      </div>
    </section>
  );
}

function AdvisorCaptureForm({ onSubmit }) {
  const [mode, setMode] = useState('Voice note');
  const [linkedStep, setLinkedStep] = useState('TSK-2024-047 / Step 24');
  const [title, setTitle] = useState('Pressure decay test acceptance cue');
  const [detail, setDetail] = useState('If the return line warms before pressure stabilizes, verify bypass valve position before replacing the transducer.');
  const [statusMessage, setStatusMessage] = useState('');

  function submitEntry(event, visibility = 'review') {
    event.preventDefault();
    if (!title.trim() || !detail.trim()) return;
    onSubmit({
      mode,
      title: title.trim(),
      detail: `${linkedStep.trim() || 'Unlinked'} - ${detail.trim()}`,
      visibility,
    });
    setStatusMessage(visibility === 'private' ? 'Private note kept in your workspace.' : 'Sent for approval.');
    setTitle('');
    setDetail('');
  }

  return (
    <section className="panel capture-console" aria-labelledby="capture-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Capture</span>
          <h2 id="capture-heading">Add field note</h2>
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
      <form className="capture-form" onSubmit={(event) => submitEntry(event, 'review')}>
        <label htmlFor="advisor-title">Subject</label>
        <input id="advisor-title" value={title} onChange={(event) => setTitle(event.target.value)} />
        <label htmlFor="advisor-step">Step / module</label>
        <input id="advisor-step" value={linkedStep} onChange={(event) => setLinkedStep(event.target.value)} />
        <label htmlFor="advisor-detail">Note</label>
        <textarea id="advisor-detail" rows="4" value={detail} onChange={(event) => setDetail(event.target.value)} />
        <div className="capture-actions">
          <button type="button" onClick={(event) => submitEntry(event, 'private')} disabled={!title.trim() || !detail.trim()}>
            Keep private
          </button>
          <button type="submit" className="primary-action" disabled={!title.trim() || !detail.trim()}>
            <Database size={17} aria-hidden="true" />
            Submit for approval
          </button>
        </div>
      </form>
      {statusMessage && <p className="sent-state" role="status">{statusMessage}</p>}
    </section>
  );
}

function LegacyApprovalInbox() {
  const [approved, setApproved] = useState(() =>
    Object.fromEntries(conversationCaptures.map((item) => [item.id, item.status.includes('Approved')]))
  );
  const [editingId, setEditingId] = useState(null);
  const [edits, setEdits] = useState(() =>
    Object.fromEntries(conversationCaptures.map((item) => [item.id, item.summary]))
  );
  const [reward, setReward] = useState('');

  return (
    <section className="panel advisor-question-panel" aria-labelledby="advisor-question-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Approval inbox</span>
          <h2 id="advisor-question-heading">Review captured notes</h2>
        </div>
      </div>
      {reward && <p className="approval-reward" role="status">{reward}</p>}
      <div className="question-queue">
        {conversationCaptures.map((item) => (
          <article key={item.id} className={approved[item.id] ? 'is-active' : ''}>
            <div className="risk-icon">
              <UserCheck size={17} aria-hidden="true" />
            </div>
            <div>
              <span className="eyebrow">{item.step} / {item.capturedBy} / {item.source}</span>
              <h3>{item.title}</h3>
              {editingId === item.id ? (
                <div className="approval-edit">
                  <label className="sr-only" htmlFor={`fix-${item.id}`}>Fix wording for {item.title}</label>
                  <textarea
                    id={`fix-${item.id}`}
                    rows="3"
                    value={edits[item.id]}
                    onChange={(event) => setEdits((current) => ({ ...current, [item.id]: event.target.value }))}
                  />
                </div>
              ) : (
                <p>{edits[item.id]}</p>
              )}
              <div className="mini-stats">
                <span>{item.seniorTech}</span>
                <span>{approved[item.id] ? 'Approved' : item.status}</span>
                <span>{approved[item.id] ? '+1 citation' : item.legacyEffect}</span>
              </div>
              <div className="approval-actions">
                <button
                  type="button"
                  className="approve-button"
                  onClick={() => {
                    setApproved((current) => ({ ...current, [item.id]: true }));
                    setEditingId(null);
                    setReward(`+1 citation added. ${item.capturedBy} is now trained on ${item.seniorTech}'s method.`);
                  }}
                >
                  {approved[item.id] ? 'Approved' : 'Approve'}
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setEditingId((current) => current === item.id ? null : item.id)}
                >
                  {editingId === item.id ? 'Done fixing' : 'Fix wording'}
                </button>
              </div>
            </div>
            <StatusPill tone={approved[item.id] ? 'green' : 'amber'}>{approved[item.id] ? 'Approved' : 'Review'}</StatusPill>
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
          <span className="eyebrow">Recruits</span>
          <h2 id="recruit-queue-heading">Assigned recruits</h2>
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
          <span className="eyebrow">Legacy record</span>
          <h2 id="draft-queue-heading">Ready to add to body of work</h2>
        </div>
      </div>
      <div className="draft-queue">
        {textEntries.map((entry) => (
          <article key={entry.id} className={`draft-row new-draft ${entry.visibility === 'private' ? 'private-draft' : ''}`}>
            <div>
              <span className="eyebrow">{entry.id} / {entry.type} / {entry.visibility === 'private' ? 'Private note' : 'Approval queue'}</span>
              <h3>{entry.title}</h3>
              <p>{entry.detail}</p>
            </div>
            <button type="button">{entry.visibility === 'private' ? 'Keep private' : 'Add to legacy'}</button>
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

function AdminView({ steps }) {
  const techniqueCount = steps.reduce((sum, step) => sum + (step.techniqueNotes || []).length, 0);
  const pendingQuestionCount = steps.reduce((sum, step) => sum + (step.questions || []).filter((question) => !question.answer).length, 0);
  const endorsedCount = steps.reduce((sum, step) => sum + (step.techniqueNotes || []).filter((note) => note.endorsed).length, 0);

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Build and legacy status"
      >
        <div className="header-metrics">
          <Metric value="47" label="Top citations" detail="R. Thompson" />
          <Metric value="23" label="Techs trained" detail="Top mentor reach" />
          <Metric value="3" label="Methods" detail="This quarter" />
        </div>
      </PageHeader>

      <section className="admin-layout">
        <div className="admin-hero">
          <ProjectStatusBoard steps={steps} />
        </div>
        <div className="admin-column admin-rail">
          <SystemHealthBoard />
          <AdminRiskBoard />
          <AdminAdoptionBoard />
        </div>
        <div className="admin-column admin-main">
          <AdvisorContributionBoard />
          <PendingLegacyBoard />
          <VaultHealthBoard steps={steps} />
          <RepeatQuestionBoard />
          <LegacyRecognitionBoard />
          <RetirementArtifactBoard />
        </div>
      </section>
    </>
  );
}

function RetirementArtifactBoard() {
  const record = retirementRecords[0];
  return (
    <section className="panel retirement-panel" aria-labelledby="retirement-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Retirement record</span>
          <h2 id="retirement-heading">{record.name}</h2>
        </div>
      </div>
      <p className="retirement-headline">{record.headline}</p>
      <div className="legacy-metric-row">
        {record.metrics.map((metric) => <span key={metric}>{metric}</span>)}
      </div>
      <ul className="legacy-highlight-list">
        {record.highlights.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}

function PendingLegacyBoard() {
  return (
    <section className="panel pending-legacy-panel" aria-labelledby="pending-legacy-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Approval queue</span>
          <h2 id="pending-legacy-heading">Pending captures</h2>
        </div>
      </div>
      <div className="draft-queue">
        {conversationCaptures.map((item) => (
          <article key={item.id} className="draft-row">
            <div>
              <span className="eyebrow">{item.step} / captured by {item.capturedBy}</span>
              <h3>{item.title}</h3>
              <p>{item.seniorTech} approval required / {item.legacyEffect}</p>
            </div>
            <StatusPill tone={item.status.includes('Approved') ? 'green' : 'amber'}>
              {item.status.includes('Approved') ? 'Approved' : 'Waiting'}
            </StatusPill>
          </article>
        ))}
      </div>
    </section>
  );
}

function LegacyRecognitionBoard() {
  const [recognitionAction, setRecognitionAction] = useState('');

  return (
    <section className="panel legacy-recognition-panel" aria-labelledby="legacy-recognition-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Recognition</span>
          <h2 id="legacy-recognition-heading">Recognition board</h2>
        </div>
      </div>
      <div className="recognition-grid">
        <RecognitionList title="Most-cited technicians" items={recognitionLeaders.technicians} />
        <RecognitionList title="Most-used techniques" items={recognitionLeaders.methods} />
        <RecognitionList title="Top mentors" items={recognitionLeaders.mentors} />
      </div>
      <div className="recognition-actions" aria-label="Leadership recognition actions">
        <button type="button" onClick={() => setRecognitionAction('R. Thompson added to weekly recognition.')}>
          Recognize
        </button>
        <button type="button" onClick={() => setRecognitionAction('Retirement artifact prepared for R. Thompson.')}>
          Prepare record
        </button>
        <button type="button" onClick={() => setRecognitionAction('Thompson Pressure-Ramp Method nominated for named technique review.')}>
          Nominate method
        </button>
      </div>
      {recognitionAction && <p className="sent-state" role="status">{recognitionAction}</p>}
      <div className="named-technique-row">
        {legacyTechniques.map((technique) => (
          <article key={technique.id}>
            <span className="eyebrow">{technique.step}</span>
            <h3>{technique.name}</h3>
            <p>{technique.impact}</p>
            <div className="mini-stats">
              <span>{technique.author}</span>
              <span>{technique.usedOn}</span>
              <span>{technique.technicians}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function RecognitionList({ title, items }) {
  return (
    <article>
      <h3>{title}</h3>
      {items.map((item) => (
        <div key={item.name}>
          <strong>{item.name}</strong>
          <span>{item.impact}</span>
          <p>{item.detail}</p>
        </div>
      ))}
    </article>
  );
}

function SystemHealthBoard() {
  return (
    <section className="panel system-health-board" aria-labelledby="system-health-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">System health</span>
          <h2 id="system-health-heading">Current load</h2>
        </div>
      </div>
      <div className="health-grid">
        {systemHealth.map((item) => (
          <article key={item.label} className={`health-${item.tone}`}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function AdminAdoptionBoard() {
  return (
    <section className="panel adoption-board" aria-labelledby="adoption-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Legacy loop</span>
          <h2 id="adoption-heading">Reuse signals</h2>
        </div>
      </div>
      <div className="adoption-grid">
        {adminAdoptionSignals.map((signal) => (
          <article key={signal.label}>
            <strong>{signal.value}</strong>
            <span>{signal.label}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function RepeatQuestionBoard() {
  return (
    <section className="panel repeat-board" aria-labelledby="repeat-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Procedure gaps</span>
          <h2 id="repeat-heading">Repeat questions</h2>
        </div>
      </div>
      <div className="repeat-list">
        {repeatQuestionSignals.map((item) => (
          <article key={item.module}>
            <div>
              <h3>{item.module}</h3>
              <p>{item.owner} / {item.action}</p>
            </div>
            <strong>{item.repeats}</strong>
          </article>
        ))}
      </div>
    </section>
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

function ProjectStatusBoard({ steps }) {
  const blockedStep = steps.find((step) => step.status === 'blocked');
  return (
    <section className="panel project-status-panel" aria-labelledby="project-status-heading">
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
              <p>
                {project.blocked && blockedStep?.identifiedBy
                  ? `${blockedStep.identifiedBy} identified an issue at Step ${blockedStep.id}`
                  : project.activeStep}
              </p>
              {project.legacy && <p className="legacy-project-line">{project.legacy}</p>}
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
    <section className="panel advisor-contribution-panel" aria-labelledby="advisor-contribution-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Expert recognition</span>
          <h2 id="advisor-contribution-heading">Senior tech contributions</h2>
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
            <p className="impact-line">{advisor.impact}</p>
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

function VaultHealthBoard({ steps }) {
  const validatedCount = useMemo(() => vaultEntries.filter((entry) => entry.status === 'Validated').length, []);
  const liveNotes = steps.flatMap((step) => (step.techniqueNotes || []).map((note) => ({ ...note, stepId: step.id, stepTitle: step.title })));

  return (
    <section className="panel vault-admin" aria-labelledby="vault-health-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Legacy record</span>
          <h2 id="vault-health-heading">Drafts and approved entries</h2>
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
          {liveNotes.slice(0, 3).map((item) => (
            <article key={item.id}>
              <div>
                <strong>Step {item.stepId}: {item.stepTitle}</strong>
                <span>{item.author} / {item.endorsed ? `endorsed by ${item.endorsedBy}` : 'needs endorsement'}</span>
              </div>
              <StatusPill tone={item.endorsed ? 'green' : 'amber'}>{item.endorsed ? 'verified' : 'review'}</StatusPill>
            </article>
          ))}
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
  const [steps, setSteps] = useState(technicianSteps);
  const [profileName, setProfileName] = useState(null);
  const activeLabel = views.find((view) => view.key === activeView)?.label || 'Technician';
  const activeProfile = technicianProfiles.find((profile) => profile.name === profileName);

  function updateStep(stepId, updater) {
    setSteps((current) => current.map((step) => step.id === stepId ? updater(step) : step));
  }

  function handleAddNote(stepId, text) {
    updateStep(stepId, (step) => ({
      ...step,
      techniqueNotes: [
        ...(step.techniqueNotes || []),
        {
          id: `TN-${stepId}-${Date.now()}`,
          author: procedure.assignedMentor,
          text,
          createdAt: 'Just now',
          endorsed: false,
          endorsedBy: null,
          appliedAcrossBuilds: 0,
        },
      ],
    }));
  }

  function handleAskExpert(stepId, text) {
    updateStep(stepId, (step) => ({
      ...step,
      questions: [
        ...(step.questions || []),
        {
          id: `Q-${stepId}-${Date.now()}`,
          askedBy: procedure.recruit,
          text,
          askedAt: 'Just now',
          answer: null,
        },
      ],
    }));
  }

  function handleEndorseNote(stepId, noteId) {
    updateStep(stepId, (step) => ({
      ...step,
      techniqueNotes: (step.techniqueNotes || []).map((note) =>
        note.id === noteId
          ? {
              ...note,
              endorsed: true,
              endorsedBy: 'S. Reyes',
              appliedAcrossBuilds: Math.max(note.appliedAcrossBuilds || 0, 1),
            }
          : note
      ),
    }));
  }

  function handleAnswerQuestion(stepId, questionId, text) {
    updateStep(stepId, (step) => ({
      ...step,
      questions: (step.questions || []).map((question) =>
        question.id === questionId
          ? {
              ...question,
              answer: {
                author: procedure.assignedMentor,
                text,
                answeredAt: 'Just now',
              },
            }
          : question
      ),
    }));
  }

  function handleSaveAnswerNote(stepId, questionId) {
    updateStep(stepId, (step) => {
      const question = (step.questions || []).find((item) => item.id === questionId);
      if (!question?.answer || question.savedAsNote) return step;
      return {
        ...step,
        techniqueNotes: [
          ...(step.techniqueNotes || []),
          {
            id: `TN-ANSWER-${stepId}-${Date.now()}`,
            author: question.answer.author,
            text: question.answer.text,
            createdAt: 'Saved from answer',
            endorsed: false,
            endorsedBy: null,
            appliedAcrossBuilds: 0,
            sourceQuestion: question.text,
          },
        ],
        questions: (step.questions || []).map((item) =>
          item.id === questionId ? { ...item, savedAsNote: true } : item
        ),
      };
    });
  }

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <ShellHeader activeView={activeView} setActiveView={setActiveView} />
      <main id="main-content" className={`view-${activeView}`} tabIndex="-1" aria-label={`${activeLabel} workspace`}>
        {activeView === 'technician' && (
          <TechnicianView
            steps={steps}
            onAddNote={handleAddNote}
            onAskExpert={handleAskExpert}
            onSaveAnswerNote={handleSaveAnswerNote}
            onOpenProfile={setProfileName}
          />
        )}
        {activeView === 'advisor' && (
          <AdvisorView
            steps={steps}
            onEndorseNote={handleEndorseNote}
            onAnswerQuestion={handleAnswerQuestion}
          />
        )}
        {activeView === 'admin' && <AdminView steps={steps} />}
      </main>
      <ProfileModal profile={activeProfile} onClose={() => setProfileName(null)} />
    </div>
  );
}
