import database from "infra/database.js"; // Importa a função que conecta com o banco de dados

async function status(request, response) {
  const updateAt = new Date().toISOString(); // Pega a data e hora atual do servidor

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version; // Obtém a versão do banco de dados

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  ); //Perguntamos ao banco de dados qual é o número máximo de conexões permitidas
  const databaseMaxConnectionsValue = parseInt(
    databaseMaxConnectionsResult.rows[0].max_connections,
  ); // Converte para inteiro, pois o resultado vem como texto

  const databaseName = process.env.POSTGRES_DB; // Nome do banco de dados que estamos usando
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;", // Conta quantas conexões estão abertas no banco de dados
    values: [databaseName], // Passa o nome do banco de dados como parâmetro
  });
  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count; // Obtém o número de conexões abertas

  response.status(200).json({
    // Retornamos um status 200 (OK)

    updated_at: updateAt, // A data e hora da última atualização
    dependencies: {
      // Dependências do sistema
      database: {
        version: databaseVersionValue, // A versão do banco de dados
        max_connections: databaseMaxConnectionsValue, // O número máximo de conexões permitidas no banco de dados
        opened_connections: databaseOpenedConnectionsValue, // O número de conexões abertas no banco de dados
      },
    },
  });
}

export default status; // Exporta a função para que ela possa ser usada como uma rota de API
