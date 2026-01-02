import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { getVectorStore } from '../vector/upstash'

interface CreateLangchainOpenAIMessageInput {
  content: string
}

export async function createLangchainOpenAIMessage(
  input: CreateLangchainOpenAIMessageInput
) {
  const { content } = input

  // Search for relevant documents in vector store
  const vectorStore = await getVectorStore()
  const relevantDocs = await vectorStore.similaritySearch(content, 3)

  // Create context from relevant documents
  const context = relevantDocs
    .map((doc, index) => `${index + 1}. ${doc.pageContent}`)
    .join('\n\n')

  const systemMessage = new SystemMessage({
    content: `Você é um assistente ACME, uma IA especializada em fornecer suporte e respostas úteis.
    Seu objetivo é fornecer análises precisas e recomendações baseadas em evidências para apoiar a tomada de decisão.
    Utilize o contexto abaixo para formular a melhor resposta para a solicitação.

    Contexto:
    ${context}`,
  })

  const humanMessage = new HumanMessage({
    content,
  })

  return {
    systemMessage,
    humanMessage,
  }
}
