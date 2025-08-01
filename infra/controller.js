import { InternalServerError, MethodNotAllowedError } from "infra/errors.js";

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError(); // Cria um erro de método não permitido
  response.status(publicErrorObject.statusCode).json(publicErrorObject); // Retorna um erro 405 (Método Não Permitido) se a rota não for encontrada
}

function onErrorHandler(error, request, response) {
  const publicErrorObject = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });

  console.error(publicErrorObject);

  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller; // Exporta o controlador para ser usado nas rotas de API
