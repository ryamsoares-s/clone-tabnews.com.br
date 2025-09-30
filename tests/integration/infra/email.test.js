import email from "infra/email.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
  test("send()", async () => {
    await orchestrator.deleteAllEmails();

    await email.send({
      from: "Teste <test@example.com>",
      to: "recipient@example.com",
      subject: "Primeiro email",
      text: "Corpo do Primeiro email.",
    });

    await email.send({
      from: "Teste <test@example.com>",
      to: "recipient@example.com",
      subject: "Último email",
      text: "Corpo do Último email.",
    });

    const lastEmail = await orchestrator.getLastEmail();
    expect(lastEmail.sender).toBe("<test@example.com>");
    expect(lastEmail.recipients[0]).toBe("<recipient@example.com>");
    expect(lastEmail.subject).toBe("Último email");
    expect(lastEmail.text).toBe("Corpo do Último email.\r\n");
  });
});
