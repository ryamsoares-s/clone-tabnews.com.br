/**
 * @swagger
 * /migrations:
 *   get:
 *     summary: Lista migrações pendentes do banco de dados
 *     description: Retorna as migrações pendentes sem aplicá-las (dry run).
 *     responses:
 *       200:
 *        description: Migrações pendentes.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  path:
 *                    type: string
 *                    example: "infra/migrations/1750267961053_teste-migration.js"
 *                  name:
 *                    type: string
 *                    example: "1750267961053_teste-migration"
 *                  timestamp:
 *                    type: string
 *                    format: date-time
 *                    nullable: true
 *                    example: "1750267961053"
 *
 *   post:
 *     summary: Executa migrações pendentes do banco de dados
 *     description: Executa as migrações pendentes e retorna o resultado.
 *     responses:
 *       201:
 *         description: Migrações aplicadas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       200:
 *         description: Nenhuma migração pendente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       405:
 *         description: Método não permitido.
 */
import { createRouter } from "next-connect";
import controller from "infra/controller.js"; // Importa os manipuladores de erro e rota não encontrada
import migrator from "models/migrator.js"; // Importa o modelo de migração

const router = createRouter();

router.get(getHandler); // Define a rota GET para listar migrações pendentes
router.post(postHandler); // Define a rota POST para executar migrações

export default router.handler(controller.errorHandlers); // Exporta o manipulador de erros e rota não encontrada

async function getHandler(request, response) {
  const pendingMigrations = await migrator.listPendingMigrations(); // Lista as migrações pendentes

  return response.status(200).json(pendingMigrations); // Retorna 200 OK com as migrações pendentes
}

async function postHandler(request, response) {
  const migratedMigrations = await migrator.runPendingMigrations(); // Executa as migrações pendentes

  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations); // Retorna 201 Created com as migrações aplicadas
  }
  return response.status(200).json(migratedMigrations); // Retorna 200 OK com as migrações pendentes
}
