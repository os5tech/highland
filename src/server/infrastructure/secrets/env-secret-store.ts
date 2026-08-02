import type { SecretName, SecretStore } from "./secret-store";

const envMap: Record<SecretName, string> = {
  "database-url": "DATABASE_URL",
  "microsoft-client-secret": "AUTH_MICROSOFT_ENTRA_ID_SECRET",
  "graph-webhook-secret": "GRAPH_WEBHOOK_SECRET",
  "adp-client-secret": "ADP_CLIENT_SECRET",
  "quickbooks-client-secret": "QUICKBOOKS_CLIENT_SECRET",
  "procore-client-secret": "PROCORE_CLIENT_SECRET",
  "twilio-auth-token": "TWILIO_AUTH_TOKEN",
  "openai-api-key": "OPENAI_API_KEY",
};

export class EnvSecretStore implements SecretStore {
  async getSecret(name: SecretName) {
    const envName = envMap[name];
    const value = process.env[envName];

    if (!value) {
      throw new Error(`Missing secret environment variable: ${envName}`);
    }

    return value;
  }
}
