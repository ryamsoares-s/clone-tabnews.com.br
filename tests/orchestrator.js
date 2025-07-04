import retry from "async-retry"; // Importa a biblioteca para tentar executar funções assíncronas várias vezes em caso de falha

// Função principal que aguarda todos os serviços necessários estarem prontos
async function waitForAllServices() {
  await waitForWebServer(); // Aguarda o servidor web estar disponível

  // Função que aguarda o servidor web responder corretamente
  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100, // Quantiondade de tentivas do retry
    }); // Tenta várias vezes acessar a página de status

    // Função que faz uma requisição para o endpoint de status da API
    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status"); // Faz uma requisição HTTP para o endpoint de status
      const responseBody = await response.json(); // Converte a resposta para JSON (não está sendo usada, mas pode ser útil para validações)
    }
  }
}

export default {
  waitForAllServices, // Exporta a função para ser usada em outros arquivos
};
