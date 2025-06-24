import database from "infra/database.js";

beforeAll(cleanDatabase);
async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

test("POST to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response.status).toBe(201); // Verifica se o status é 201 Created

  const responseBody = await response.json();
  expect(Array.isArray(responseBody)).toBe(true); // Espera um array do response
  expect(responseBody.length).toBeGreaterThan(0); // Espera que o array não esteja vazio

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response2.status).toBe(200);

  const response2Body = await response2.json();
  expect(Array.isArray(response2Body)).toBe(true); // Espera um array do response2
  expect(response2Body.length).toBe(0); // Espera que o array não esteja vazio
});
