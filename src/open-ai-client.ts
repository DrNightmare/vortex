import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";
import { getConfigValue } from "./utils";
import { Logger } from "./logger";

enum Model {
  gpt35Turbo = "gpt-3.5-turbo",
}

export class OpenAiClient {
  private openai: OpenAIApi;
  private logger: Logger;

  constructor(openAiApiKey: string) {
    const configuration = new Configuration({
      apiKey: openAiApiKey,
    });
    this.logger = Logger.getInstance();
    this.openai = new OpenAIApi(configuration);
    this.logger.info("OpenAiClient instantiated successfully");
  }

  private getTimeout() {
    const configTimeout = getConfigValue("requestTimeout");
    return Number(configTimeout ?? 10) * 1000;
  }

  async getResponse(prompt: string) {
    const messages = [
      { role: ChatCompletionRequestMessageRoleEnum.User, content: prompt },
    ];

    try {
      this.logger.debug("Making request to createChatCompletion..");
      const response = await this.openai.createChatCompletion(
        {
          model: Model.gpt35Turbo,
          messages,
        },
        { timeout: this.getTimeout() }
      );
      const content = response.data.choices[0].message?.content;
      this.logger.debug(`Received response content: ${content}`);
      return content ? content.trim() : null;
    } catch (err: any) {
      this.logger.error(`Error with createChatCompletion: ${err.message}`);
    }
  }
}
