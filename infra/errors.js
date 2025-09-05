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

export class ValidationError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Um erro de validação ocorreu.", {
      cause,
    });
    this.name = "ValidationError"; // Define o nome do erro
    this.action = action || "Ajuste os dados enviados e tente novamente."; // Ação recomendada para o usuário
    this.statusCode = 400; // Define o código de status HTTP para este erro
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

export class NotFoundError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Não foi possível encontrar o recurso solicitado.", {
      cause,
    });
    this.name = "NotFoundError"; // Define o nome do erro
    this.action =
      action ||
      "Verifique se os parâmetros enviados na consulta estão corretos."; // Ação recomendada para o usuário
    this.statusCode = 404; // Define o código de status HTTP para este erro
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

export class UnauthorizedError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Usuário não autenticado.", {
      cause,
    });
    this.name = "UnauthorizedError";
    this.action =
      action ||
      "Verifique se as credenciais estão corretas e faça o login novamente.";
    this.statusCode = 401;
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
