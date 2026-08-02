export type SecretName =
  | "database-url"
  | "microsoft-client-secret"
  | "graph-webhook-secret"
  | "adp-client-secret"
  | "quickbooks-client-secret"
  | "procore-client-secret"
  | "twilio-auth-token"
  | "openai-api-key";

export interface SecretStore {
  getSecret(name: SecretName): Promise<string>;
}
