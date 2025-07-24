import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  // Aguarda todos os serviços necessários estarem prontos antes de iniciar os testes
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public;");
  // Remove todo o schema 'public' (incluindo todas as tabelas e objetos) e recria o schema 'public' do zero no banco de dados
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
