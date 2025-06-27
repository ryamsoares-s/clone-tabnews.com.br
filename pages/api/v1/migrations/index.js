/**
 * @swagger
 * /api/v1/migrations:
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

import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";
import db from "node-pg-migrate/dist/db";

export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"]; // Métodos permitidos para esta rota
  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method "${request.method}" Not Allowed`, // Mensagem de erro para método não permitido
      allowedMethods: allowedMethods, // Lista de métodos permitidos
    }); // Retorna 405 se o método não for permitido
  }

  let dbClient;

  try {
    dbClient = await database.getNewClient(); // Obtém um novo cliente de banco de dados
    const defaultMigrationsOptions = {
      dbClient: dbClient, // Cliente de banco de dados para executar as migrações
      dryRun: true, // define uma execução dry run(teste)
      dir: join("infra", "migrations"), // Diretório onde as migrações estão localizadas
      // O Join é usado para garantir que o caminho seja resolvido corretamente, independentemente do sistema operacional
      direction: "up", // Direção da migração, "up" para aplicar as migrações
      verbose: true, // Ativa o modo verboso para logs detalhados
      migrationsTable: "pgmigrations", // Nome da tabela onde as migrações são registradas
    };

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationsOptions);
      return response.status(200).json(pendingMigrations); // Retorna 200 OK com as migrações pendentes
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationsOptions, // Copia as opções padrão
        dryRun: false, // Define que a execução não será dry run, ou seja, as migrações serão aplicadas de fato
      }); // Executa as migrações de fato, sem dry run

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations); // Retorna 201 Created com as migrações aplicadas
      }
      return response.status(200).json(migratedMigrations); // Retorna 200 OK com as migrações pendentes
    }
  } catch (error) {
    console.error(error); // Log de erro no console
    throw error; // Lança o erro para ser tratado por um middleware de erro global
  } finally {
    await dbClient.end(); // Encerra a conexão com o banco de dados
  }
}
