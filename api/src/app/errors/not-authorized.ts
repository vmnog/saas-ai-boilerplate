export class NotAuthorized extends Error {
    constructor(message?: string) {
        super(message ?? 'Não autorizado.')
    }
}
