import { createRouter } from "next-connect";
import controller from "infra/controller.js"; // Importa os manipuladores de erro e rota não encontrada
import user from "models/user.js"; // Importa o modelo de usuário

const router = createRouter();

router.get(getHandler); // Define a rota GET para buscar um usuário
router.patch(patchHandler); // Define a rota PATCH para atualizar um usuário

export default router.handler(controller.errorHandlers); // Exporta o manipulador de erros e rota não encontrada

async function getHandler(request, response) {
  const username = request.query.username;
  const userFound = await user.findOneByUsername(username); // Busca o usuário pelo username
  return response.status(200).json(userFound);
}

async function patchHandler(request, response) {
  const username = request.query.username;
  const userInputValues = request.body;

  const updateUser = await user.update(username, userInputValues); // Atualiza o usuário com os valores fornecidos
  return response.status(200).json(updateUser);
}
