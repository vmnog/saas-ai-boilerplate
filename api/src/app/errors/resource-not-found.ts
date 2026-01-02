export class ResourceNotFound extends Error {
  constructor(message?: string) {
    super(message ?? 'Recurso não encontrado.')
  }
}
