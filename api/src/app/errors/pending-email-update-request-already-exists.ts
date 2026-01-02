export class PendingEmailUpdateRequestAlreadyExists extends Error {
  constructor(message?: string) {
    super(
      message ?? 'Já existe uma alteração de e-mail pendente para esse usuário.'
    )
  }
}
