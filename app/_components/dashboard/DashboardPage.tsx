import type { DashboardSecurityContext } from "@/src/server/controllers/dashboardController";
import type { SystemDiagnostics } from "@/src/server/controllers/systemDiagnosticsController";
import { AgentsSection } from "./AgentsSection";
import { DashboardHero } from "./DashboardHero";
import { DashboardSidebar } from "./DashboardSidebar";
import { DiagnosticsSection } from "./DiagnosticsSection";
import { JobCostingSection } from "./JobCostingSection";
import { MetricsSection } from "./MetricsSection";
import { ProjectManagerDashboard } from "./ProjectManagerDashboard";
import { TimeSubmitterDashboard } from "./TimeSubmitterDashboard";
import { WorkbenchSections } from "./WorkbenchSections";
import { WorkflowSection } from "./WorkflowSection";

type DashboardPageProps = {
  diagnostics: SystemDiagnostics;
  security: DashboardSecurityContext;
};

export function DashboardPage({ diagnostics, security }: DashboardPageProps) {
  const isTimeSubmitter = security.permissions.showsTimeSubmitterDashboard;
  const isProjectManager = security.permissions.showsPmApprovalDashboard;

  return (
    <main className="app-shell">
      <DashboardSidebar
        canAccessAdminVault={security.permissions.canAccessAdminVault}
        mode={isTimeSubmitter ? "time-submit" : isProjectManager ? "pm-review" : "operations"}
      />

      <section className="workspace" id="dashboard">
        <DashboardHero security={security} />
        {isTimeSubmitter ? (
          <TimeSubmitterDashboard />
        ) : isProjectManager ? (
          <ProjectManagerDashboard />
        ) : (
          <>
            <MetricsSection />
            <WorkflowSection />
            <WorkbenchSections />
            <JobCostingSection />
            <AgentsSection />
            <DiagnosticsSection diagnostics={diagnostics} />
          </>
        )}
      </section>
    </main>
  );
}
