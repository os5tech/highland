import { adminControls, agents } from "@/app/_data/dashboard";
import type { DashboardSecurityContext } from "@/src/server/controllers/dashboardController";

type AdminAndAgentsSectionProps = {
  security: DashboardSecurityContext;
};

export function AdminAndAgentsSection({ security }: AdminAndAgentsSectionProps) {
  return (
    <section className="main-grid">
      <article className="panel" id="ai-agents">
        <div className="panel-header">
          <div>
            <p className="eyebrow">AI With Guardrails</p>
            <h2>Agent Console</h2>
          </div>
          <span>No posting authority</span>
        </div>
        <div className="feature-list">
          {agents.map(([name, detail, gate]) => (
            <div className="feature-row agent-row" key={name}>
              <code>AI</code>
              <div>
                <h3>{name}</h3>
                <p>{detail}</p>
                <small>{gate}</small>
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="panel admin-panel" id="admin-vault">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Restricted Admin</p>
            <h2>Admin Vault</h2>
          </div>
          <span>Owner approval</span>
        </div>

        <div className="vault-summary">
          <div>
            <p>Secret posture</p>
            <strong>Encrypted + masked</strong>
          </div>
          <button type="button">Open vault</button>
        </div>

        <div className="admin-list">
          <div className="admin-row">
            <div>
              <h3>Access Decision</h3>
              <p>{security.permissions.canAccessAdminVault ? "Current role can access vault controls." : "Current role can view status only; vault changes require CFO or OS5 admin."}</p>
            </div>
            <span>{security.permissions.canAccessAdminVault ? "Allowed" : "Read only"}</span>
          </div>
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
      </article>
    </section>
  );
}
