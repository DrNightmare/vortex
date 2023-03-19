import { OpenAiClient } from "./open-ai-client";

export class Vortex {
  private openAiClient: OpenAiClient;

  constructor(openAiApiKey: string) {
    this.openAiClient = new OpenAiClient(openAiApiKey);
  }

  editCode = async (
    originalCode: string,
    editDescription: string
  ): Promise<string | null> => {
    const prompt = `Act as an expert software engineer. Update the below code with this edit description: ${editDescription}. Only do the requested edits. Preserve original code indentation. Include imports if necessary for code to function. Only output the code, do not provide descriptions.\n${originalCode.trim()}`;
    return this.openAiClient.getResponse(prompt);
  };

  generateCode = async (
    description: string,
    language: string
  ): Promise<string | null> => {
    const prompt = `Act as an expert software engineer. Generate ${language} code with this requirement: ${description}. Only output the code, do not provide descriptions or put backticks around the code. Include imports if necessary for code to function.
    Example output for reference:
    import random
    
    def fn():
      return random.choice([1, 2, 3])`;
    return this.openAiClient.getResponse(prompt);
  };

  reviewCode = async (code: string): Promise<string | null> => {
    const prompt = `Act as an expert software engineer. Do a thorough review of the following code and respond with clear actionables on what could be improved: ${code}. Do not include code, just include the actionables in a list. Limit prose. Format your response in markdown. If there are no actionables, respond only with "The given code is already concise and efficient, and there are no obvious areas for improvement."
    Example output for reference:
    ## Review:
    1. Add input validation: The input function assumes that the user will enter a valid integer, but this may not always be the case. Adding input validation can address this issue.
    2. Use f-Strings: Instead of concatenating strings using the operator, use f-Strings for better readability and performance.`;
    return this.openAiClient.getResponse(prompt);
  };
}
