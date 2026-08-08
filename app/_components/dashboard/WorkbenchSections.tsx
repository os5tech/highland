import { approvalRows, intakeRows } from "@/app/_data/dashboard";

export function WorkbenchSections() {
  return (
    <section className="module-grid">
      <article className="panel" id="time-intake">
        <div className="panel-header">
          <div>
            <p className="eyebrow">MVP Workbench</p>
            <h2>Time Intake</h2>
          </div>
          <span>US-001 - US-003</span>
        </div>
        <div className="feature-list">
          {intakeRows.map(([id, title, owner, detail]) => (
            <div className="feature-row" key={id}>
              <code>{id}</code>
              <div>
                <h3>{title}</h3>
                <p><b>{owner}</b> - {detail}</p>
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="panel" id="pm-approval">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Approval Control</p>
            <h2>PM Review Queue</h2>
          </div>
          <span>Snapshot signed</span>
        </div>
        <div className="feature-list">
          {approvalRows.map(([id, title, owner, detail]) => (
            <div className="feature-row" key={id}>
              <code>{id}</code>
              <div>
                <h3>{title}</h3>
                <p><b>{owner}</b> - {detail}</p>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
