export type GraphUserProfile = {
  id: string;
  displayName?: string;
  mail?: string;
  userPrincipalName?: string;
};

export interface GraphClient {
  getCurrentUser(accessToken: string): Promise<GraphUserProfile>;
}
