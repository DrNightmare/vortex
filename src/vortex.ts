import {
  window,
  ProgressLocation,
  TextEditor,
  Range,
  Selection,
  commands,
} from "vscode";
import { OpenAiClient } from "./open-ai-client";
import { getNumberOfLinesInSelection, getConfigValue } from "./utils";
import { Logger } from "./logger";
import { VortexOutputPanel } from "./vortex-output-panel";

export class Vortex {
  private openAiClient: OpenAiClient;
  private logger: Logger;

  constructor(openAiApiKey: string) {
    this.openAiClient = new OpenAiClient(openAiApiKey);
    this.logger = Logger.getInstance();
  }

  editCode = async (
    editor: TextEditor,
    originalCode: string,
    editDescription: string
  ) => {
    const prompt = `Act as an expert software engineer. Update the below code with this edit description: ${editDescription}. Only do the requested edits. Preserve original code indentation. Include imports if necessary for code to function. Only output the code, do not provide descriptions.\n${originalCode.trim()}`;
    const updatedCode = await window.withProgress(
      {
        location: ProgressLocation.Notification,
        title: "Processing...",
      },
      async () => this.openAiClient.getResponse(prompt)
    );

    if (!updatedCode) {
      this.logger.error("Empty response received from OpenAI");
      await window.showErrorMessage(`Vortex: Empty response received`);
      return;
    }

    const { selection, document } = editor;
    const lineCount = getNumberOfLinesInSelection(document, selection);

    if (updatedCode) {
      await editor.edit((edit) => {
        const textRangeStart = selection.isEmpty
          ? document.lineAt(0).range.start
          : selection.start;
        const numberOfLines = lineCount - 1;
        const textRangeEnd = selection.isEmpty
          ? document.lineAt(numberOfLines).range.end
          : selection.end;
        const textRange = new Range(textRangeStart, textRangeEnd);
        edit.replace(textRange, updatedCode);
      });

      // clear selection
      const position = editor.selection.end;
      editor.selection = new Selection(position, position);
      if (getConfigValue("autoFormat")) {
        await commands.executeCommand("editor.action.formatDocument");
      }
    }
  };

  generateCode = async (
    editor: TextEditor,
    description: string
  ): Promise<void> => {
    const { languageId } = editor.document;
    const prompt = `Act as a code generator. Given a requirement in the form of a text description, you should output the code necessary to achieve that requirement. The output code should be very clean, simple, efficient and easily readable. Use best coding practices when generating code. The code output should be in a format that can be directly used in a codebase, so ensure that ONLY the code is present in your response. Do not output any descriptions/notes/usage examples, etc.
    Input: Use language: Python. Text description: function that returns sum of 2 numbers
    Code output:
    def sum_two_numbers(num1, num2):
      return num1 + num2
    
    Input: Use language: ${languageId}. Text description: ${description}
    Code output:`;

    const generatedCode = await window.withProgress(
      {
        location: ProgressLocation.Notification,
        title: "Processing...",
      },
      async () => this.openAiClient.getResponse(prompt)
    );

    if (!generatedCode) {
      this.logger.error("Empty response received from OpenAI");
      await window.showErrorMessage(`Vortex: Empty response received`);
      return;
    }

    await editor.edit((edit) => {
      edit.insert(editor.selection.start, generatedCode);
    });
    if (getConfigValue("autoFormat")) {
      await commands.executeCommand("editor.action.formatDocument");
    }
  };

  reviewCode = async (code: string): Promise<void> => {
    const prompt = `Act as an expert software engineer. Do a thorough review of the following code and respond with clear actionables on what could be improved: ${code}. Do not include code, just include the actionables in a list. Limit prose. Format your response in markdown. If there are no actionables, respond only with "The given code is already concise and efficient, and there are no obvious areas for improvement."
    Example output for reference:
    ## Review:
    1. Add input validation: The input function assumes that the user will enter a valid integer, but this may not always be the case. Adding input validation can address this issue.
    2. Use f-Strings: Instead of concatenating strings using the operator, use f-Strings for better readability and performance.`;

    const stream = this.openAiClient.getStreamedResponse(prompt);
    for await (const token of stream) {
      VortexOutputPanel.appendContent(token);
    }
  };
}
