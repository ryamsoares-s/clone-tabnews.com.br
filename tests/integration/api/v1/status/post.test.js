import orchestrator from "tests/orchestrator.js";

// Executa antes de todos os testes
beforeAll(async () => {
  // Aguarda todos os serviços necessários estarem prontos antes de iniciar os testes
  await orchestrator.waitForAllServices();
});

describe("POST /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status", {
        method: "POST",
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
