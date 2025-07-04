// Descrição: Configuração do Jest para um projeto Next.js com suporte a variáveis de ambiente

const dotEnv = require("dotenv");
dotEnv.config({ path: ".env.development" });
// Configuração do Jest para um projeto Next.js com suporte a variáveis de ambiente

const nextJest = require("next/jest");
const createJestConfig = nextJest({
  dir: ".",
});
const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 60000, // Define o Timeout do Jest em 60000ms
});

module.exports = jestConfig;
