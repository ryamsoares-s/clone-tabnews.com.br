import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  // Aguarda todos os serviços necessários estarem prontos antes de iniciar os testes
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase(); // Limpa o banco de dados antes de iniciar os testes
});

describe("GET /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Retrieving pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations");
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true); // Espera um array do response
      expect(responseBody.length).toBeGreaterThan(0); // Espera que o array não esteja vazio
    });
  });
});
