export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super("Um erro interno não esperado aconteceu.", {
      cause,
    });
    this.name = "InternalServerError"; // Define o nome do erro
    this.action = "Entre em contato com o suporte técnico."; // Ação recomendada para o usuário
    this.statusCode = statusCode || 500; // Define o código de status HTTP para este erro
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

export class ServiceError extends Error {
  constructor({ cause, message }) {
    super(message || "Serviço indisponível no momento.", {
      cause,
    });
    this.name = "ServiceError"; // Define o nome do erro
    this.action = "Verifique se o serviço está disponível."; // Ação recomendada para o usuário
    this.statusCode = 503; // Define o código de status HTTP para este erro
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

export class MethodNotAllowedError extends Error {
  constructor() {
    super("Método não permitido.");
    this.name = "MethodNotAllowedError"; // Define o nome do erro
    this.action = "Verifique se o método HTTP está correto."; // Ação recomendada para o usuário
    this.statusCode = 405; // Define o código de status HTTP para este erro
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
