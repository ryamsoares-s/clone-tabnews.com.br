import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices(); // Aguarda todos os serviços necessários estarem prontos antes de iniciar os testes
  await orchestrator.clearDatabase(); // Limpa o banco de dados antes de iniciar os testes
  await orchestrator.setupDatabase(); // Configura o banco de dados, criando extensões necessárias
  await orchestrator.runPendingMigrations(); // Executa as migrações pendentes
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      const createUser1 = await orchestrator.createUser({
        username: "MesmoCase",
      });

      const response2 = await fetch(
        `http://localhost:3000/api/v1/users/MesmoCase`,
      );
      expect(response2.status).toBe(200);

      const response2Body = await response2.json();
      expect(response2Body).toEqual({
        id: response2Body.id,
        username: "MesmoCase",
        email: createUser1.email,
        password: response2Body.password,
        created_at: response2Body.created_at,
        updated_at: response2Body.updated_at,
      });

      expect(uuidVersion(response2Body.id)).toBe(4); // Verifica se o ID é um UUID v4
      expect(Date.parse(response2Body.created_at)).not.toBeNaN();
      expect(Date.parse(response2Body.updated_at)).not.toBeNaN();
    });

    test("With case mismatch", async () => {
      const createUser1 = await orchestrator.createUser({
        username: "CaseDiferente",
      });

      const response2 = await fetch(
        `http://localhost:3000/api/v1/users/casediFerEnTE`,
      );
      expect(response2.status).toBe(200);

      const response2Body = await response2.json();
      expect(response2Body).toEqual({
        id: response2Body.id,
        username: "CaseDiferente",
        email: createUser1.email,
        password: response2Body.password,
        created_at: response2Body.created_at,
        updated_at: response2Body.updated_at,
      });

      expect(uuidVersion(response2Body.id)).toBe(4); // Verifica se o ID é um UUID v4
      expect(Date.parse(response2Body.created_at)).not.toBeNaN();
      expect(Date.parse(response2Body.updated_at)).not.toBeNaN();
    });

    test("With nonexistent username", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/UsuarioInexistente",
      );
      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "Usuário não encontrado.",
        action: "Verifique o username e tente novamente.",
        status_code: 404,
      });
    });
  });
});
