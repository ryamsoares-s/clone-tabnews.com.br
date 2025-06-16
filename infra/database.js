import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST, // ACESSANDO A VARIÁVEL DE AMBIENTE
    port: process.env.POSTGRES_PORT, // ACESSANDO A VARIÁVEL DE AMBIENTE
    user: process.env.POSTGRES_USER, // ACESSANDO A VARIÁVEL DE AMBIENTE
    database: process.env.POSTGRES_DB, // ACESSANDO A VARIÁVEL DE AMBIENTE
    password: process.env.POSTGRES_PASSWORD, // ACESSANDO A VARIÁVEL DE AMBIENTE
    ssl: process.env.NODE_ENV ? false : true, // Habilita SSL para conexões seguras
  });

  try {
    // Tenta conectar ao banco de dados
    await client.connect();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    // Se ocorrer um erro, ele será capturado aqui
    console.error("Database query error:", error);
    throw error; // Lança o erro para que possa ser tratado onde a função for chamada
  } finally {
    // Independentemente de ter ocorrido um erro ou não, o cliente será desconectado
    await client.end();
  }
}

export default {
  query: query,
};
