import { env } from "@/env";
import { ChatOpenAI } from "@langchain/openai";

export const langchainOpenAIClient = new ChatOpenAI({
  model: "gpt-4-turbo",
  apiKey: env.OPENAI_API_KEY,
});
