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
    this.secretStorage.store(key, value);
  }

  async get(key: string): Promise<string | undefined> {
    return await this.secretStorage.get(key);
  }
}
