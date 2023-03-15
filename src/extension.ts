import * as vscode from "vscode";
import {
  getEditDescription,
  getNumberOfLinesInSelection,
  getText,
} from "./utils";
import { Vortex } from "./vortex";

const vortexConfig = vscode.workspace.getConfiguration("vortex");
const vortex = new Vortex("openai-api-key");

const displayOutput = async (
  output: string,
  uriString: string,
  message: string,
  languageId: string
) => {
  const uri = vscode.Uri.parse(uriString);
  const doc = await vscode.workspace.openTextDocument(uri);
  const editor = await vscode.window.showTextDocument(
    doc,
    vscode.ViewColumn.Beside
  );
  vscode.languages.setTextDocumentLanguage(doc, languageId);
  editor.edit((edit) => {
    const firstLine = editor.document.lineAt(0);
    const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
    const textRange = new vscode.Range(
      firstLine.range.start,
      lastLine.range.end
    );
    edit.replace(textRange, output);
  });
  await editor.edit((edit) => {
    edit.insert(new vscode.Position(0, 0), output);
  });
  vscode.window.showInformationMessage(message);
};

export async function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "vortex.editCode",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

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
      console.log(`editDescription: ${editDescription}`);
      if (!editDescription) return;

      const updatedCode = await vortex.editCode(text, editDescription);
      console.log(`updatedCode: ${updatedCode}`);

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
  context.subscriptions.push(disposable);
  vscode.window.showInformationMessage(`Vortex is active`);
}

// This method is called when your extension is deactivated
export function deactivate() {}
