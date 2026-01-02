export class ExpiredAuthenticationCode extends Error {
  constructor(message?: string) {
    super(message ?? 'Código de autenticação expirado.')
  }
}
