import user from "models/user.js";
import password from "models/password";
import { NotFoundError, UnauthorizedError } from "infra/errors.js";

async function findOneByEmail(providedEmail) {
  let storedUser;

  try {
    storedUser = await user.findOneByEmail(providedEmail);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new UnauthorizedError({
        message: "Email incorreto.",
        action: "Verifique se este dado está correto.",
      });
    }

    throw error;
  }

  return storedUser;
}

async function validatePassword(providedPassword, storedPassword) {
  const correctPasswordMatch = await password.compare(
    providedPassword,
    storedPassword,
  );

  if (!correctPasswordMatch) {
    throw new UnauthorizedError({
      message: "Senha incorreta.",
      action: "Verifique se este dado está correto.",
    });
  }
}

async function getAuthenticatedUser(providedEmail, providedPassword) {
  try {
    const storedUser = await findOneByEmail(providedEmail);
    await validatePassword(providedPassword, storedUser.password);

    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados de autenticação incorretos.",
        action: "Verifique suas credenciais e tente novamente.",
      });
    }

    throw error;
  }
}

const authentication = {
  getAuthenticatedUser,
};

export default authentication;
