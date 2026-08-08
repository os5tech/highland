# Highland Construction AI Project

This repository is the working space for Highland Construction's AI and operational technology initiatives, supported by OS5 Technology Solutions.

The project objective is to improve Highland Construction's operational efficiency, profitability, safety, communication, scheduling, compliance, reporting, and decision making through practical software engineering, workflow automation, data integration, and ethical AI.

## Current App Surface

The repository now includes a first-pass Highland Virtual Patrick web layout based on the official software specification, process notes, user-story backlog, and labor worksheet. It provides a dashboard-style operations center for semi-monthly payroll readiness, time intake, PM approvals, ADP import/export, job-cost allocation, QuickBooks export, Procore project/cost-code sync, AI agents, diagnostics, and a restricted Admin Vault for high-importance configuration such as logos, API keys, access policy, audit logging, data sources, and emergency lockout.

Sensitive values should never be committed directly to source control. Store real API keys, credentials, and environment-specific secrets through the hosting platform or an approved secret manager, with role-based access and audit logging.

## Architecture Direction

The project is now oriented as a portable Next.js + TypeScript application with PostgreSQL as the system of record, Microsoft Entra ID for sign-in, Microsoft Graph for Microsoft 365 integration, and Google Cloud as the first deployment provider.

See [docs/architecture.md](/Users/sergio.oliveros/Documents/Highland%20PM/docs/architecture.md) for the MVC-style boundaries, security baseline, Google provider mapping, and portability guardrails.

## Local Development

1. Copy `.env.example` to `.env.local` and fill in the Microsoft Entra app registration values.
2. Start local PostgreSQL with `docker compose up -d postgres`.
3. Generate migrations with `npm run db:generate`.
4. Apply migrations with `npm run db:migrate`.
5. Start the app with `npm run dev`.

See [AGENTS.md](/Users/sergio.oliveros/Documents/Highland%20PM/AGENTS.md) for the project operating instructions, decision framework, and technology principles that should guide work in this repository.
