import swaggerSpec from "docs/swaggerConfig"; // caminho do arquivo de configuração do Swagger

export default function handler(request, response) {
  response.setHeader("Content-Type", "application/json");
  response.status(200).send(swaggerSpec); // Envia a especificação OpenAPI como resposta JSON
}
