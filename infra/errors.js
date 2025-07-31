export class InternalServerError extends Error {
  constructor({ cause }) {
    super("Um erro interno não esperado aconteceu.", {
      cause,
    });
    this.name = "InternalServerError"; // Define o nome do erro
    this.action = "Entre em contato com o suporte técnico."; // Ação recomendada para o usuário
    this.statusCode = 500; // Define o código de status HTTP para este erro
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
