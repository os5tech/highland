import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/server/auth/options";
import { getDashboardSecurityContext } from "@/src/server/controllers/dashboardController";

export const dynamic = "force-dynamic";

const navigation = [
  "Command",
  "Time Intake",
  "PM Approval",
  "Job Costing",
  "Integrations",
  "AI Agents",
  "Admin Vault",
];

const metrics = [
  {
    label: "Payroll Readiness",
    value: "72%",
    detail: "Semi-monthly period is open with missing time and PM review still pending.",
    action: "Open readiness",
  },
  {
    label: "ADP Cost Basis",
    value: "$69.9K",
    detail: "Sample labor worksheet total expense for 12/11/25 - 12/31/25.",
    action: "Import ADP",
  },
  {
    label: "Approved Hours",
    value: "1,222",
    detail: "Validated worksheet hours to reconcile before QuickBooks export.",
    action: "Run allocation",
  },
  {
    label: "Job Buckets",
    value: "12",
    detail: "Project, General Conditions, GA, and business-development buckets.",
    action: "Sync Procore",
  },
];

const workflowSteps = [
  ["1", "Submit", "Mobile web, SMS, or admin-entered time by employee, job, cost code, hours, and notes."],
  ["2", "Validate", "Check active employee, active project, valid code, duplicates, late entries, PTO, sick, and holiday time."],
  ["3", "PM Review", "PM reviews assigned project labor, edits bad entries when needed, and notifies the employee."],
  ["4", "Payroll Ready", "Payroll admin resolves missing time, exceptions, signatures, and approval gaps."],
  ["5", "ADP", "Export payroll input or support manual ADP entry, then import final ADP payroll report."],
  ["6", "Allocate", "Calculate job and overhead cost from actual ADP expense divided by approved project hours."],
  ["7", "Post", "CFO/accounting approve the QuickBooks posting batch and save the payroll package."],
];

const intakeRows = [
  ["US-001", "Daily timesheet", "Employee", "Capture date, project, cost code, hours, notes, timestamp, confirmation."],
  ["US-002", "SMS timesheet", "Field employee", "Parse text messages and request confirmation when confidence is low."],
  ["US-003", "Weekly timesheet", "Employee", "Support multi-day entry, late flags, and duplicate prevention."],
  ["US-010", "Missing reminder", "Payroll admin", "Send escalating SMS/email/app reminders before payroll cutoff."],
];

const approvalRows = [
  ["US-007", "PM review", "PM", "Approve assigned project labor or correct entries with reason and employee notification."],
  ["US-008", "Employee signature", "Employee", "Capture signature and preserve the approved snapshot."],
  ["US-009", "PM signature", "PM", "Store PM approval with payroll package evidence."],
  ["US-011", "Escalation", "Payroll admin", "Escalate unresolved missing time to PM/admin dashboard."],
];

const allocationRows = [
  ["ADP Summary", "Import employee total expense and total hours as the cost basis."],
  ["Project Hours", "Allocate each employee's hours across project, General Conditions, GA, and BD buckets."],
  ["Validation", "Flag any row where allocated project hours do not equal ADP total hours."],
  ["Cost Split", "Calculate project cost as employee expense / total hours * project hours."],
  ["Reconcile", "Confirm allocated costs equal ADP expense before posting."],
  ["QuickBooks", "Preview export file or staging table, then lock after CFO/accounting approval."],
];

const integrations = [
  ["ADP", "Roster sync, payroll export, final payroll report import, active/inactive controls.", "MVP"],
  ["QuickBooks", "Job-cost export preview, posting approval, locked batch history.", "MVP"],
  ["Procore", "Active project and cost-code sync; codes ending in 00 map to General Conditions.", "MVP"],
  ["Twilio", "Optional SMS intake, reminders, clarification loops, and delivery tracking.", "MVP"],
  ["Microsoft 365", "SharePoint-compatible document retention and Teams/email notifications.", "Phase 1"],
  ["OpenAI", "Parser, exception summary, cost explainer, and executive reporting agents.", "Guarded"],
];

const agents = [
  ["Virtual Time PM", "Summarizes missing time, rejected entries, readiness, and reconciliation issues.", "No payroll finalization authority."],
  ["Timesheet Parser", "Turns SMS/email/free text into structured entries with confidence scores.", "Low confidence requires confirmation."],
  ["PM Review Assistant", "Highlights unusual hours, bad cost codes, weekend work, and allocation issues.", "PM must decide."],
  ["Cost Allocation Agent", "Explains labor splits and flags unreconciled totals or anomalies.", "Accounting approves batch."],
  ["Compliance Agent", "Monitors General Conditions, direct labor categorization, and 14% cap exposure.", "CFO decides reclassification."],
];

const adminControls = [
  ["Company Branding", "Highland logo, OS5 advisor mark, report headers, email templates, PDF package branding.", "Ready"],
  ["Secret Manager", "ADP, QuickBooks, Procore, Twilio, Microsoft Graph, OpenAI, signing, and storage keys.", "Masked"],
  ["Access Policy", "Least-privilege roles for employee, PM, project executive, payroll, accounting, CFO, and OS5 admin.", "Strict"],
  ["MFA + Approval Gates", "Required for admin, payroll, accounting, CFO, posting, reclassification, and billing actions.", "Required"],
  ["Immutable Audit Log", "Payroll, edits, signatures, exports, imports, AI actions, and reclassifications.", "On"],
  ["Emergency Lockout", "Disable AI write actions, external sync, and posting workflows immediately.", "Armed"],
];

