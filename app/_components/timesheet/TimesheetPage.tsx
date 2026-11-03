import { DashboardHero } from "@/app/_components/dashboard/DashboardHero";
import { DashboardSidebar } from "@/app/_components/dashboard/DashboardSidebar";
import type { DashboardSecurityContext } from "@/src/server/controllers/dashboardController";
import { getCurrentSemiMonthlyPayPeriod } from "@/src/server/runtime/pay-period";

type TimesheetPageProps = {
  security: DashboardSecurityContext;
};

const weekRows = [
  ["Mon", "Aug 10", "0.0"],
  ["Tue", "Aug 11", "0.0"],
  ["Wed", "Aug 12", "0.0"],
  ["Thu", "Aug 13", "0.0"],
  ["Fri", "Aug 14", "0.0"],
  ["Sat", "Aug 15", "0.0"],
  ["Sun", "Aug 16", "0.0"],
];

export function TimesheetPage({ security }: TimesheetPageProps) {
  const payPeriod = getCurrentSemiMonthlyPayPeriod();
  const isTimeSubmitter = security.permissions.showsTimeSubmitterDashboard;

  return (
    <main className="app-shell">
      <DashboardSidebar
        activeHref="/timesheet"
        canAccessAdminVault={security.permissions.canAccessAdminVault}
        mode={isTimeSubmitter ? "time-submit" : "operations"}
      />

      <section className="workspace timesheet-workspace">
        <DashboardHero security={security} />

        <section className="panel timesheet-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Current Period</p>
              <h2>Timesheet</h2>
            </div>
            <span>{payPeriod.periodLabel}</span>
          </div>

          <div className="timesheet-layout">
            <div className="timesheet-entry-card" aria-label="Enter time">
              <div>
                <h3>Add Time</h3>
                <p>{payPeriod.rangeLabel}</p>
              </div>

              <form className="timesheet-form">
                <label>
                  Work date
                  <input type="date" />
                </label>
                <label>
                  Job bucket
                  <select defaultValue="">
                    <option value="" disabled>Select job or bucket</option>
                    <option>Project labor</option>
                    <option>General Conditions</option>
                    <option>General Admin</option>
                    <option>Business Development</option>
                  </select>
                </label>
                <label>
                  Cost code
                  <select defaultValue="">
                    <option value="" disabled>Select cost code</option>
                    <option>Direct labor</option>
                    <option>Equipment support</option>
                    <option>Supervision</option>
                  </select>
                </label>
                <label>
                  Hours
                  <input min="0" step="0.25" type="number" />
                </label>
                <label className="timesheet-notes-field">
                  Notes
                  <textarea placeholder="Optional detail for the PM or payroll team" rows={4} />
                </label>
                <button type="button">Save time entry</button>
              </form>
            </div>

            <aside className="timesheet-summary-card" aria-label="Current week summary">
              <div>
                <p className="eyebrow">This Week</p>
                <h3>0.0 hours</h3>
                <span>No submitted time yet.</span>
              </div>

              <div className="timesheet-week-list">
                {weekRows.map(([day, date, hours]) => (
                  <div key={`${day}-${date}`}>
                    <span>{day}</span>
                    <b>{date}</b>
                    <strong>{hours}</strong>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </section>
    </main>
  );
}
