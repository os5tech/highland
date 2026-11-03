import { metrics } from "@/app/_data/dashboard";
import { PerspectiveLink } from "./PerspectiveLink";

type MetricCard = {
  label: string;
  value: string;
  detail: string;
  action: string;
  actionHref?: string;
};

type MetricsSectionProps = {
  cards?: MetricCard[];
  label?: string;
};

export function MetricsSection({ cards = metrics, label = "Payroll status" }: MetricsSectionProps) {
  return (
    <section className="metrics" aria-label={label}>
      {cards.map((card) => (
        <article className="card metric-card" key={card.label}>
          <h2>{card.label}</h2>
          <strong>{card.value}</strong>
          <p>{card.detail}</p>
          {card.actionHref ? (
            <PerspectiveLink className="metric-action-link" href={card.actionHref}>{card.action}</PerspectiveLink>
          ) : (
            <button type="button">{card.action}</button>
          )}
        </article>
      ))}
    </section>
  );
}
