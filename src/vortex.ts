import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";

export class Vortex {
  private openai: OpenAIApi | undefined;

  constructor(openAiApiKey: string) {
    const configuration = new Configuration({
      apiKey: openAiApiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  /**
   * Updates code with an edit description
   * @param {string} originalCode - The original code to be updated
   * @param {string} editDescription - The edit description to be applied to the code
   * @returns {string | null} The updated code
   */
  editCode = async (
    originalCode: string,
    editDescription: string
  ): Promise<string | null> => {
    if (!this.openai) {
      console.log("OpenAI not yet initialized");
      return null;
    }
    const prompt = `Act as an expert software engineer. Update the below code with this edit description: ${editDescription}. Only do the requested edits. Preserve original code indentation. Include imports if necessary for code to function. Only output the code, do not provide descriptions.\n${originalCode.trim()}`;
    try {
      const messages = [
        { role: ChatCompletionRequestMessageRoleEnum.User, content: prompt },
      ];
      const response = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
      });
      if (response.status !== 200) {
        console.log(`Non 2xx attempting to createCompletion: ${response.data}`);
        return null;
      }
      const updatedCode = response.data.choices[0].message?.content;
      return updatedCode ? updatedCode.trim() : null;
    } catch (error: any) {
      console.log(`Error attempting to createCompletion: ${error.message}`);
      return null;
    }
  };

  generateCode = async (
    description: string,
    language: string
  ): Promise<string | null> => {
    if (!this.openai) {
      console.log("OpenAI not yet initialized");
      return null;
    }
    const prompt = `Generate ${language} code with this description: ${description}. Only output the code, do not provide descriptions. Include imports if necessary for code to function.`;
    try {
      const messages = [
        { role: ChatCompletionRequestMessageRoleEnum.User, content: prompt },
      ];
      const response = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
      });
      if (response.status !== 200) {
        console.log(`Non 2xx attempting to createCompletion: ${response.data}`);
        return null;
      }
      const updatedCode = response.data.choices[0].message?.content;
      return updatedCode ? updatedCode.trim() : null;
    } catch (error: any) {
      console.log(`Error attempting to createCompletion: ${error.message}`);
      return null;
    }
  };

  reviewCode = async (code: string): Promise<string | null> => {
    if (!this.openai) {
      console.log("OpenAI not yet initialized");
      return null;
    }
    const prompt = `Act as an expert software engineer. Do a thorough review of the following code and respond with clear actionables on what could be improved: ${code}. Do not include code, just include the actionables in a list. Limit prose. Format your response in markdown.
    Example output for reference:
    ## Review:
    1. Add input validation: The input function assumes that the user will enter a valid integer, but this may not always be the case. Adding input validation can address this issue.
    2. Use f-Strings: Instead of concatenating strings using the operator, use f-Strings for better readability and performance.`;
    try {
      const messages = [
        { role: ChatCompletionRequestMessageRoleEnum.User, content: prompt },
      ];
      const response = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
      });
      if (response.status !== 200) {
        console.log(`Non 2xx attempting to createCompletion: ${response.data}`);
        return null;
      }
      const review = response.data.choices[0].message?.content;
      return review ? review.trim() : null;
    } catch (error: any) {
      console.log(`Error attempting to createCompletion: ${error.message}`);
      return null;
    }
  };
}
