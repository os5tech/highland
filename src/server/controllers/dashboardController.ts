import type { Session } from "next-auth";
import {
  appRoles,
  canAccessAdminVault,
  canManagePayroll,
  canApprovePosting,
  canReviewTimeEntries,
  requiresTimeIntake,
  type AppRole,
} from "@/src/server/domain/roles";

function roleFromPerspective(value?: string | string[]) {
  const requested = Array.isArray(value) ? value[0] : value;

  return appRoles.find((role) => role === requested) ?? null;
}

export function getDashboardSecurityContext(session: Session, requestedPerspective?: string | string[]) {
  const user = session.user;
  const roles = user.roles ?? ["field_employee"];
  const userCanAccessAdminVault = canAccessAdminVault({ roles });
  const perspectiveRole = userCanAccessAdminVault ? roleFromPerspective(requestedPerspective) : null;
  const effectiveRoles = perspectiveRole ? ([perspectiveRole] as AppRole[]) : roles;
  const effectiveCanAccessAdminVault = canAccessAdminVault({ roles: effectiveRoles });
  const showsTimeSubmitterDashboard =
    requiresTimeIntake({ roles: effectiveRoles }) ||
    (effectiveRoles.includes("field_employee") && !canManagePayroll({ roles: effectiveRoles }));
  const showsPmApprovalDashboard =
    canReviewTimeEntries({ roles: effectiveRoles }) && !canManagePayroll({ roles: effectiveRoles });

  return {
    user: {
      id: user.id,
      name: user.name ?? user.email ?? "Signed-in user",
      email: user.email ?? "",
      roles,
      effectiveRoles,
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
    perspective: {
      activeRole: perspectiveRole,
      canPreviewPerspectives: userCanAccessAdminVault,
    },
    permissions: {
      canAccessAdminVault: effectiveCanAccessAdminVault,
      canManagePayroll: canManagePayroll({ roles: effectiveRoles }),
      canApprovePosting: canApprovePosting({ roles: effectiveRoles }),
      canReviewTimeEntries: canReviewTimeEntries({ roles: effectiveRoles }),
      requiresTimeIntake: requiresTimeIntake({ roles: effectiveRoles }),
      showsTimeSubmitterDashboard,
      showsPmApprovalDashboard,
    },
  };
}

export type DashboardSecurityContext = ReturnType<typeof getDashboardSecurityContext>;
