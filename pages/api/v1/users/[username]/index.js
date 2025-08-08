import { createRouter } from "next-connect";
import controller from "infra/controller.js"; // Importa os manipuladores de erro e rota não encontrada
import user from "models/user.js"; // Importa o modelo de usuário

const router = createRouter();

router.get(getHandler); // Define a rota GET para buscar um usuário

export default router.handler(controller.errorHandlers); // Exporta o manipulador de erros e rota não encontrada

async function getHandler(request, response) {
  const username = request.query.username;
  const userFound = await user.findOneByUsername(username); // Busca o usuário pelo username
  return response.status(200).json(userFound);
}
