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

const getTextInput = async (context: {
  title: string;
  prompt: string;
  placeholder?: string;
  ignoreFocusOut?: boolean;
  password?: boolean;
}) => {
  const textInput = await vscode.window.showInputBox({
    title: context.title,
    prompt: context.prompt,
    placeHolder: context.placeholder,
    ignoreFocusOut: context.ignoreFocusOut,
    password: context.password,
  });
  if (!textInput) {
    vscode.window.showErrorMessage(`No ${context.title} provided.`);
    return null;
  }
  return textInput;
};

export const getEditDescription = async () => {
  return await getTextInput({
    title: "Edit description",
    prompt: "Describe what edits you would like to make",
    placeholder: "Add comments",
  });
};

export const getGenerateDescription = async () => {
  return await getTextInput({
    title: "Generate code description",
    prompt: "Describe what code you would like to generate",
    placeholder: "Util function to calculate average of numbers",
  });
};

export const getApiKey = async () => {
  return await getTextInput({
    title: "OpenAI API Key",
    prompt: "Enter your OpenAI API Key here",
    password: true,
    ignoreFocusOut: true,
  });
};

export const getConfigValue = (configKey: string): any => {
  return vscode.workspace.getConfiguration("vortex").get(configKey);
};
