import { getPgPool } from "@/db";

const expectedTables = [
  "allocation_batches",
  "audit_events",
  "cost_codes",
  "employees",
  "memberships",
  "organizations",
  "pay_periods",
  "payroll_imports",
  "projects",
  "time_entries",
  "users",
];

const requiredRuntimeConfig = [
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "AUTH_MICROSOFT_ENTRA_ID_ID",
  "AUTH_MICROSOFT_ENTRA_ID_SECRET",
  "AUTH_MICROSOFT_ENTRA_ID_TENANT_ID",
  "GRAPH_WEBHOOK_SECRET",
  "DATABASE_URL",
];

export type SystemDiagnostics = {
  runtime: {
    configured: number;
    required: number;
    missing: string[];
  };
  database: {
    status: "ready" | "not_configured" | "error";
    expectedTables: number;
    existingTables: number;
    missingTables: string[];
    message?: string;
  };
};

export async function getSystemDiagnostics(): Promise<SystemDiagnostics> {
  const missing = requiredRuntimeConfig.filter((name) => !process.env[name]);
  const runtime = {
    configured: requiredRuntimeConfig.length - missing.length,
    required: requiredRuntimeConfig.length,
    missing,
  };

  if (!process.env.DATABASE_URL) {
    return {
      runtime,
      database: {
        status: "not_configured",
        expectedTables: expectedTables.length,
        existingTables: 0,
        missingTables: expectedTables,
        message: "DATABASE_URL is not configured.",
      },
    };
  }

  try {
    const pool = getPgPool();
    const result = await pool.query<{ table_name: string }>(
      `
        select table_name
        from information_schema.tables
        where table_schema = 'public'
          and table_name = any($1)
      `,
      [expectedTables],
    );
    const existing = new Set(result.rows.map((row) => row.table_name));
    const missingTables = expectedTables.filter((table) => !existing.has(table));

    return {
      runtime,
      database: {
        status: missingTables.length === 0 ? "ready" : "error",
        expectedTables: expectedTables.length,
        existingTables: existing.size,
        missingTables,
        message: missingTables.length === 0 ? "PostgreSQL schema is ready." : "PostgreSQL is reachable but migration tables are missing.",
      },
    };
  } catch (error) {
    return {
      runtime,
      database: {
        status: "error",
        expectedTables: expectedTables.length,
        existingTables: 0,
        missingTables: expectedTables,
        message: error instanceof Error ? error.message : "Database check failed.",
      },
    };
  }
}
