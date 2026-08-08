CREATE TABLE "branding_settings" (
	"id" text PRIMARY KEY DEFAULT 'highland' NOT NULL,
	"primary_logo_data_url" text,
	"primary_logo_file_name" text,
	"primary_logo_mime_type" text,
	"compact_logo_data_url" text,
	"compact_logo_file_name" text,
	"compact_logo_mime_type" text,
	"report_header_title" text DEFAULT 'Highland Construction' NOT NULL,
	"report_header_contact_block" text DEFAULT 'Payroll and job-costing package' NOT NULL,
	"email_sender_display_name" text DEFAULT 'Highland Virtual Patrick' NOT NULL,
	"email_default_footer" text DEFAULT 'This message was generated for Highland Construction operations.' NOT NULL,
	"pdf_cover_page_title" text DEFAULT 'Payroll Readiness Package' NOT NULL,
	"pdf_footer_label" text DEFAULT 'Highland Construction confidential' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
