import { ProfileMenu } from "@/app/ProfileMenu";
import type { DashboardSecurityContext } from "@/src/server/controllers/dashboardController";
import { getRuntimeEnvironmentLabel } from "@/src/server/runtime/environment";
import { getCurrentSemiMonthlyPayPeriod } from "@/src/server/runtime/pay-period";

type DashboardHeroProps = {
  security: DashboardSecurityContext;
};

export function DashboardHero({ security }: DashboardHeroProps) {
  const environmentLabel = getRuntimeEnvironmentLabel();
  const payPeriod = getCurrentSemiMonthlyPayPeriod();

  return (
    <header className="topbar hero">
      <div>
        <p className="eyebrow">Highland</p>
        <h1>Virtual Patrick</h1>
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
          <b>{payPeriod.periodLabel}</b>
          <span>{payPeriod.rangeLabel}</span>
        </div>
        <small>{payPeriod.cutoffLabel}</small>
      </div>
    </header>
  );
}
