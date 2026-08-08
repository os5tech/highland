import { workflowSteps } from "@/app/_data/dashboard";

export function WorkflowSection() {
  return (
    <section className="panel workflow-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Target Workflow</p>
          <h2>Timesheet to Payroll to QuickBooks</h2>
        </div>
        <span>Human approved</span>
      </div>
      <div className="workflow-rail">
        {workflowSteps.map(([number, title, detail]) => (
          <article className="workflow-step" key={number}>
            <b>{number}</b>
            <h3>{title}</h3>
            <p>{detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
