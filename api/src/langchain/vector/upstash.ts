import { UpstashVectorStore } from '@langchain/community/vectorstores/upstash'
import { OpenAIEmbeddings } from '@langchain/openai'
import { Index } from '@upstash/vector'

let vectorStoreInstance: UpstashVectorStore | null = null

export async function getVectorStore(): Promise<UpstashVectorStore> {
  if (vectorStoreInstance) {
    return vectorStoreInstance
  }

  const url = process.env.UPSTASH_VECTOR_REST_URL
  const token = process.env.UPSTASH_VECTOR_REST_TOKEN

  if (!url || !token) {
    throw new Error(
      'UPSTASH_VECTOR_REST_URL and UPSTASH_VECTOR_REST_TOKEN must be set'
    )
  }

  const index = new Index({ url, token })

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  })

  vectorStoreInstance = new UpstashVectorStore(embeddings, { index })

  return vectorStoreInstance
}
