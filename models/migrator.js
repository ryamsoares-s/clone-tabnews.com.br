import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import { log } from "node:console";

const defaultMigrationsOptions = {
  dryRun: true, // define uma execução dry run(teste)
  dir: resolve("infra", "migrations"), // Diretório onde as migrações estão localizadas
  // O Join é usado para garantir que o caminho seja resolvido corretamente, independentemente do sistema operacional
  direction: "up", // Direção da migração, "up" para aplicar as migrações
  log: () => {}, // Função de log que não faz nada
  migrationsTable: "pgmigrations", // Nome da tabela onde as migrações são registradas
};

async function listPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient(); // Obtém um novo cliente de banco de dados

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient, // Usa o cliente de banco de dados obtido
    });
    return pendingMigrations; // Retorna as migrações pendentes
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient(); // Obtém um novo cliente de banco de dados

    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions, // Copia as opções padrão
      dbClient, // Usa o cliente de banco de dados obtido
      dryRun: false, // Define que a execução não será dry run, ou seja, as migrações serão aplicadas de fato
    });
    return migratedMigrations; // Retorna as migrações que foram aplicadas
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations, // Exporta a função para listar migrações pendentes
  runPendingMigrations, // Exporta a função para executar migrações pendentes
};

export default migrator; // Exporta o objeto migrator para ser usado em outros módulos
