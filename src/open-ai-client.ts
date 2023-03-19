import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";

enum Model {
  gpt35Turbo = "gpt-3.5-turbo",
}

export class OpenAiClient {
  private openai: OpenAIApi | undefined;

  constructor(openAiApiKey: string) {
    const configuration = new Configuration({
      apiKey: openAiApiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async getResponse(prompt: string) {
    if (!this.openai) {
      throw new Error("OpenAI is not initialized yet");
    }

    const messages = [
      { role: ChatCompletionRequestMessageRoleEnum.User, content: prompt },
    ];
    const response = await this.openai.createChatCompletion({
      model: Model.gpt35Turbo,
      messages,
    });
    if (response.status !== 200) {
      console.error(
        `Non 2xx attempting to createCompletion: ${response.status}, ${response.data}`
      );
      return null;
    }
    const content = response.data.choices[0].message?.content;
    return content ? content.trim() : null;
  }
}
