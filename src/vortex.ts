import { window, ProgressLocation, TextEditor } from "vscode";
import { OpenAiClient } from "./open-ai-client";

export class Vortex {
  private openAiClient: OpenAiClient;

  constructor(openAiApiKey: string) {
    this.openAiClient = new OpenAiClient(openAiApiKey);
  }

  editCode = async (originalCode: string, editDescription: string) => {
    const prompt = `Act as an expert software engineer. Update the below code with this edit description: ${editDescription}. Only do the requested edits. Preserve original code indentation. Include imports if necessary for code to function. Only output the code, do not provide descriptions.\n${originalCode.trim()}`;
    return await window.withProgress(
      {
        location: ProgressLocation.Notification,
        title: "Processing...",
      },
      async () => this.openAiClient.getResponse(prompt)
    );
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
      await window.showErrorMessage(
        `There was an issue processing with Vortex`
      );
      return;
    }

    await editor.edit((edit) => {
      edit.insert(editor.selection.start, generatedCode);
    });
  };

  reviewCode = async (code: string): Promise<string | null> => {
    const prompt = `Act as an expert software engineer. Do a thorough review of the following code and respond with clear actionables on what could be improved: ${code}. Do not include code, just include the actionables in a list. Limit prose. Format your response in markdown. If there are no actionables, respond only with "The given code is already concise and efficient, and there are no obvious areas for improvement."
    Example output for reference:
    ## Review:
    1. Add input validation: The input function assumes that the user will enter a valid integer, but this may not always be the case. Adding input validation can address this issue.
    2. Use f-Strings: Instead of concatenating strings using the operator, use f-Strings for better readability and performance.`;
    return await window.withProgress(
      {
        location: ProgressLocation.Notification,
        title: "Processing...",
      },
      async () => this.openAiClient.getResponse(prompt)
    );
  };
}
