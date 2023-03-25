import { ExtensionContext, SecretStorage } from "vscode";
import { Logger } from "./logger";

export default class SecretStorageInterface {
  private static _instance: SecretStorageInterface;
  private logger: Logger;

  constructor(private secretStorage: SecretStorage) {
    this.logger = Logger.getInstance();
  }

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
    } catch (err: any) {
      this.logger.error(`Error setting key ${key}: ${err.message}`);
    }
  }

  async get(key: string): Promise<string | undefined> {
    return await this.secretStorage.get(key);
  }
}
