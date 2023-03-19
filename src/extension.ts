import * as vscode from "vscode";
import {
  getEditDescription,
  getGenerateDescription,
  getNumberOfLinesInSelection,
  getText,
} from "./utils";
import { Vortex } from "./vortex";
import SecretStorageInterface from "./secret-storage-interface";

const OPENAI_API_KEY_LOOKUP = "OPENAI_API_KEY";
const vortexConfig = vscode.workspace.getConfiguration("vortex");
let vortex: Vortex;

const displayOutput = async (output: string, languageId: string) => {
  const uri = vscode.Uri.parse("untitled:Review.md");
  const doc = await vscode.workspace.openTextDocument(uri);
  const editor = await vscode.window.showTextDocument(doc, {
    preview: false,
    viewColumn: vscode.ViewColumn.Beside,
  });

  await editor.edit((editBuilder) => {
    editBuilder.insert(new vscode.Position(0, 0), output);
  });
  await vscode.commands.executeCommand("markdown.showPreview", uri);

  if (languageId) {
    vscode.languages.setTextDocumentLanguage(doc, languageId);
  }
};

export async function activate(context: vscode.ExtensionContext) {
  SecretStorageInterface.init(context);
  const secretStorage = SecretStorageInterface.instance;

  let openAIApiKey;

  openAIApiKey = await secretStorage.get(OPENAI_API_KEY_LOOKUP);

  if (!openAIApiKey) {
    openAIApiKey = await vscode.window.showInputBox({
      title: "OpenAI API Key",
      prompt: "Enter your OpenAI API Key here",
      password: true,
      ignoreFocusOut: true,
    });
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
      const { maxLinesToProcess } = vortexConfig;
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

      const updatedCode = await vortex.editCode(text, editDescription);

      if (!updatedCode) {
        await vscode.window.showErrorMessage(
          `There was an issue processing with Vortex`
        );
        return;
      }

      if (updatedCode) {
        await editor.edit((edit) => {
          const textRangeStart = selection.isEmpty
            ? document.lineAt(0).range.start
            : selection.start;
          const numberOfLines = lineCount - 1;
          const textRangeEnd = selection.isEmpty
            ? document.lineAt(numberOfLines).range.end
            : selection.end;
          const textRange = new vscode.Range(textRangeStart, textRangeEnd);
          edit.replace(textRange, updatedCode);
        });

        // clear selection
        const position = editor.selection.end;
        editor.selection = new vscode.Selection(position, position);

        await vscode.window.showInformationMessage(
          `Finished task: ${editDescription}`,
          "Great!"
        );
      }
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

      const { languageId } = editor.document;
      const generatedCode = await vortex.generateCode(
        generateDescription,
        languageId
      );

      if (!generatedCode) {
        await vscode.window.showErrorMessage(
          `There was an issue processing with Vortex`
        );
        return;
      }

      await editor.edit((edit) => {
        edit.insert(editor.selection.start, generatedCode);
      });

      await vscode.window.showInformationMessage(
        `Finished task: ${generateDescription}`,
        "Great!"
      );
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

      const { maxLinesToProcess } = vortexConfig;
      const lineCount = getNumberOfLinesInSelection(document, selection);
      if (lineCount > maxLinesToProcess) {
        await vscode.window.showErrorMessage(
          `${lineCount} lines found, skipping. Max lines threshold is ${maxLinesToProcess}`
        );
        return;
      }

      const reviewText = await vortex.reviewCode(code);

      if (!reviewText) {
        await vscode.window.showErrorMessage(
          `There was an issue processing with Vortex`
        );
        return;
      }

      await displayOutput(reviewText, "markdown");

      await vscode.window.showInformationMessage(
        `Finished task: Review code`,
        "Great!"
      );
    }
  );
  context.subscriptions.push(editCodeDisposable);
  context.subscriptions.push(generateCodeDisposable);
  context.subscriptions.push(reviewCodeDisposable);
  vscode.window.showInformationMessage(`Vortex is active`);
}

// This method is called when your extension is deactivated
export function deactivate() {}
