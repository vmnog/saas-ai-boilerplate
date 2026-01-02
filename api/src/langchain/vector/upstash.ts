import { UpstashVectorStore } from "@langchain/community/vectorstores/upstash";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Index } from "@upstash/vector";

const index = new Index({
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    url: process.env.UPSTASH_REDIS_REST_URL!,
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
});

export async function createVectorStore() {
    return new UpstashVectorStore(
        embeddings,
        {
            index,
        }
    );
}

export const vectorStore = await createVectorStore(); 