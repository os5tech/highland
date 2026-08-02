import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import { MicrosoftGraphClient } from "@/src/server/infrastructure/graph/microsoft-graph-client";

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token?.accessToken || typeof token.accessToken !== "string") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const graph = new MicrosoftGraphClient();
  const profile = await graph.getCurrentUser(token.accessToken);

  return NextResponse.json({ profile });
}
