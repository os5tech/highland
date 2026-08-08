import { allocationRows, roles } from "@/app/_data/dashboard";

export function JobCostingSection() {
  return (
    <section className="main-grid">
      <article className="panel" id="job-costing">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Labor Worksheet Replacement</p>
            <h2>Job-Cost Allocation Engine</h2>
          </div>
          <span>Reconciled before post</span>
        </div>
        <div className="allocation-grid">
          {allocationRows.map(([title, detail]) => (
            <div className="allocation-card" key={title}>
              <h3>{title}</h3>
              <p>{detail}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="panel role-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Security Model</p>
            <h2>Role-Based Workflows</h2>
          </div>
          <span>Least privilege</span>
        </div>
        <div className="role-list">
          {roles.map(([role, detail]) => (
            <div className="role-row" key={role}>
              <h3>{role}</h3>
              <p>{detail}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
