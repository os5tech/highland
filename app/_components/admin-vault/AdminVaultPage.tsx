import { adminControls } from "@/app/_data/dashboard";
import { DashboardHero } from "@/app/_components/dashboard/DashboardHero";
import { DashboardSidebar } from "@/app/_components/dashboard/DashboardSidebar";
import type { DashboardSecurityContext } from "@/src/server/controllers/dashboardController";

type AdminVaultPageProps = {
  security: DashboardSecurityContext;
};

const vaultGroups = [
  {
    title: "Branding",
    detail: "Company logos, report headers, outbound email identity, and PDF package presentation.",
    state: "Ready for configuration",
  },
  {
    title: "Integration Secrets",
    detail: "Microsoft Graph, ADP, QuickBooks, Procore, Twilio, OpenAI, signing, and storage credentials.",
    state: "Use Secret Manager",
  },
  {
    title: "Access Controls",
    detail: "Role policy, admin bootstrap users, approval gates, and emergency lockout controls.",
    state: "Restricted",
  },
];

export function AdminVaultPage({ security }: AdminVaultPageProps) {
  return (
    <main className="app-shell">
      <DashboardSidebar activeHref="/admin-vault" canAccessAdminVault={security.permissions.canAccessAdminVault} />

      <section className="workspace admin-vault-workspace">
        <DashboardHero security={security} />

        <section className="panel admin-panel admin-vault-page">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Restricted Admin</p>
              <h2>Admin Vault</h2>
            </div>
            <span>Admin only</span>
          </div>

          <div className="vault-summary">
            <div>
              <p>Access decision</p>
              <strong>Allowed</strong>
            </div>
            <a className="vault-back-link" href="/">Return to dashboard</a>
          </div>

          <div className="admin-vault-grid">
            {vaultGroups.map((group) => (
              <article className="admin-vault-card" key={group.title}>
                <p>{group.state}</p>
                <h3>{group.title}</h3>
                <span>{group.detail}</span>
              </article>
            ))}
          </div>

          <div className="admin-list">
            {adminControls.map(([name, detail, state]) => (
              <div className="admin-row" key={name}>
                <div>
                  <h3>{name}</h3>
                  <p>{detail}</p>
                </div>
                <span>{state}</span>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
