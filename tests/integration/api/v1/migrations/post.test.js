import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  // Aguarda todos os serviços necessários estarem prontos antes de iniciar os testes
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public;");
  // Remove todo o schema 'public' (incluindo todas as tabelas e objetos) e recria o schema 'public' do zero no banco de dados
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response.status).toBe(201); // Verifica se o status é 201 Created

        const responseBody = await response.json();
        expect(Array.isArray(responseBody)).toBe(true); // Espera um array do response
        expect(responseBody.length).toBeGreaterThan(0); // Espera que o array não esteja vazio
      });
      test("For the second time", async () => {
        const response2 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response2.status).toBe(200);

        const response2Body = await response2.json();
        expect(Array.isArray(response2Body)).toBe(true); // Espera um array do response2
        expect(response2Body.length).toBe(0); // Espera que o array não esteja vazio
      });
    });
  });
});
