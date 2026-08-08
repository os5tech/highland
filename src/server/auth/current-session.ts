import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { authOptions } from "./options";
import { getDevelopmentSessionForRequest } from "./development-session";

export async function getCurrentSession() {
  const requestHeaders = await headers();

  return (await getServerSession(authOptions)) ?? getDevelopmentSessionForRequest(requestHeaders);
}
