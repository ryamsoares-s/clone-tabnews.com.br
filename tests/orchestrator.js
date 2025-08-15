import retry from "async-retry"; // Importa a biblioteca para tentar executar funções assíncronas várias vezes em caso de falha
import database from "infra/database.js"; // Importa o módulo de banco de dados para executar consultas SQL
import migrator from "models/migrator";
import user from "models/user.js";
import { faker } from "@faker-js/faker/.";

// Função principal que aguarda todos os serviços necessários estarem prontos
async function waitForAllServices() {
  await waitForWebServer(); // Aguarda o servidor web estar disponível

  // Função que aguarda o servidor web responder corretamente
  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100, // Quantiondade de tentivas do retry
      maxTimeout: 1000, // Define o tempo entre uma tentativa e outra
    }); // Tenta várias vezes acessar a página de status

    // Função que faz uma requisição para o endpoint de status da API
    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status"); // Faz uma requisição HTTP para o endpoint de status
      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

async function clearDatabase() {
  // Limpa o banco de dados antes de iniciar os testes
  await database.query("drop schema public cascade; create schema public;");
  // Remove todo o schema 'public' (incluindo todas as tabelas e objetos) e recria o schema 'public' do zero no banco de dados
}

async function setupDatabase() {
  await database.query("CREATE EXTENSION IF NOT EXISTS unaccent;"); // Cria a extensão 'unaccent' se ela não existir, para permitir consultas sem acentos
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

async function createUser(userObject) {
  return await user.create({
    username:
      userObject?.username || faker.internet.username().replace(/[_.-]/g, ""),
    email: userObject?.email || faker.internet.email(),
    password: userObject?.password || "validpassword",
  });
}

const orchestrator = {
  waitForAllServices, // Exporta a função para ser usada em outros arquivos
  clearDatabase, // Exporta a função para limpar o banco de dados
  runPendingMigrations, // Exporta a função para executar migrações pendentes
  setupDatabase,
  createUser,
};

export default orchestrator;
