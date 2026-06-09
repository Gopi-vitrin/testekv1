import { useReducer } from 'react';
import { initialState } from './data/initialState.js';
import NavBar from './components/NavBar.jsx';
import AdminView from './components/AdminView.jsx';
import AdvisorView from './components/AdvisorView.jsx';
import TechnicianView from './components/TechnicianView.jsx';

function reducer(state, action) {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, activeView: action.view };

    case 'SET_TECHNICIAN_PROJECT':
      return { ...state, activeTechnicianProject: action.projectId, activeView: 'technician' };

    case 'SAVE_SHIFT_NOTES':
      return { ...state, shiftNotes: action.notes };

    case 'ADD_VAULT_ENTRY': {
      const entry = {
        ...action.entry,
        id: `kv-${Date.now()}`,
        capturedAt: new Date().toISOString(),
        citations: 0,
      };
      return { ...state, knowledgeVault: [entry, ...state.knowledgeVault] };
    }

    case 'COMPLETE_STEP': {
      const { projectId, stepId, note, vaultEntry } = action;
      const now = new Date().toISOString();
      let newPendingApprovals = [...state.pendingApprovals];

      const projects = state.projects.map(project => {
        if (project.id !== projectId) return project;

        const phases = project.phases.map(phase => {
          const stepIdx = phase.steps.findIndex(s => s.id === stepId);
          if (stepIdx === -1) return phase;

          const step = phase.steps[stepIdx];
          const isPhaseGate = step.isPhaseGate;
          let newStatus = 'complete';
          let phaseStatus = phase.status;

          if (isPhaseGate) {
            newStatus = 'awaiting-signoff';
            phaseStatus = 'awaiting-signoff';
            const alreadyPending = newPendingApprovals.some(
              a => a.projectId === projectId && a.phaseId === phase.id
            );
            if (!alreadyPending) {
              newPendingApprovals.push({
                projectId,
                phaseId: phase.id,
                phaseName: phase.name,
                submittedBy: phase.assignedTo,
                submittedAt: now,
              });
            }
          } else {
            phaseStatus = 'active';
          }

          const updatedSteps = phase.steps.map((s, idx) => {
            if (s.id === stepId) return { ...s, status: newStatus, completedAt: now, note: note || null };
            if (!isPhaseGate && idx === stepIdx + 1 && s.status === 'locked') return { ...s, status: 'active' };
            return s;
          });

          return { ...phase, status: phaseStatus, steps: updatedSteps };
        });

        return { ...project, phases };
      });

      let knowledgeVault = state.knowledgeVault;
      if (vaultEntry) {
        knowledgeVault = [
          { ...vaultEntry, id: `kv-${Date.now()}`, capturedAt: now, citations: 0 },
          ...knowledgeVault,
        ];
      }

      return { ...state, projects, pendingApprovals: newPendingApprovals, knowledgeVault };
    }

    case 'FLAG_STEP': {
      const { projectId, stepId, blockReason, blockerCategory } = action;
      const now = new Date().toISOString();
      const projects = state.projects.map(project => {
        if (project.id !== projectId) return project;
        const phases = project.phases.map(phase => ({
          ...phase,
          steps: phase.steps.map(s =>
            s.id === stepId
              ? { ...s, status: 'blocked', blockReason, blockerCategory: blockerCategory || null, blockedAt: now }
              : s
          ),
        }));
        return { ...project, phases };
      });
      return { ...state, projects };
    }

    case 'RESOLVE_BLOCK': {
      const { projectId, stepId } = action;
      const projects = state.projects.map(project => {
        if (project.id !== projectId) return project;
        const phases = project.phases.map(phase => ({
          ...phase,
          steps: phase.steps.map(s =>
            s.id === stepId
              ? { ...s, status: 'active', blockReason: null, blockerCategory: null, blockedAt: null }
              : s
          ),
        }));
        return { ...project, phases };
      });
      return { ...state, projects };
    }

    case 'APPROVE_PHASE': {
      const { projectId, phaseId } = action;
      const now = new Date().toISOString();
      const projects = state.projects.map(project => {
        if (project.id !== projectId) return project;
        const phases = project.phases.map(phase => {
          if (phase.id === phaseId) {
            const steps = phase.steps.map(s =>
              s.status === 'awaiting-signoff' ? { ...s, status: 'complete', completedAt: s.completedAt || now } : s
            );
            return { ...phase, status: 'complete', steps };
          }
          if (phase.id === phaseId + 1 && phase.status === 'locked') {
            const steps = phase.steps.map((s, i) => i === 0 ? { ...s, status: 'active' } : s);
            return { ...phase, status: 'active', steps };
          }
          return phase;
        });
        return { ...project, phases };
      });
      const pendingApprovals = state.pendingApprovals.filter(
        a => !(a.projectId === projectId && a.phaseId === phaseId)
      );
      return { ...state, projects, pendingApprovals };
    }

    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div style={{ minHeight: '100vh', background: '#F4F6F9' }}>
      <NavBar
        activeView={state.activeView}
        onViewChange={view => dispatch({ type: 'SET_VIEW', view })}
      />

      {state.activeView === 'admin' && (
        <AdminView
          projects={state.projects}
          pendingApprovals={state.pendingApprovals}
          knowledgeVault={state.knowledgeVault}
          onSelectProject={projectId => dispatch({ type: 'SET_TECHNICIAN_PROJECT', projectId })}
          onApprove={(projectId, phaseId) => dispatch({ type: 'APPROVE_PHASE', projectId, phaseId })}
        />
      )}

      {state.activeView === 'advisor' && (
        <AdvisorView
          projects={state.projects}
          knowledgeVault={state.knowledgeVault}
          onAddVaultEntry={entry => dispatch({ type: 'ADD_VAULT_ENTRY', entry })}
        />
      )}

      {state.activeView === 'technician' && (
        <TechnicianView
          projects={state.projects}
          activeProjectId={state.activeTechnicianProject}
          knowledgeVault={state.knowledgeVault}
          onSelectProject={projectId => dispatch({ type: 'SET_TECHNICIAN_PROJECT', projectId })}
          onComplete={(projectId, stepId, note, vaultEntry) =>
            dispatch({ type: 'COMPLETE_STEP', projectId, stepId, note, vaultEntry })
          }
          onFlag={(projectId, stepId, blockReason, blockerCategory) =>
            dispatch({ type: 'FLAG_STEP', projectId, stepId, blockReason, blockerCategory })
          }
          onResolve={(projectId, stepId) => dispatch({ type: 'RESOLVE_BLOCK', projectId, stepId })}
          shiftNotes={state.shiftNotes}
          onSaveNotes={notes => dispatch({ type: 'SAVE_SHIFT_NOTES', notes })}
        />
      )}
    </div>
  );
}
