import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST, // CRIANDO AQUI A VARIÁVEL DE AMBIENTE
    port: process.env.POSTGRES_PORT, // CRIANDO AQUI A VARIÁVEL DE AMBIENTE
    user: process.env.POSTGRES_USER, // CRIANDO AQUI A VARIÁVEL DE AMBIENTE
    database: process.env.POSTGRES_DB, // CRIANDO AQUI A VARIÁVEL DE AMBIENTE
    password: process.env.POSTGRES_PASSWORD, // CRIANDO AQUI A VARIÁVEL DE AMBIENTE
  });
  await client.connect();
  const result = await client.query(queryObject);
  await client.end();
  return result;
}

export default {
  query: query,
};
