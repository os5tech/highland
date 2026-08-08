import type { Session } from "next-auth";
import { canAccessAdminVault, canManagePayroll, canApprovePosting } from "@/src/server/domain/roles";

export function getDashboardSecurityContext(session: Session) {
  const user = session.user;
  const roles = user.roles ?? ["field_employee"];

  return {
    user: {
      id: user.id,
      name: user.name ?? user.email ?? "Signed-in user",
      email: user.email ?? "",
      roles,
      tenantId: user.tenantId ?? null,
      entraObjectId: user.entraObjectId ?? null,
    },
    profile: {
      name: user.name ?? user.email ?? "Signed-in user",
      email: user.email ?? "Not provided",
      phone: "Not configured",
      roles,
      preferences: ["Email notifications", "Teams-ready alerts", "Payroll exception summaries"],
    },
    permissions: {
      canAccessAdminVault: canAccessAdminVault({ roles }),
      canManagePayroll: canManagePayroll({ roles }),
      canApprovePosting: canApprovePosting({ roles }),
    },
  };
}
