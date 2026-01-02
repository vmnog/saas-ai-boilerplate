import { Index } from "@upstash/vector";
import { OpenAIEmbeddings } from "@langchain/openai";
import { UpstashVectorStore } from "@langchain/community/vectorstores/upstash";

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const indexWithCredentials = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL as string,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN as string,
});

export const UpstashVector = new UpstashVectorStore(embeddings, {
  index: indexWithCredentials,
});
