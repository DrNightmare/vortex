import { ExtensionContext, SecretStorage } from "vscode";

export default class SecretStorageInterface {
  private static _instance: SecretStorageInterface;

  constructor(private secretStorage: SecretStorage) {}

  static init(context: ExtensionContext): void {
    SecretStorageInterface._instance = new SecretStorageInterface(
      context.secrets
    );
  }

  static get instance(): SecretStorageInterface {
    return SecretStorageInterface._instance;
  }

  async set(key: string, value: string): Promise<void> {
    try {
      await this.secretStorage.store(key, value);
    } catch (error) {
      console.error(`Error setting key ${key}:`, error);
    }
  }

  async get(key: string): Promise<string | undefined> {
    return await this.secretStorage.get(key);
  }
}
