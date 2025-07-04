import orchestrator from "tests/orchestrator.js";

// Executa antes de todos os testes
beforeAll(async () => {
  // Aguarda todos os serviços necessários estarem prontos antes de iniciar os testes
  await orchestrator.waitForAllServices();
});

test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined(); // VERIFICA SE UPDATE_AT ESTÁ DEFINIDO

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt); // VERIFICA SE UPDATE_AT É UM ISO STRING E SE É IGUAL AO PARSED_UPDATED_AT

  expect(responseBody.dependencies.database.version).toEqual("16.0"); // VERIFICA SE A VERSÃO DO BANCO DE DADOS É DE FATO A UTILIZADA
  expect(responseBody.dependencies.database.max_connections).toEqual(100);
  expect(responseBody.dependencies.database.opened_connections).toEqual(1);
});
