import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  // Aguarda todos os serviços necessários estarem prontos antes de iniciar os testes
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase(); // Limpa o banco de dados antes de iniciar os testes
});

describe("DELETE /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Deleting pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "DELETE",
      });

      expect(response.status).toBe(405);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "MethodNotAllowedError",
        message: "Método não permitido.",
        action: "Verifique se o método HTTP está correto.",
        status_code: 405,
      });
    });
  });
});
