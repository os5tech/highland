import { agents } from "@/app/_data/dashboard";

export function AgentsSection() {
  return (
    <section className="panel" id="ai-agents">
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
    </section>
  );
}
