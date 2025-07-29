import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  if (isLoading || !data) {
    return (
      <>
        <h1>Status</h1>
        <div>Carregando status...</div>
      </>
    );
  }

  return (
    <>
      <h1>Status</h1>
      <Updated_at updatedAt={data.updated_at} />

      <h2>Database</h2>
      <DatabaseStatus
        version={data.dependencies.database.version}
        maxConnections={data.dependencies.database.max_connections}
        openedConnections={data.dependencies.database.opened_connections}
      />
    </>
  );
}

function Updated_at({ updatedAt }) {
  const updatedAtText = new Date(updatedAt).toLocaleString();
  return <div>Última atualização: {updatedAtText}</div>;
}

function DatabaseStatus({ version, maxConnections, openedConnections }) {
  return (
    <div>
      <div>Versão do banco de dados: {version}</div>
      <div>Máximo de conexões: {maxConnections}</div>
      <div>Conexões abertas: {openedConnections}</div>
    </div>
  );
}
