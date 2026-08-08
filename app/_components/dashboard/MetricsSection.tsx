import { metrics } from "@/app/_data/dashboard";

export function MetricsSection() {
  return (
    <section className="metrics" aria-label="Payroll status">
      {metrics.map((card) => (
        <article className="card metric-card" key={card.label}>
          <h2>{card.label}</h2>
          <strong>{card.value}</strong>
          <p>{card.detail}</p>
          <button type="button">{card.action}</button>
        </article>
      ))}
    </section>
  );
}
