import { redirect } from "next/navigation";
import { TimesheetPage } from "@/app/_components/timesheet/TimesheetPage";
import { getCurrentSession } from "@/src/server/auth/current-session";
import { getDashboardSecurityContext } from "@/src/server/controllers/dashboardController";

export const dynamic = "force-dynamic";

type TimesheetRouteProps = {
  searchParams?: Promise<{
    perspective?: string;
  }>;
};

export default async function TimesheetRoute({ searchParams }: TimesheetRouteProps) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const resolvedSearchParams = await searchParams;
  const security = getDashboardSecurityContext(session, resolvedSearchParams?.perspective);

  return <TimesheetPage security={security} />;
}
