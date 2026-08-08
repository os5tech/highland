import type { SystemDiagnostics } from "@/src/server/controllers/systemDiagnosticsController";

type DiagnosticsSectionProps = {
  diagnostics: SystemDiagnostics;
};

export function DiagnosticsSection({ diagnostics }: DiagnosticsSectionProps) {
  return (
    <section className="panel diagnostics" aria-label="Diagnostics">
      <div>
        <h2>Environment Diagnostics</h2>
        <p>
          Runtime config: {diagnostics.runtime.configured} of {diagnostics.runtime.required} required values set. Database: {diagnostics.database.message}
        </p>
        {diagnostics.runtime.missing.length > 0 ? (
          <p className="diagnostic-warning">Missing runtime values: {diagnostics.runtime.missing.join(", ")}</p>
        ) : null}
        {diagnostics.database.missingTables.length > 0 ? (
          <p className="diagnostic-warning">Missing tables: {diagnostics.database.missingTables.join(", ")}</p>
        ) : null}
      </div>
      <strong>{diagnostics.database.status}</strong>
    </section>
  );
}
