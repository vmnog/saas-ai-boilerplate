export class ThreadAlreadyExists extends Error {
  constructor(message?: string) {
    super(
      message ?? 'Já existe uma thread registrada com esse openaiThreadId.'
    )
  }
}
