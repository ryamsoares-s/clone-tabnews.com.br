const swaggerJsdoc = require("swagger-jsdoc");

// Configuração do Swagger para a API Next.js

const environment = process.env.NODE_ENV || "development"; // Define o ambiente, padrão é 'development'
const port = process.env.PORT || 3000; // Define a porta, padrão é 3000

let baseUrl = {
  url: "",
  description: "",
};

switch (environment) {
  case "production":
    baseUrl.url = "https://clone-tabnews-com-br.vercel.app/api/v1"; // URL base da API em produção
    baseUrl.description = "Ambiente de Produção";
    break;
  case "development":
    baseUrl.url = `http://localhost:${port}/api/v1`; // URL base da API em desenvolvimento
    baseUrl.description = "Ambiente de Desenvolvimento";
    break;
  case "staging":
    baseUrl.url =
      "https://clone-tabnews-com-br-git-staging-playryam-gmailcoms-projects.vercel.app/api/v1"; // URL base da API em staging
    baseUrl.description = "Ambiente de Staging";
    break;
  default:
    baseUrl.url = "http://localhost:3000/api/v1"; // URL base da API em desenvolvimento
    baseUrl.description = "Ambiente de Desenvolvimento";
    break;
}

const options = {
  definition: {
    openapi: "3.0.0", // Versão do OpenAPI
    info: {
      title: "Minha API Next.js (V1)", // Você pode querer diferenciar a versão aqui
      version: "1.0.0",
      description: "Documentação da API v1 do meu projeto Next.js com Swagger.",
    },
    servers: [
      // URLs base para os ambientes de produção e desenvolvimento
      {
        url: baseUrl.url, // URL base da API
        description: baseUrl.description, // Descrição do ambiente
      },
    ],
  },
  // procura arquivos JS dentro de pages/api/v1/
  apis: ["./pages/api/v1/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
