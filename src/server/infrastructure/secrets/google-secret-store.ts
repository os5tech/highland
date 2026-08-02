import type { SecretName, SecretStore } from "./secret-store";

export class GoogleSecretStore implements SecretStore {
  constructor(
    private readonly projectId: string,
    private readonly fetchSecret: (resourceName: string) => Promise<string>,
  ) {}

  async getSecret(name: SecretName) {
    return this.fetchSecret(`projects/${this.projectId}/secrets/${name}/versions/latest`);
  }
}
