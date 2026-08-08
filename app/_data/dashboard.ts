export const navigation = [
  "Command",
  "Time Intake",
  "PM Approval",
  "Job Costing",
  "Integrations",
  "AI Agents",
  "Admin Vault",
];

export const metrics = [
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

export const workflowSteps = [
  ["1", "Submit", "Mobile web, SMS, or admin-entered time by employee, job, cost code, hours, and notes."],
  ["2", "Validate", "Check active employee, active project, valid code, duplicates, late entries, PTO, sick, and holiday time."],
  ["3", "PM Review", "PM reviews assigned project labor, edits bad entries when needed, and notifies the employee."],
  ["4", "Payroll Ready", "Payroll admin resolves missing time, exceptions, signatures, and approval gaps."],
  ["5", "ADP", "Export payroll input or support manual ADP entry, then import final ADP payroll report."],
  ["6", "Allocate", "Calculate job and overhead cost from actual ADP expense divided by approved project hours."],
  ["7", "Post", "CFO/accounting approve the QuickBooks posting batch and save the payroll package."],
];

export const intakeRows = [
  ["US-001", "Daily timesheet", "Employee", "Capture date, project, cost code, hours, notes, timestamp, confirmation."],
  ["US-002", "SMS timesheet", "Field employee", "Parse text messages and request confirmation when confidence is low."],
  ["US-003", "Weekly timesheet", "Employee", "Support multi-day entry, late flags, and duplicate prevention."],
  ["US-010", "Missing reminder", "Payroll admin", "Send escalating SMS/email/app reminders before payroll cutoff."],
];

export const approvalRows = [
  ["US-007", "PM review", "PM", "Approve assigned project labor or correct entries with reason and employee notification."],
  ["US-008", "Employee signature", "Employee", "Capture signature and preserve the approved snapshot."],
  ["US-009", "PM signature", "PM", "Store PM approval with payroll package evidence."],
  ["US-011", "Escalation", "Payroll admin", "Escalate unresolved missing time to PM/admin dashboard."],
];

export const allocationRows = [
  ["ADP Summary", "Import employee total expense and total hours as the cost basis."],
  ["Project Hours", "Allocate each employee's hours across project, General Conditions, GA, and BD buckets."],
  ["Validation", "Flag any row where allocated project hours do not equal ADP total hours."],
  ["Cost Split", "Calculate project cost as employee expense / total hours * project hours."],
  ["Reconcile", "Confirm allocated costs equal ADP expense before posting."],
  ["QuickBooks", "Preview export file or staging table, then lock after CFO/accounting approval."],
];

export const integrations = [
  ["ADP", "Roster sync, payroll export, final payroll report import, active/inactive controls.", "MVP"],
  ["QuickBooks", "Job-cost export preview, posting approval, locked batch history.", "MVP"],
  ["Procore", "Active project and cost-code sync; codes ending in 00 map to General Conditions.", "MVP"],
  ["Twilio", "Optional SMS intake, reminders, clarification loops, and delivery tracking.", "MVP"],
  ["Microsoft 365", "SharePoint-compatible document retention and Teams/email notifications.", "Phase 1"],
  ["OpenAI", "Parser, exception summary, cost explainer, and executive reporting agents.", "Guarded"],
];

export const agents = [
  ["Virtual Time PM", "Summarizes missing time, rejected entries, readiness, and reconciliation issues.", "No payroll finalization authority."],
  ["Timesheet Parser", "Turns SMS/email/free text into structured entries with confidence scores.", "Low confidence requires confirmation."],
  ["PM Review Assistant", "Highlights unusual hours, bad cost codes, weekend work, and allocation issues.", "PM must decide."],
  ["Cost Allocation Agent", "Explains labor splits and flags unreconciled totals or anomalies.", "Accounting approves batch."],
  ["Compliance Agent", "Monitors General Conditions, direct labor categorization, and 14% cap exposure.", "CFO decides reclassification."],
];

export const adminControls = [
  ["Company Branding", "Highland logo, OS5 advisor mark, report headers, email templates, PDF package branding.", "Ready"],
  ["Secret Manager", "ADP, QuickBooks, Procore, Twilio, Microsoft Graph, OpenAI, signing, and storage keys.", "Masked"],
  ["Access Policy", "Least-privilege roles for employee, PM, project executive, payroll, accounting, CFO, and OS5 admin.", "Strict"],
  ["MFA + Approval Gates", "Required for admin, payroll, accounting, CFO, posting, reclassification, and billing actions.", "Required"],
  ["Immutable Audit Log", "Payroll, edits, signatures, exports, imports, AI actions, and reclassifications.", "On"],
  ["Emergency Lockout", "Disable AI write actions, external sync, and posting workflows immediately.", "Armed"],
];

export const roles = [
  ["Field Employee", "Submit/correct/sign own time and view history."],
  ["Project Manager", "Review project labor, correct entries, notify employee, approve assigned work."],
  ["Project Executive", "Create business-development projects and authorize others to claim lead hours."],
  ["Payroll Admin", "Manage periods, reminders, exceptions, ADP import/export, and payroll package."],
  ["Accounting/CFO", "Approve allocation, QuickBooks posting, BD reclassification, and audit review."],
  ["OS5 Admin", "Configure integrations, roles, rules, agents, logos, and environment secrets."],
];
