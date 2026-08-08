"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardHero } from "@/app/_components/dashboard/DashboardHero";
import { DashboardSidebar } from "@/app/_components/dashboard/DashboardSidebar";
import type { DashboardSecurityContext } from "@/src/server/controllers/dashboardController";

type AdminVaultPageProps = {
  security: DashboardSecurityContext;
};

type BrandingPayload = {
  primaryLogoDataUrl: string | null;
  primaryLogoFileName: string | null;
  primaryLogoMimeType: string | null;
  compactLogoDataUrl: string | null;
  compactLogoFileName: string | null;
  compactLogoMimeType: string | null;
};

const vaultSections = [
  {
    id: "branding",
    label: "Branding",
    title: "Branding Configuration",
    summary: "Control how Highland appears in the application, emails, exports, reports, and payroll packages.",
    fields: [
      ["Company logo", "Upload Highland's primary logo for the application header and generated documents."],
      ["Compact logo", "Upload a smaller mark for mobile views, cover sheets, and narrow report layouts."],
      ["Report headers", "Set the header text, logo placement, address block, and document title treatment."],
      ["Email templates", "Configure sender display name, reply-to behavior, signatures, and notification wording."],
      ["PDF package branding", "Define payroll package cover pages, footer labels, colors, and approval stamp styling."],
    ],
  },
  {
    id: "secrets",
    label: "Integration Secrets",
    title: "Integration Secrets",
    summary: "Track sensitive integration settings while storing actual values in Google Secret Manager.",
    fields: [
      ["Microsoft Graph", "Tenant ID, client ID, client secret reference, webhook secret, and subscribed services."],
      ["Payroll and accounting", "ADP and QuickBooks credential references, callback URLs, and rotation notes."],
      ["Project systems", "Procore API credentials, storage buckets, signing provider keys, and sync limits."],
      ["Messaging", "Twilio, email relay, Teams notification, and delivery-status webhook secrets."],
      ["AI services", "OpenAI key reference, allowed models, logging controls, and write-action restrictions."],
    ],
  },
  {
    id: "access",
    label: "Access Controls",
    title: "Access Controls",
    summary: "Manage least-privilege access, approval gates, emergency controls, and audit-sensitive roles.",
    fields: [
      ["Admin users", "Bootstrap administrators and define who can manage this vault."],
      ["Operational roles", "Employee, PM, project executive, payroll, accounting, CFO, and system admin access."],
      ["Approval gates", "Require the right approvals before posting payroll, exports, reclassifications, or billing actions."],
      ["MFA policy", "Mark sensitive actions that require fresh Microsoft sign-in or MFA enforcement."],
      ["Emergency lockout", "Disable external sync, AI write actions, exports, and posting workflows immediately."],
    ],
  },
];

const initialBranding: BrandingPayload = {
  primaryLogoDataUrl: null,
  primaryLogoFileName: null,
  primaryLogoMimeType: null,
  compactLogoDataUrl: null,
  compactLogoFileName: null,
  compactLogoMimeType: null,
};

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read the image file."));
      }
    });
    reader.addEventListener("error", () => reject(new Error("Could not read the image file.")));
    reader.readAsDataURL(file);
  });
}

const documentBrandingControls = [
  {
    title: "Report Headers",
    detail: "Set the default text and contact block that appears on Highland reports.",
    controls: (
      <>
        <label>
          Header title
          <input defaultValue="Highland Construction" type="text" />
        </label>
        <label>
          Header contact block
          <textarea defaultValue="Payroll and job-costing package" rows={3} />
        </label>
      </>
    ),
  },
  {
    title: "Email Templates",
    detail: "Control the sender identity and default wording for outbound notifications.",
    controls: (
      <>
        <label>
          Sender display name
          <input defaultValue="Highland Virtual Patrick" type="text" />
        </label>
        <label>
          Default footer
          <textarea defaultValue="This message was generated for Highland Construction operations." rows={3} />
        </label>
      </>
    ),
  },
  {
    title: "PDF Package Branding",
    detail: "Define the cover page, footer, approval stamp, and package presentation.",
    controls: (
      <>
        <label>
          Cover page title
          <input defaultValue="Payroll Readiness Package" type="text" />
        </label>
        <label>
          Footer label
          <input defaultValue="Highland Construction confidential" type="text" />
        </label>
      </>
    ),
  },
];

