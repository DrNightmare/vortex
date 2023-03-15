import * as vscode from "vscode";

/**
 * Gets the text from a document or selection
 * @param document The document to get the text from
 * @param selection The selection to get the text from
 * @returns The text from the document or selection
 */
export const getText = (
  document: vscode.TextDocument,
  selection: vscode.Selection
) => {
  return selection.isEmpty ? document.getText() : document.getText(selection);
};

/**
 * Gets the number of lines in the given selection.
 * @param document The document to get the number of lines from.
 * @param selection The selection to get the number of lines from.
 * @returns The number of lines in the given selection.
 */
export const getNumberOfLinesInSelection = (
  document: vscode.TextDocument,
  selection: vscode.Selection
) => {
  const text = getText(document, selection);
  return selection.isEmpty ? document.lineCount : text.split("\n").length;
};

/**
 * Prompts the user for an edit description
 * @returns {Promise<string | null>} The edit description or null if none was provided
 */
export const getEditDescription = async () => {
  const editDescription = await vscode.window.showInputBox({
    title: "Edit description",
    prompt: "Describe what edits you would like to make",
    placeHolder: "Add comments",
  });
  if (!editDescription) {
    vscode.window.showErrorMessage(`No edit description provided.`);
    return null;
  }
  return editDescription;
};
