import { ProfileMenu } from "@/app/ProfileMenu";
import type { DashboardSecurityContext } from "@/src/server/controllers/dashboardController";
import { getRuntimeEnvironmentLabel } from "@/src/server/runtime/environment";

type DashboardHeroProps = {
  security: DashboardSecurityContext;
};

export function DashboardHero({ security }: DashboardHeroProps) {
  const environmentLabel = getRuntimeEnvironmentLabel();

  return (
    <header className="topbar hero">
      <div>
        <p className="eyebrow">Highland Construction / OS5</p>
        <h1>Virtual Time PM</h1>
        <p className="lede">
          A controlled payroll and job-costing assistant for time capture, PM approvals, ADP reconciliation, labor allocation, QuickBooks export, and audit-ready payroll packages.
        </p>
      </div>
      <div className="status-stack">
        <div className="topbar-actions">
          <div className="status-pill"><span />{environmentLabel}</div>
          <ProfileMenu profile={security.profile} />
        </div>
        <div className="identity-card">
          <b>{security.user.name}</b>
          <span>{security.user.roles.join(", ").replaceAll("_", " ")}</span>
        </div>
        <small>24 semi-monthly pay periods per year</small>
      </div>
    </header>
  );
}