export function AdminVaultPage({ security }: AdminVaultPageProps) {
  const [activeSectionId, setActiveSectionId] = useState(vaultSections[0].id);
  const [branding, setBranding] = useState<BrandingPayload>(initialBranding);
  const [brandingStatus, setBrandingStatus] = useState("Ready");
  const activeSection = useMemo(
    () => vaultSections.find((section) => section.id === activeSectionId) ?? vaultSections[0],
    [activeSectionId],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadBranding() {
      try {
        const response = await fetch("/api/admin/branding", { cache: "no-store" });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { branding?: BrandingPayload };

        if (isMounted && payload.branding) {
          setBranding(payload.branding);
        }
      } catch {
        if (isMounted) {
          setBrandingStatus("Branding settings could not be loaded.");
        }
      }
    }

    void loadBranding();

    return () => {
      isMounted = false;
    };
  }, []);

  async function uploadLogo(kind: "primary" | "compact", file: File | undefined) {
    if (!file) {
      return;
    }

    setBrandingStatus("Saving...");

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const response = await fetch("/api/admin/branding", {
        body: JSON.stringify(
          kind === "primary"
            ? {
                primaryLogoDataUrl: dataUrl,
                primaryLogoFileName: file.name,
                primaryLogoMimeType: file.type,
              }
            : {
                compactLogoDataUrl: dataUrl,
                compactLogoFileName: file.name,
                compactLogoMimeType: file.type,
              },
        ),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json()) as { branding?: BrandingPayload; error?: string };

      if (!response.ok || !payload.branding) {
        throw new Error(payload.error ?? "Logo upload failed.");
      }

      setBranding(payload.branding);
      setBrandingStatus("Saved");
      window.dispatchEvent(
        new CustomEvent("keystone-branding-updated", {
          detail: { primaryLogoDataUrl: payload.branding.primaryLogoDataUrl },
        }),
      );
    } catch (error) {
      setBrandingStatus(error instanceof Error ? error.message : "Logo upload failed.");
    }
  }

  const brandingControls = [
    {
      title: "Logo Assets",
      detail: "Upload the Highland marks used in the app, reports, emails, and PDF packages.",
      controls: (
        <>
          <label>
            Primary logo
            <input
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onChange={(event) => void uploadLogo("primary", event.currentTarget.files?.[0])}
              type="file"
            />
            <span>{branding.primaryLogoFileName ?? "No primary logo uploaded."}</span>
          </label>
          <label>
            Compact logo
            <input
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onChange={(event) => void uploadLogo("compact", event.currentTarget.files?.[0])}
              type="file"
            />
            <span>{branding.compactLogoFileName ?? "No compact logo uploaded."}</span>
          </label>
          <p className="branding-save-status">{brandingStatus}</p>
        </>
      ),
    },
    ...documentBrandingControls,
  ];

  return (
    <main className="app-shell">
      <DashboardSidebar activeHref="/admin-vault" canAccessAdminVault={security.permissions.canAccessAdminVault} />

      <section className="workspace admin-vault-workspace">
        <DashboardHero security={security} />

        <section className="panel admin-panel admin-vault-page">
          <div className="panel-header">
            <div>
              <h2>Admin Vault</h2>
            </div>
          </div>

          <div className="vault-section-tabs" aria-label="Admin vault sections">
            {vaultSections.map((section) => (
              <button
                className={section.id === activeSection.id ? "active" : ""}
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                type="button"
              >
                {section.label}
              </button>
            ))}
          </div>

          <section className="vault-config-panel" aria-labelledby="vault-config-title">
            <div className="vault-config-header">
              <div>
                <p>{activeSection.label}</p>
                <h3 id="vault-config-title">{activeSection.title}</h3>
                <span>{activeSection.summary}</span>
              </div>
            </div>

            {activeSection.id === "branding" ? (
              <div className="branding-config-grid">
                {brandingControls.map((group) => (
                  <article className="branding-config-card" key={group.title}>
                    <div>
                      <h3>{group.title}</h3>
                      <p>{group.detail}</p>
                    </div>
                    <div className="branding-control-stack">{group.controls}</div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="vault-config-grid">
                {activeSection.fields.map(([name, detail]) => (
                  <article className="vault-config-card" key={name}>
                    <div>
                      <h3>{name}</h3>
                      <p>{detail}</p>
                    </div>
                    <button type="button">Configure</button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </section>
    </main>
  );
}
