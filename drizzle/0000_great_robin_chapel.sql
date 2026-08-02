CREATE TYPE "public"."app_role" AS ENUM('field_employee', 'project_manager', 'project_executive', 'payroll_admin', 'accounting', 'cfo', 'os5_admin');--> statement-breakpoint
CREATE TYPE "public"."audit_action" AS ENUM('create', 'update', 'approve', 'reject', 'correct', 'sign', 'import', 'export', 'post', 'login', 'access_denied');--> statement-breakpoint
CREATE TYPE "public"."employee_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."employment_type" AS ENUM('hourly', 'salary');--> statement-breakpoint
CREATE TYPE "public"."pay_period_status" AS ENUM('draft', 'open', 'review', 'locked', 'posted');--> statement-breakpoint
CREATE TYPE "public"."project_type" AS ENUM('real_job', 'business_development', 'overhead', 'general_admin');--> statement-breakpoint
CREATE TYPE "public"."time_entry_status" AS ENUM('draft', 'submitted', 'pm_corrected', 'approved', 'rejected', 'locked');--> statement-breakpoint
CREATE TABLE "allocation_batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pay_period_id" uuid NOT NULL,
	"payroll_import_id" uuid NOT NULL,
	"status" text DEFAULT 'preview' NOT NULL,
	"total_allocated_cost" numeric(12, 2) NOT NULL,
	"total_allocated_hours" numeric(12, 2) NOT NULL,
	"approved_by_user_id" uuid,
	"approved_at" timestamp with time zone,
	"posted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_user_id" uuid,
	"action" "audit_action" NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"before_json" jsonb,
	"after_json" jsonb,
	"source_ip" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cost_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"procore_id" text,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"is_general_conditions" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"adp_id" text,
	"name" text NOT NULL,
	"email" text,
	"employment_type" "employment_type" NOT NULL,
	"status" "employee_status" DEFAULT 'active' NOT NULL,
	"default_role" "app_role" DEFAULT 'field_employee' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "app_role" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"microsoft_tenant_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pay_periods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" text NOT NULL,
	"starts_on" timestamp with time zone NOT NULL,
	"ends_on" timestamp with time zone NOT NULL,
	"status" "pay_period_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payroll_imports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pay_period_id" uuid NOT NULL,
	"source_system" text DEFAULT 'adp' NOT NULL,
	"imported_by_user_id" uuid NOT NULL,
	"total_expense" numeric(12, 2) NOT NULL,
	"total_hours" numeric(12, 2) NOT NULL,
	"source_file_name" text,
	"imported_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"procore_id" text,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"type" "project_type" DEFAULT 'real_job' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "time_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pay_period_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"cost_code_id" uuid NOT NULL,
	"work_date" timestamp with time zone NOT NULL,
	"hours" numeric(8, 2) NOT NULL,
	"notes" text,
	"status" time_entry_status DEFAULT 'draft' NOT NULL,
	"source" text DEFAULT 'web' NOT NULL,
	"pm_correction_reason" text,
	"approved_by_user_id" uuid,
	"approved_at" timestamp with time zone,
	"employee_signed_at" timestamp with time zone,
	"pm_signed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entra_object_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "allocation_batches" ADD CONSTRAINT "allocation_batches_pay_period_id_pay_periods_id_fk" FOREIGN KEY ("pay_period_id") REFERENCES "public"."pay_periods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "allocation_batches" ADD CONSTRAINT "allocation_batches_payroll_import_id_payroll_imports_id_fk" FOREIGN KEY ("payroll_import_id") REFERENCES "public"."payroll_imports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "allocation_batches" ADD CONSTRAINT "allocation_batches_approved_by_user_id_users_id_fk" FOREIGN KEY ("approved_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_events" ADD CONSTRAINT "audit_events_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_imports" ADD CONSTRAINT "payroll_imports_pay_period_id_pay_periods_id_fk" FOREIGN KEY ("pay_period_id") REFERENCES "public"."pay_periods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll_imports" ADD CONSTRAINT "payroll_imports_imported_by_user_id_users_id_fk" FOREIGN KEY ("imported_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_pay_period_id_pay_periods_id_fk" FOREIGN KEY ("pay_period_id") REFERENCES "public"."pay_periods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_cost_code_id_cost_codes_id_fk" FOREIGN KEY ("cost_code_id") REFERENCES "public"."cost_codes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_approved_by_user_id_users_id_fk" FOREIGN KEY ("approved_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_events_entity_idx" ON "audit_events" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "audit_events_actor_user_id_idx" ON "audit_events" USING btree ("actor_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "cost_codes_code_idx" ON "cost_codes" USING btree ("code");--> statement-breakpoint
CREATE INDEX "cost_codes_is_general_conditions_idx" ON "cost_codes" USING btree ("is_general_conditions");--> statement-breakpoint
CREATE UNIQUE INDEX "employees_adp_id_idx" ON "employees" USING btree ("adp_id");--> statement-breakpoint
CREATE INDEX "employees_status_idx" ON "employees" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "memberships_user_org_role_idx" ON "memberships" USING btree ("user_id","organization_id","role");--> statement-breakpoint
CREATE INDEX "memberships_organization_id_idx" ON "memberships" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_code_idx" ON "projects" USING btree ("code");--> statement-breakpoint
CREATE INDEX "projects_is_active_idx" ON "projects" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "time_entries_pay_period_id_idx" ON "time_entries" USING btree ("pay_period_id");--> statement-breakpoint
CREATE INDEX "time_entries_employee_period_idx" ON "time_entries" USING btree ("employee_id","pay_period_id");--> statement-breakpoint
CREATE INDEX "time_entries_project_id_idx" ON "time_entries" USING btree ("project_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_entra_object_id_idx" ON "users" USING btree ("entra_object_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");