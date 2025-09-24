import { version as uuidVersion } from "uuid";
import setCookieParser from "set-cookie-parser";
import orchestrator from "tests/orchestrator.js";
import session from "models/session";

beforeAll(async () => {
  await orchestrator.waitForAllServices(); // Aguarda todos os serviços necessários estarem prontos antes de iniciar os testes
  await orchestrator.clearDatabase(); // Limpa o banco de dados antes de iniciar os testes
  await orchestrator.setupDatabase(); // Configura o banco de dados, criando extensões necessárias
  await orchestrator.runPendingMigrations(); // Executa as migrações pendentes
});

describe("GET /api/v1/user", () => {
  describe("Default user", () => {
    test("With valid session", async () => {
      const createUser1 = await orchestrator.createUser({
        username: "UserWithValidSession",
      });

      const sessionObject = await orchestrator.createSession(createUser1.id);

      const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });

      expect(response.status).toBe(200);

      const cacheControl = response.headers.get("Cache-Control");
      expect(cacheControl).toBe(
        "no-store, no-cache, max-age=0, must-revalidate",
      );

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: createUser1.id,
        username: "UserWithValidSession",
        email: createUser1.email,
        password: createUser1.password,
        created_at: createUser1.created_at.toISOString(),
        updated_at: createUser1.updated_at.toISOString(),
      });

      expect(uuidVersion(responseBody.id)).toBe(4); // Verifica se o ID é um UUID v4
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      // Session renew assertions
      const renewedSessionObject = await session.findOneValidByToken(
        sessionObject.token,
      );

      expect(renewedSessionObject.expires_at > sessionObject.expires_at).toBe(
        true,
      );

      expect(renewedSessionObject.updated_at > sessionObject.updated_at).toBe(
        true,
      );

      // Set-Cookie assertions
      const parsedSetCookie = setCookieParser(response, { map: true });

      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: renewedSessionObject.token,
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
        path: "/",
        httpOnly: true,
      });
    });

    test("With nonexistent session", async () => {
      const nonexistentToken =
        "9d2383504b66e467177042821be920ea2115da806b07b01b915510fae26009dfe73624119b967c60f2068a58d4eef97e";

      const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${nonexistentToken}`,
        },
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não possui sessão ativa.",
        action: "Verifique se este usuário está logado e tente novamente.",
        status_code: 401,
      });

      // Set-Cookie assertions
      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });

      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: "invalid",
        maxAge: -1,
        path: "/",
        httpOnly: true,
      });
    });

    test("With expired session", async () => {
      jest.useFakeTimers({
        now: new Date(Date.now() - session.EXPIRATION_IN_MILLISECONDS),
      });

      // Cria um usuário e uma sessão para esse usuário

      const createUser1 = await orchestrator.createUser({
        username: "UserWithExpiredSession",
      });

      const sessionObject = await orchestrator.createSession(createUser1.id);

      jest.useRealTimers();
      // Tenta acessar o endpoint com a sessão expirada

      const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });

      expect(response.status).toBe(401);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "Usuário não possui sessão ativa.",
        action: "Verifique se este usuário está logado e tente novamente.",
        status_code: 401,
      });

      // Set-Cookie assertions
      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });

      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: "invalid",
        maxAge: -1,
        path: "/",
        httpOnly: true,
      });
    });

    test("With session about to expire", async () => {
      jest.useFakeTimers({
        now: new Date(
          Date.now() -
            (session.EXPIRATION_IN_MILLISECONDS -
              session.EXPIRATION_WARNING_THRESHOLD_MS),
        ),
      });

      // Cria um usuário e uma sessão para esse usuário
      const createUser1 = await orchestrator.createUser({
        username: "UserWithSessionAboutToExpire",
      });

      const sessionObject = await orchestrator.createSession(createUser1.id);

      jest.useRealTimers();

      const response = await fetch("http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: createUser1.id,
        username: "UserWithSessionAboutToExpire",
        email: createUser1.email,
        password: createUser1.password,
        created_at: createUser1.created_at.toISOString(),
        updated_at: createUser1.updated_at.toISOString(),
      });

      expect(uuidVersion(responseBody.id)).toBe(4); // Verifica se o ID é um UUID v4
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      // Session renew assertions
      const renewedSessionObject = await session.findOneValidByToken(
        sessionObject.token,
      );

      expect(renewedSessionObject.expires_at > sessionObject.expires_at).toBe(
        true,
      );

      expect(renewedSessionObject.updated_at > sessionObject.updated_at).toBe(
        true,
      );

      // Set-Cookie assertions
      const parsedSetCookie = setCookieParser(response, { map: true });

      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: renewedSessionObject.token,
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
        path: "/",
        httpOnly: true,
      });
    });
  });
});
