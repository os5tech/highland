import { timeSubmitterMetrics } from "@/app/_data/dashboard";
import { MetricsSection } from "./MetricsSection";
import { PerspectiveLink } from "./PerspectiveLink";

export function TimeSubmitterDashboard() {
  return (
    <>
      <MetricsSection cards={timeSubmitterMetrics} label="Time intake status" />

      <section className="panel time-entry-panel" id="time-intake">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Step 1</p>
            <h2>Submit Time</h2>
          </div>
          <span>Time intake</span>
        </div>

        <div className="time-entry-placeholder">
          <div>
            <h3>Enter hours for a project, job bucket, or cost code.</h3>
            <p>
              This workspace will capture date, job bucket, hours, and notes, then route submitted time through validation and PM approval.
            </p>
          </div>
          <PerspectiveLink className="time-entry-primary-action" href="/timesheet">Start time entry</PerspectiveLink>
        </div>
      </section>
    </>
  );
}
