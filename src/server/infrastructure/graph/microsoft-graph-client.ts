import type { GraphClient, GraphUserProfile } from "./graph-client";

export class MicrosoftGraphClient implements GraphClient {
  async getCurrentUser(accessToken: string): Promise<GraphUserProfile> {
    const response = await fetch("https://graph.microsoft.com/v1.0/me?$select=id,displayName,mail,userPrincipalName", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Microsoft Graph /me failed with ${response.status}`);
    }

    return response.json() as Promise<GraphUserProfile>;
  }
}
