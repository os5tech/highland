# Highland Virtual Time PM Architecture

## Pattern

This project uses a Next.js application with explicit MVC-style boundaries:

- Models: PostgreSQL schema and domain types in `db/` and `src/server/domain/`.
- Views: React server components and CSS in `app/`.
- Controllers: server controllers and API route handlers in `src/server/controllers/` and `app/api/`.
- Infrastructure adapters: replaceable providers for secrets, Microsoft Graph, database access, storage, and future queues in `src/server/infrastructure/`.

The rule is that payroll/job-costing business logic should not call Google, AWS, Microsoft Graph, ADP, QuickBooks, or Procore directly. It should call an interface owned by the application.

Dashboard page sections are split into building blocks under `app/_components/dashboard/`, with static demo content in `app/_data/dashboard.ts`. Route files should stay thin: authenticate, collect server-side context, and render composed page sections. Restricted administration belongs in standalone protected routes such as `app/admin-vault/page.tsx`, not embedded inside the main operational dashboard.

## Security Baseline

- Authentication starts with Microsoft Entra ID through NextAuth.
- Authorization is role-based and enforced server-side.
- Role mapping supports Microsoft Entra group IDs and bootstrap admin emails.
- Microsoft Graph access tokens stay server-side.
- Secrets are not committed to source control.
- Production secrets belong in Google Secret Manager.
- PostgreSQL is the system of record.
- Audit events are modeled as immutable records for payroll, approvals, corrections, imports, exports, posting, and access decisions.

For local development only, `KEYSTONE_DEV_AUTH_BYPASS=true` can create an MSTest Admin session when the request IP is in `KEYSTONE_DEV_AUTH_ALLOWED_IPS`. Keep this disabled in alpha/live unless a temporary IP allowlist has been deliberately approved and logged.

## Initial Google Provider Mapping

- Hosting: Cloud Run
- Pipeline: Cloud Build
- Container registry: Artifact Registry
- Database: Cloud SQL for PostgreSQL
- Secrets: Google Secret Manager

## Portability Guardrail

The app is containerized and uses PostgreSQL. Provider-specific code belongs in infrastructure adapters so a future AWS deployment can map to App Runner/ECS, CodePipeline/CodeBuild, ECR, RDS PostgreSQL, and AWS Secrets Manager without rewriting core payroll logic.
