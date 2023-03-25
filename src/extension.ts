import * as vscode from "vscode";
import {
  getApiKey,
  getConfigValue,
  getEditDescription,
  getGenerateDescription,
  getNumberOfLinesInSelection,
  getText,
} from "./utils";
import { Vortex } from "./vortex";
import SecretStorageInterface from "./secret-storage-interface";

const OPENAI_API_KEY_LOOKUP = "OPENAI_API_KEY";
let vortex: Vortex;

export async function activate(context: vscode.ExtensionContext) {
  SecretStorageInterface.init(context);
  const secretStorage = SecretStorageInterface.instance;

  let openAIApiKey;

  openAIApiKey = await secretStorage.get(OPENAI_API_KEY_LOOKUP);

  if (!openAIApiKey) {
    openAIApiKey = await getApiKey();
    if (!openAIApiKey) {
      vscode.window.showWarningMessage(
        "OpenAI API Key not provided, Vortex is not activated"
      );
      return;
    }
    await secretStorage.set(OPENAI_API_KEY_LOOKUP, openAIApiKey);
  }

  vortex = new Vortex(openAIApiKey);

  let editCodeDisposable = vscode.commands.registerCommand(
    "vortex.editCode",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const { selection, document } = editor;
      const maxLinesToProcess = getConfigValue("maxLinesToProcess");
      const lineCount = getNumberOfLinesInSelection(document, selection);
      if (lineCount > maxLinesToProcess) {
        await vscode.window.showErrorMessage(
          `${lineCount} lines found, skipping. Max lines threshold is ${maxLinesToProcess}`
        );
        return;
      }
      const text = getText(document, selection);

      const editDescription = await getEditDescription();
      if (!editDescription) {
        return;
      }

      await vortex.editCode(editor, text, editDescription);
    }
  );

  let generateCodeDisposable = vscode.commands.registerCommand(
    "vortex.generateCode",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const generateDescription = await getGenerateDescription();
      if (!generateDescription) {
        return;
      }
      await vortex.generateCode(editor, generateDescription);
    }
  );

  let reviewCodeDisposable = vscode.commands.registerCommand(
    "vortex.reviewCode",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const { document, selection } = editor;
      const code = getText(document, selection);

      const maxLinesToProcess = getConfigValue("maxLinesToProcess");
      const lineCount = getNumberOfLinesInSelection(document, selection);
      if (lineCount > maxLinesToProcess) {
        await vscode.window.showErrorMessage(
          `${lineCount} lines found, skipping. Max lines threshold is ${maxLinesToProcess}`
        );
        return;
      }

      await vortex.reviewCode(code);
    }
  );

  let updateApiKeyDisposable = vscode.commands.registerCommand(
    "vortex.updateApiKey",
    async () => {
      openAIApiKey = await getApiKey();

      if (!openAIApiKey) {
        vscode.window.showWarningMessage(
          "OpenAI API Key not provided, Vortex is not activated"
        );
        return;
      }
      await secretStorage.set(OPENAI_API_KEY_LOOKUP, openAIApiKey);

      // reinitialize vortex here, as just updating the store will not update the older instance
      vortex = new Vortex(openAIApiKey);

      await vscode.window.showInformationMessage(
        `Vortex: Updated OpenAI API key successfully`
      );
    }
  );

  context.subscriptions.push(editCodeDisposable);
  context.subscriptions.push(generateCodeDisposable);
  context.subscriptions.push(reviewCodeDisposable);
  context.subscriptions.push(updateApiKeyDisposable);
  vscode.window.showInformationMessage(`Vortex is active`);
}

// This method is called when your extension is deactivated
export function deactivate() {}
