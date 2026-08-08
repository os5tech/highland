import type { DashboardSecurityContext } from "@/src/server/controllers/dashboardController";
import type { SystemDiagnostics } from "@/src/server/controllers/systemDiagnosticsController";
import { AgentsSection } from "./AgentsSection";
import { DashboardHero } from "./DashboardHero";
import { DashboardSidebar } from "./DashboardSidebar";
import { DiagnosticsSection } from "./DiagnosticsSection";
import { IntegrationSection } from "./IntegrationSection";
import { JobCostingSection } from "./JobCostingSection";
import { MetricsSection } from "./MetricsSection";
import { WorkbenchSections } from "./WorkbenchSections";
import { WorkflowSection } from "./WorkflowSection";

type DashboardPageProps = {
  diagnostics: SystemDiagnostics;
  security: DashboardSecurityContext;
};

export function DashboardPage({ diagnostics, security }: DashboardPageProps) {
  return (
    <main className="app-shell">
      <DashboardSidebar canAccessAdminVault={security.permissions.canAccessAdminVault} />

      <section className="workspace" id="command">
        <DashboardHero security={security} />
        <MetricsSection />
        <WorkflowSection />
        <WorkbenchSections />
        <JobCostingSection />
        <IntegrationSection />
        <AgentsSection />
        <DiagnosticsSection diagnostics={diagnostics} />
      </section>
    </main>
  );
}
