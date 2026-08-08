import { integrations } from "@/app/_data/dashboard";

export function IntegrationSection() {
  return (
    <section className="panel integration-panel" id="integrations">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Connected Systems</p>
          <h2>Integration Cockpit</h2>
        </div>
        <span>API-first</span>
      </div>
      <div className="integration-grid">
        {integrations.map(([name, detail, phase]) => (
          <article className="integration-card" key={name}>
            <div>
              <h3>{name}</h3>
              <p>{detail}</p>
            </div>
            <span>{phase}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
