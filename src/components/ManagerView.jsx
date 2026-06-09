import { colors, fonts } from '../styles/tokens.js';
import KPIBar from './KPIBar.jsx';
import ProjectCard from './ProjectCard.jsx';
import BlockedItemsPanel from './BlockedItemsPanel.jsx';
import ApprovalsPanel from './ApprovalsPanel.jsx';
import AIInsightsPanel from './AIInsightsPanel.jsx';
import KnowledgeVaultPanel from './KnowledgeVaultPanel.jsx';

export default function ManagerView({ projects, pendingApprovals, knowledgeVault, onSelectProject, onApprove }) {
  return (
    <div style={{ maxWidth: 1160, margin: '0 auto', padding: '28px 24px' }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: colors.textPrimary, letterSpacing: -0.3 }}>
            Active Projects
          </h1>
          <p style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>
            Real-time build status across all active test stand programs
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: fonts.mono,
            fontSize: 10,
            color: '#177040',
            background: colors.greenLight,
            border: `1px solid #C3E6D2`,
            borderRadius: 5,
            padding: '5px 10px',
            fontWeight: 700,
          }}>
            <span style={{ fontSize: 9 }}>●</span>
            Epicor ERP · Synced {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div style={{
            fontFamily: fonts.mono,
            fontSize: 11,
            color: colors.textMuted,
            background: colors.white,
            border: `1px solid ${colors.border}`,
            borderRadius: 5,
            padding: '5px 12px',
          }}>
            {projects.length} programs · {projects.reduce((acc, p) => {
              let t = 0; p.phases.forEach(ph => ph.steps.forEach(s => { if (s.status === 'active') t++; })); return acc + t;
            }, 0)} active steps
          </div>
        </div>
      </div>

      {/* KPI bar */}
      <KPIBar projects={projects} pendingApprovals={pendingApprovals} vaultCount={knowledgeVault ? knowledgeVault.length : 0} />

      {/* AI Fleet Insights */}
      <AIInsightsPanel projects={projects} />

      {/* Knowledge Vault */}
      <KnowledgeVaultPanel vault={knowledgeVault} />

      {/* Blocked items (only if any) */}
      <BlockedItemsPanel projects={projects} />

      {/* Project cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
        gap: 16,
        marginBottom: 0,
      }}>
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelect={onSelectProject}
          />
        ))}
      </div>

      {/* Approvals panel */}
      <ApprovalsPanel
        pendingApprovals={pendingApprovals}
        projects={projects}
        onApprove={onApprove}
      />
    </div>
  );
}
