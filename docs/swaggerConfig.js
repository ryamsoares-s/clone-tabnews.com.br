const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0", // Versão do OpenAPI
    info: {
      title: "Minha API Next.js (V1)", // Você pode querer diferenciar a versão aqui
      version: "1.0.0",
      description: "Documentação da API v1 do meu projeto Next.js com Swagger.",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1", // URL base da API
        description: "Servidor de Desenvolvimento",
      },
    ],
  },
  // procura arquivos JS dentro de pages/api/v1/
  apis: ["./pages/api/v1/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
