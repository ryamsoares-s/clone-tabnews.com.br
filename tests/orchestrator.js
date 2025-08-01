import retry from "async-retry"; // Importa a biblioteca para tentar executar funções assíncronas várias vezes em caso de falha
import database from "infra/database.js"; // Importa o módulo de banco de dados para executar consultas SQL

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

const orchestrator = {
  waitForAllServices, // Exporta a função para ser usada em outros arquivos
  clearDatabase, // Exporta a função para limpar o banco de dados
};

export default orchestrator;
