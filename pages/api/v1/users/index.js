import { createRouter } from "next-connect";
import controller from "infra/controller.js"; // Importa os manipuladores de erro e rota não encontrada
import user from "models/user.js"; // Importa o modelo de usuário

const router = createRouter();

router.post(postHandler); // Define a rota POST para executar migrações

export default router.handler(controller.errorHandlers); // Exporta o manipulador de erros e rota não encontrada

async function postHandler(request, response) {
  const userImputValues = request.body;
  const newUser = await user.create(userImputValues);
  return response.status(201).json(newUser); // Retorna 201 Created com o novo usuário
}
