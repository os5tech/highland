import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardPage } from "@/app/_components/dashboard/DashboardPage";
import { authOptions } from "@/src/server/auth/options";
import { getDevelopmentSessionForRequest } from "@/src/server/auth/development-session";
import { getDashboardSecurityContext } from "@/src/server/controllers/dashboardController";
import { getSystemDiagnostics } from "@/src/server/controllers/systemDiagnosticsController";

export const dynamic = "force-dynamic";

export default async function Home() {
  const requestHeaders = await headers();
  const session = (await getServerSession(authOptions)) ?? getDevelopmentSessionForRequest(requestHeaders);

  if (!session) {
    redirect("/login");
  }

  const security = getDashboardSecurityContext(session);
  const diagnostics = await getSystemDiagnostics();

  return <DashboardPage diagnostics={diagnostics} security={security} />;
}
