import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";
import db from "node-pg-migrate/dist/db";

export default async function migrations(request, response) {
  const dbclient = await database.getNewClient(); // Obtém um novo cliente de banco de dados
  const defaultMigrationsOptions = {
    dbClient: dbclient, // Cliente de banco de dados para executar as migrações
    dryRun: true, // define uma execução dry run(teste)
    dir: join("infra", "migrations"), // Diretório onde as migrações estão localizadas
    // O Join é usado para garantir que o caminho seja resolvido corretamente, independentemente do sistema operacional
    direction: "up", // Direção da migração, "up" para aplicar as migrações
    verbose: true, // Ativa o modo verboso para logs detalhados
    migrationsTable: "pgmigrations", // Nome da tabela onde as migrações são registradas
  };

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(defaultMigrationsOptions);
    await dbclient.end(); // Fecha a conexão com o banco de dados
    return response.status(200).json(pendingMigrations); // Retorna 200 OK com as migrações pendentes
  }

  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions, // Copia as opções padrão
      dryRun: false, // Define que a execução não será dry run, ou seja, as migrações serão aplicadas de fato
    }); // Executa as migrações de fato, sem dry run

    await dbclient.end(); // Fecha a conexão com o banco de dados

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations); // Retorna 201 Created com as migrações aplicadas
    }
    return response.status(200).json(migratedMigrations); // Retorna 200 OK com as migrações pendentes
  }
  return response.status(405).end(); // Método não permitido, retorna 405
}
