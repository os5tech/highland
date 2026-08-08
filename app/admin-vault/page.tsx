import { redirect } from "next/navigation";
import { AdminVaultPage } from "@/app/_components/admin-vault/AdminVaultPage";
import { getCurrentSession } from "@/src/server/auth/current-session";
import { getDashboardSecurityContext } from "@/src/server/controllers/dashboardController";

export const dynamic = "force-dynamic";

export default async function AdminVaultRoute() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const security = getDashboardSecurityContext(session);

  if (!security.permissions.canAccessAdminVault) {
    redirect("/");
  }

  return <AdminVaultPage security={security} />;
}
