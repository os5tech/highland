import type { AppRole } from "@/src/server/domain/roles";

const groupRoleEnv: Record<string, AppRole> = {
  ENTRA_GROUP_FIELD_EMPLOYEE_ID: "field_employee",
  ENTRA_GROUP_PROJECT_MANAGER_ID: "project_manager",
  ENTRA_GROUP_PROJECT_EXECUTIVE_ID: "project_executive",
  ENTRA_GROUP_PAYROLL_ADMIN_ID: "payroll_admin",
  ENTRA_GROUP_ACCOUNTING_ID: "accounting",
  ENTRA_GROUP_CFO_ID: "cfo",
  ENTRA_GROUP_OS5_ADMIN_ID: "os5_admin",
};

export function rolesFromEntraClaims(groups: unknown, email?: string | null): AppRole[] {
  const resolved = new Set<AppRole>();
  const groupIds = Array.isArray(groups) ? groups.filter((group): group is string => typeof group === "string") : [];

  for (const [envName, role] of Object.entries(groupRoleEnv)) {
    const configuredGroupId = process.env[envName];
    if (configuredGroupId && groupIds.includes(configuredGroupId)) {
      resolved.add(role);
    }
  }

  const adminEmails = splitCsv(process.env.HIGHLAND_BOOTSTRAP_ADMIN_EMAILS);
  if (email && adminEmails.includes(email.toLowerCase())) {
    resolved.add("os5_admin");
  }

  if (resolved.size === 0) {
    resolved.add("field_employee");
  }

  return [...resolved];
}

function splitCsv(value?: string) {
  return (value ?? "")
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
}
