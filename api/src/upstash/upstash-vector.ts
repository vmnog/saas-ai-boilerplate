import { UpstashVectorStore } from '@langchain/community/vectorstores/upstash'
import { OpenAIEmbeddings } from '@langchain/openai'
import { Index } from '@upstash/vector'

let upstashVectorInstance: UpstashVectorStore | null = null

export function getUpstashVector(): UpstashVectorStore {
  if (upstashVectorInstance) {
    return upstashVectorInstance
  }

  const url = process.env.UPSTASH_VECTOR_REST_URL
  const token = process.env.UPSTASH_VECTOR_REST_TOKEN

  if (!url || !token) {
    throw new Error(
      'UPSTASH_VECTOR_REST_URL and UPSTASH_VECTOR_REST_TOKEN must be set'
    )
  }

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  })

  const indexWithCredentials = new Index({ url, token })

  upstashVectorInstance = new UpstashVectorStore(embeddings, {
    index: indexWithCredentials,
  })

  return upstashVectorInstance
}
