import {
  boolean,
  index,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const appRole = pgEnum("app_role", [
  "field_employee",
  "project_manager",
  "project_executive",
  "payroll_admin",
  "accounting",
  "cfo",
  "os5_admin",
]);

export const employmentType = pgEnum("employment_type", ["hourly", "salary"]);
export const employeeStatus = pgEnum("employee_status", ["active", "inactive"]);
export const payPeriodStatus = pgEnum("pay_period_status", ["draft", "open", "review", "locked", "posted"]);
export const projectType = pgEnum("project_type", ["real_job", "business_development", "overhead", "general_admin"]);
export const timeEntryStatus = pgEnum("time_entry_status", ["draft", "submitted", "pm_corrected", "approved", "rejected", "locked"]);
export const auditAction = pgEnum("audit_action", [
  "create",
  "update",
  "approve",
  "reject",
  "correct",
  "sign",
  "import",
  "export",
  "post",
  "login",
  "access_denied",
]);

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  microsoftTenantId: text("microsoft_tenant_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const brandingSettings = pgTable("branding_settings", {
  id: text("id").primaryKey().default("highland"),
  primaryLogoDataUrl: text("primary_logo_data_url"),
  primaryLogoFileName: text("primary_logo_file_name"),
  primaryLogoMimeType: text("primary_logo_mime_type"),
  compactLogoDataUrl: text("compact_logo_data_url"),
  compactLogoFileName: text("compact_logo_file_name"),
  compactLogoMimeType: text("compact_logo_mime_type"),
  reportHeaderTitle: text("report_header_title").default("Highland Construction").notNull(),
  reportHeaderContactBlock: text("report_header_contact_block").default("Payroll and job-costing package").notNull(),
  emailSenderDisplayName: text("email_sender_display_name").default("Highland Virtual Patrick").notNull(),
  emailDefaultFooter: text("email_default_footer")
    .default("This message was generated for Highland Construction operations.")
    .notNull(),
  pdfCoverPageTitle: text("pdf_cover_page_title").default("Payroll Readiness Package").notNull(),
  pdfFooterLabel: text("pdf_footer_label").default("Highland Construction confidential").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    entraObjectId: text("entra_object_id").notNull(),
    email: text("email").notNull(),
    name: text("name"),
    mobilePhone: text("mobile_phone"),
    isActive: boolean("is_active").default(true).notNull(),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    entraObjectIdIdx: uniqueIndex("users_entra_object_id_idx").on(table.entraObjectId),
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
  }),
);

export const memberships = pgTable(
  "memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    role: appRole("role").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userOrgRoleIdx: uniqueIndex("memberships_user_org_role_idx").on(table.userId, table.organizationId, table.role),
    orgIdx: index("memberships_organization_id_idx").on(table.organizationId),
  }),
);

export const employees = pgTable(
  "employees",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    adpId: text("adp_id"),
    name: text("name").notNull(),
    email: text("email"),
    employmentType: employmentType("employment_type").notNull(),
    status: employeeStatus("status").default("active").notNull(),
    defaultRole: appRole("default_role").default("field_employee").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    adpIdIdx: uniqueIndex("employees_adp_id_idx").on(table.adpId),
    statusIdx: index("employees_status_idx").on(table.status),
  }),
);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    procoreId: text("procore_id"),
    code: text("code").notNull(),
    name: text("name").notNull(),
    type: projectType("type").default("real_job").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdByUserId: uuid("created_by_user_id").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    codeIdx: uniqueIndex("projects_code_idx").on(table.code),
    activeIdx: index("projects_is_active_idx").on(table.isActive),
  }),
);

export const costCodes = pgTable(
  "cost_codes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    procoreId: text("procore_id"),
    code: text("code").notNull(),
    name: text("name").notNull(),
    isGeneralConditions: boolean("is_general_conditions").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    codeIdx: uniqueIndex("cost_codes_code_idx").on(table.code),
    gcIdx: index("cost_codes_is_general_conditions_idx").on(table.isGeneralConditions),
  }),
);

export const payPeriods = pgTable("pay_periods", {
  id: uuid("id").defaultRandom().primaryKey(),
  label: text("label").notNull(),
  startsOn: timestamp("starts_on", { withTimezone: true }).notNull(),
  endsOn: timestamp("ends_on", { withTimezone: true }).notNull(),
  status: payPeriodStatus("status").default("draft").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const timeEntries = pgTable(
  "time_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    payPeriodId: uuid("pay_period_id").references(() => payPeriods.id).notNull(),
    employeeId: uuid("employee_id").references(() => employees.id).notNull(),
    projectId: uuid("project_id").references(() => projects.id).notNull(),
    costCodeId: uuid("cost_code_id").references(() => costCodes.id).notNull(),
    workDate: timestamp("work_date", { withTimezone: true }).notNull(),
    hours: numeric("hours", { precision: 8, scale: 2 }).notNull(),
    notes: text("notes"),
    status: timeEntryStatus("status").default("draft").notNull(),
    source: text("source").default("web").notNull(),
    pmCorrectionReason: text("pm_correction_reason"),
    approvedByUserId: uuid("approved_by_user_id").references(() => users.id),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    employeeSignedAt: timestamp("employee_signed_at", { withTimezone: true }),
    pmSignedAt: timestamp("pm_signed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    payPeriodIdx: index("time_entries_pay_period_id_idx").on(table.payPeriodId),
    employeePeriodIdx: index("time_entries_employee_period_idx").on(table.employeeId, table.payPeriodId),
    projectIdx: index("time_entries_project_id_idx").on(table.projectId),
  }),
);

export const payrollImports = pgTable("payroll_imports", {
  id: uuid("id").defaultRandom().primaryKey(),
  payPeriodId: uuid("pay_period_id").references(() => payPeriods.id).notNull(),
  sourceSystem: text("source_system").default("adp").notNull(),
  importedByUserId: uuid("imported_by_user_id").references(() => users.id).notNull(),
  totalExpense: numeric("total_expense", { precision: 12, scale: 2 }).notNull(),
  totalHours: numeric("total_hours", { precision: 12, scale: 2 }).notNull(),
  sourceFileName: text("source_file_name"),
  importedAt: timestamp("imported_at", { withTimezone: true }).defaultNow().notNull(),
});

export const allocationBatches = pgTable("allocation_batches", {
  id: uuid("id").defaultRandom().primaryKey(),
  payPeriodId: uuid("pay_period_id").references(() => payPeriods.id).notNull(),
  payrollImportId: uuid("payroll_import_id").references(() => payrollImports.id).notNull(),
  status: text("status").default("preview").notNull(),
  totalAllocatedCost: numeric("total_allocated_cost", { precision: 12, scale: 2 }).notNull(),
  totalAllocatedHours: numeric("total_allocated_hours", { precision: 12, scale: 2 }).notNull(),
  approvedByUserId: uuid("approved_by_user_id").references(() => users.id),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  postedAt: timestamp("posted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const auditEvents = pgTable(
  "audit_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorUserId: uuid("actor_user_id").references(() => users.id),
    action: auditAction("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    beforeJson: jsonb("before_json"),
    afterJson: jsonb("after_json"),
    sourceIp: text("source_ip"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    entityIdx: index("audit_events_entity_idx").on(table.entityType, table.entityId),
    actorIdx: index("audit_events_actor_user_id_idx").on(table.actorUserId),
  }),
);
