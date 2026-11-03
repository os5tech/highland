import { redirect } from "next/navigation";
import { DashboardPage } from "@/app/_components/dashboard/DashboardPage";
import { getCurrentSession } from "@/src/server/auth/current-session";
import { getDashboardSecurityContext } from "@/src/server/controllers/dashboardController";
import { getSystemDiagnostics } from "@/src/server/controllers/systemDiagnosticsController";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams?: Promise<{
    perspective?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const resolvedSearchParams = await searchParams;
  const security = getDashboardSecurityContext(session, resolvedSearchParams?.perspective);
  const diagnostics = await getSystemDiagnostics();

  return <DashboardPage diagnostics={diagnostics} security={security} />;
}
