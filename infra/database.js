import { Client } from "pg";
import { ServiceError } from "./errors.js";

async function query(queryObject) {
  let client;
  // Cria um novo cliente de banco de dados
  try {
    client = await getNewClient();
    // Tenta conectar ao banco de dados e executar a consulta
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    const publicErrorObject = new ServiceError({
      message: "Erro na conexão com banco de dados ou na Query.",
      cause: error,
    });
    throw publicErrorObject; // Lança o erro para que possa ser tratado onde a função for chamada
  } finally {
    // Independentemente de ter ocorrido um erro ou não, o cliente será desconectado
    await client?.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST, // ACESSANDO A VARIÁVEL DE AMBIENTE
    port: process.env.POSTGRES_PORT, // ACESSANDO A VARIÁVEL DE AMBIENTE
    user: process.env.POSTGRES_USER, // ACESSANDO A VARIÁVEL DE AMBIENTE
    database: process.env.POSTGRES_DB, // ACESSANDO A VARIÁVEL DE AMBIENTE
    password: process.env.POSTGRES_PASSWORD, // ACESSANDO A VARIÁVEL DE AMBIENTE
    ssl: getSSLValues(), // Habilita SSL para conexões seguras
  });

  await client.connect();
  return client; // Retorna o cliente conectado para uso posterior
}

const database = {
  query, // Exporta a função de consulta para ser usada em outros módulos
  getNewClient, // Exporta a função para criar um novo cliente
};

export default database;

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA, // CA do certificado SSL
    };
  }
  return process.env.NODE_ENV === "production" ? true : false; // Habilita SSL em produção, desabilita em desenvolvimento
}
