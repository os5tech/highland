# Highland Virtual Time PM Architecture

## Pattern

This project uses a Next.js application with explicit MVC-style boundaries:

- Models: PostgreSQL schema and domain types in `db/` and `src/server/domain/`.
- Views: React server components and CSS in `app/`.
- Controllers: server controllers and API route handlers in `src/server/controllers/` and `app/api/`.
- Infrastructure adapters: replaceable providers for secrets, Microsoft Graph, database access, storage, and future queues in `src/server/infrastructure/`.

The rule is that payroll/job-costing business logic should not call Google, AWS, Microsoft Graph, ADP, QuickBooks, or Procore directly. It should call an interface owned by the application.

## Security Baseline

- Authentication starts with Microsoft Entra ID through NextAuth.
- Authorization is role-based and enforced server-side.
- Role mapping supports Microsoft Entra group IDs and bootstrap admin emails.
- Microsoft Graph access tokens stay server-side.
- Secrets are not committed to source control.
- Production secrets belong in Google Secret Manager.
- PostgreSQL is the system of record.
- Audit events are modeled as immutable records for payroll, approvals, corrections, imports, exports, posting, and access decisions.

## Initial Google Provider Mapping

- Hosting: Cloud Run
- Pipeline: Cloud Build
- Container registry: Artifact Registry
- Database: Cloud SQL for PostgreSQL
- Secrets: Google Secret Manager

## Portability Guardrail

The app is containerized and uses PostgreSQL. Provider-specific code belongs in infrastructure adapters so a future AWS deployment can map to App Runner/ECS, CodePipeline/CodeBuild, ECR, RDS PostgreSQL, and AWS Secrets Manager without rewriting core payroll logic.
