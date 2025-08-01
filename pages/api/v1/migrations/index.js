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
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import controller from "infra/controller.js"; // Importa os manipuladores de erro e rota não encontrada
import db from "node-pg-migrate/dist/db";

const router = createRouter();

router.get(getHandler); // Define a rota GET para listar migrações pendentes
router.post(postHandler); // Define a rota POST para executar migrações

export default router.handler(controller.errorHandlers); // Exporta o manipulador de erros e rota não encontrada

const defaultMigrationsOptions = {
  dryRun: true, // define uma execução dry run(teste)
  dir: resolve("infra", "migrations"), // Diretório onde as migrações estão localizadas
  // O Join é usado para garantir que o caminho seja resolvido corretamente, independentemente do sistema operacional
  direction: "up", // Direção da migração, "up" para aplicar as migrações
  verbose: true, // Ativa o modo verboso para logs detalhados
  migrationsTable: "pgmigrations", // Nome da tabela onde as migrações são registradas
};

async function getHandler(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient(); // Obtém um novo cliente de banco de dados

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient, // Usa o cliente de banco de dados obtido
    });
    return response.status(200).json(pendingMigrations); // Retorna 200 OK com as migrações pendentes
  } finally {
    await dbClient?.end();
  }
}

async function postHandler(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient(); // Obtém um novo cliente de banco de dados

    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions, // Copia as opções padrão
      dbClient, // Usa o cliente de banco de dados obtido
      dryRun: false, // Define que a execução não será dry run, ou seja, as migrações serão aplicadas de fato
    });

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations); // Retorna 201 Created com as migrações aplicadas
    }
    return response.status(200).json(migratedMigrations); // Retorna 200 OK com as migrações pendentes
  } finally {
    await dbClient?.end();
  }
}
