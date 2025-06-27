import { useEffect, useState } from "react";

// Importe dinamicamente para garantir que o Swagger UI seja carregado apenas no cliente
const SwaggerUI =
  typeof window !== "undefined" ? require("swagger-ui-react").default : null;
import "swagger-ui-react/swagger-ui.css"; // Estilos do Swagger UI

function DocsPage() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    // Busca a especificação OpenAPI do nosso endpoint API
    fetch("/api/v1/docs")
      .then((res) => res.json())
      .then((data) => setSpec(data))
      .catch((err) =>
        console.error("Erro ao buscar a especificação Swagger:", err),
      );
  }, []);

  if (!spec || !SwaggerUI) {
    // Verifica se a especificação foi carregada e se o SwaggerUI está disponível
    return <div>Carregando documentação...</div>; // Exibe uma mensagem de carregamento enquanto a especificação não está disponível
  }

  return (
    // Renderiza o Swagger UI com a especificação carregada
    <div>
      <SwaggerUI spec={spec} />
    </div>
  );
}

export default DocsPage; // Exporta a página DocsPage como o componente padrão
