export class UserAlreadyExists extends Error {
  constructor(message?: string) {
    super(message ?? 'Esse usuário já está cadastrado.')
  }
}
