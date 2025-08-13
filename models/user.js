import database from "infra/database.js";
import password from "models/password.js";
import { ValidationError, NotFoundError } from "infra/errors.js";

async function findOneByUsername(username) {
  const userFound = await runSelectQuery(username);

  return userFound;

  async function runSelectQuery(username) {
    const results = await database.query({
      text: `
      SELECT 
        * 
      FROM 
        users 
      WHERE 
        LOWER(username) = LOWER($1) 
      LIMIT 
        1
      ;`,
      values: [username],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "Usuário não encontrado.",
        action: "Verifique o username e tente novamente.",
      });
    }

    return results.rows[0];
  }
}

async function create(userInputValues) {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUsername(userInputValues.username);
  await hashPasswordInObject(userInputValues);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function validateUniqueUsername(username) {
    await database.query("CREATE EXTENSION IF NOT EXISTS unaccent;"); // Remover do model em refatoração futura
    const results = await database.query({
      text: `
      SELECT 
        username 
      FROM 
        users 
      WHERE 
        unaccent(LOWER(username)) = unaccent(LOWER($1))
      ;`,
      values: [username],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "O username já está sendo utilizado.",
        action: "Utilize outro username para realizar o cadastro.",
      });
    }
  }

  async function validateUniqueEmail(email) {
    const results = await database.query({
      text: `
      SELECT 
        email 
      FROM 
        users 
      WHERE 
        LOWER(email) = LOWER($1)
      ;`,
      values: [email],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "O email já está sendo utilizado.",
        action: "Utilize outro email para realizar o cadastro.",
      });
    }
  }

  async function hashPasswordInObject(userInputValues) {
    const hashedPassword = await password.hash(userInputValues.password);
    userInputValues.password = hashedPassword;
  }

  async function runInsertQuery(userInputValues) {
    const results = await database.query({
      text: `
      INSERT INTO 
        users (username, email, password) 
      VALUES 
        ($1, $2, $3)
      RETURNING 
        *
      ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return results.rows[0];
  }
}

const user = {
  create,
  findOneByUsername,
};

export default user;
