export const appRoles = [
  "field_employee",
  "project_manager",
  "project_executive",
  "payroll_admin",
  "accounting",
  "cfo",
  "os5_admin",
] as const;

export type AppRole = (typeof appRoles)[number];

export type AuthenticatedUser = {
  id: string;
  email: string;
  name?: string | null;
  roles: AppRole[];
  entraObjectId?: string | null;
  tenantId?: string | null;
};

const adminRoles: AppRole[] = ["payroll_admin", "accounting", "cfo", "os5_admin"];

export function hasRole(user: Pick<AuthenticatedUser, "roles">, role: AppRole) {
  return user.roles.includes(role);
}

export function canAccessAdminVault(user: Pick<AuthenticatedUser, "roles">) {
  return user.roles.some((role) => role === "cfo" || role === "os5_admin");
}

export function canManagePayroll(user: Pick<AuthenticatedUser, "roles">) {
  return user.roles.some((role) => adminRoles.includes(role));
}

export function canApprovePosting(user: Pick<AuthenticatedUser, "roles">) {
  return user.roles.some((role) => role === "accounting" || role === "cfo");
}
