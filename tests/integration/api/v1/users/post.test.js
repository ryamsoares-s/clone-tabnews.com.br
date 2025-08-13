import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";
import user from "models/user.js";
import password from "models/password.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices(); // Aguarda todos os serviços necessários estarem prontos antes de iniciar os testes
  await orchestrator.clearDatabase(); // Limpa o banco de dados antes de iniciar os testes
  await orchestrator.setupDatabase(); // Configura o banco de dados, criando extensões necessárias
  await orchestrator.runPendingMigrations(); // Executa as migrações pendentes
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "Ryam",
          email: "ryam.s.silva@gmail.com",
          password: "ryam123",
        }),
      });
      expect(response.status).toBe(201); // Verifica se o status é 201 Created

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "Ryam",
        email: "ryam.s.silva@gmail.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4); // Verifica se o ID é um UUID v4
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const userInDataBase = await user.findOneByUsername("Ryam");
      const correctPasswordMatch = await password.compare(
        "ryam123",
        userInDataBase.password,
      );

      expect(correctPasswordMatch).toBe(true);

      const incorrectPasswordMatch = await password.compare(
        "senhaIncorreta",
        userInDataBase.password,
      );

      expect(incorrectPasswordMatch).toBe(false);
    });

    test("With duplicated 'email'", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailDuplicated1",
          email: "duplicado@gmail.com",
          password: "ryam123",
        }),
      });
      expect(response1.status).toBe(201); // Verifica se o status é 201 Created

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailDuplicated2",
          email: "DuplIcaDo@gmail.com",
          password: "ryam123",
        }),
      });
      expect(response2.status).toBe(400); // Verifica se o status é 400 Bad Request

      const response2Body = await response2.json();
      expect(response2Body).toEqual({
        name: "ValidationError",
        message: "O email já está sendo utilizado.",
        action: "Utilize outro email para realizar o cadastro.",
        status_code: 400,
      });
    });

    test("With duplicated 'username'", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "Lívia",
          email: "usernameDuplicado1@gmail.com",
          password: "ryam123",
        }),
      });
      expect(response1.status).toBe(201); // Verifica se o status é 201 Created

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "Livia",
          email: "usernameDuplicado2@gmail.com",
          password: "ryam123",
        }),
      });
      expect(response2.status).toBe(400); // Verifica se o status é 400 Bad Request

      const response2Body = await response2.json();
      expect(response2Body).toEqual({
        name: "ValidationError",
        message: "O username já está sendo utilizado.",
        action: "Utilize outro username para realizar o cadastro.",
        status_code: 400,
      });
    });
  });
});