const roles = [
  ["Field Employee", "Submit/correct/sign own time and view history."],
  ["Project Manager", "Review project labor, correct entries, notify employee, approve assigned work."],
  ["Project Executive", "Create business-development projects and authorize others to claim lead hours."],
  ["Payroll Admin", "Manage periods, reminders, exceptions, ADP import/export, and payroll package."],
  ["Accounting/CFO", "Approve allocation, QuickBooks posting, BD reclassification, and audit review."],
  ["OS5 Admin", "Configure integrations, roles, rules, agents, logos, and environment secrets."],
];

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const security = getDashboardSecurityContext(session);

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div>
            <p>Virtual Time PM</p>
            <strong>Highland Construction</strong>
          </div>
        </div>

        <nav className="nav-list">
          {navigation.map((item) => (
            <a className={item === "Command" ? "active" : ""} href={`#${item.toLowerCase().replaceAll(" ", "-")}`} key={item}>
              {item}
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>Current Package</p>
          <code>Payroll + Job Costing MVP</code>
          <button type="button">Refresh sources</button>
        </div>
      </aside>

      <section className="workspace" id="command">
        <header className="topbar hero">
          <div>
            <p className="eyebrow">Highland Construction / OS5</p>
            <h1>Virtual Time PM</h1>
            <p className="lede">
              A controlled payroll and job-costing assistant for time capture, PM approvals, ADP reconciliation, labor allocation, QuickBooks export, and audit-ready payroll packages.
            </p>
          </div>
          <div className="status-stack">
            <div className="status-pill"><span />MVP Adaptation</div>
            <div className="identity-card">
              <b>{security.user.name}</b>
              <span>{security.user.roles.join(", ").replaceAll("_", " ")}</span>
            </div>
            <small>24 semi-monthly pay periods per year</small>
          </div>
        </header>

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

        <section className="module-grid">
          <article className="panel" id="time-intake">
            <div className="panel-header">
              <div>
                <p className="eyebrow">MVP Workbench</p>
                <h2>Time Intake</h2>
              </div>
              <span>US-001 - US-003</span>
            </div>
            <div className="feature-list">
              {intakeRows.map(([id, title, owner, detail]) => (
                <div className="feature-row" key={id}>
                  <code>{id}</code>
                  <div>
                    <h3>{title}</h3>
                    <p><b>{owner}</b> - {detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel" id="pm-approval">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Approval Control</p>
                <h2>PM Review Queue</h2>
              </div>
              <span>Snapshot signed</span>
            </div>
            <div className="feature-list">
              {approvalRows.map(([id, title, owner, detail]) => (
                <div className="feature-row" key={id}>
                  <code>{id}</code>
                  <div>
                    <h3>{title}</h3>
                    <p><b>{owner}</b> - {detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="main-grid">
          <article className="panel" id="job-costing">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Labor Worksheet Replacement</p>
                <h2>Job-Cost Allocation Engine</h2>
              </div>
              <span>Reconciled before post</span>
            </div>
            <div className="allocation-grid">
              {allocationRows.map(([title, detail]) => (
                <div className="allocation-card" key={title}>
                  <h3>{title}</h3>
                  <p>{detail}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="panel role-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Security Model</p>
                <h2>Role-Based Workflows</h2>
              </div>
              <span>Least privilege</span>
            </div>
            <div className="role-list">
              {roles.map(([role, detail]) => (
                <div className="role-row" key={role}>
                  <h3>{role}</h3>
                  <p>{detail}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

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

        <section className="main-grid">
          <article className="panel" id="ai-agents">
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
          </article>

          <article className="panel admin-panel" id="admin-vault">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Restricted Admin</p>
                <h2>Admin Vault</h2>
              </div>
              <span>Owner approval</span>
            </div>

            <div className="vault-summary">
              <div>
                <p>Secret posture</p>
                <strong>Encrypted + masked</strong>
              </div>
              <button type="button">Open vault</button>
            </div>

            <div className="admin-list">
              <div className="admin-row">
                <div>
                  <h3>Access Decision</h3>
                  <p>{security.permissions.canAccessAdminVault ? "Current role can access vault controls." : "Current role can view status only; vault changes require CFO or OS5 admin."}</p>
                </div>
                <span>{security.permissions.canAccessAdminVault ? "Allowed" : "Read only"}</span>
              </div>
              {adminControls.map(([name, detail, state]) => (
                <div className="admin-row" key={name}>
                  <div>
                    <h3>{name}</h3>
                    <p>{detail}</p>
                  </div>
                  <span>{state}</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="panel diagnostics" aria-label="Diagnostics">
          <div>
            <h2>Build Notes</h2>
            <p>
              This first adaptation is sourced from the official Virtual PM specification, process notes, user-story backlog, and labor worksheet. Next implementation layers should add real data models, authentication, protected admin routes, D1 persistence, file importers, and export generation.
            </p>
          </div>
          <strong>Phase 1</strong>
        </section>
      </section>
    </main>
  );
}
