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

  if (isLoading) {
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
      <UpdatedAt updatedAt={data.updated_at} />

      <h1>Database</h1>
      <Version version={data.dependencies.database.version} />
      <MaxConnections
        maxConnections={data.dependencies.database.max_connections}
      />
      <OpenedConnections
        openedConnections={data.dependencies.database.opened_connections}
      />
    </>
  );
}

function UpdatedAt({ updatedAt }) {
  const updatedAtText = new Date(updatedAt).toLocaleString();
  return <div> Última atualização: {updatedAtText}</div>;
}

function Version({ version }) {
  return <div> Versão do banco de dados: {version}</div>;
}

function MaxConnections({ maxConnections }) {
  return <div> Máximo de conexões: {maxConnections}</div>;
}

function OpenedConnections({ openedConnections }) {
  return <div> Conexões abertas: {openedConnections}</div>;
}
