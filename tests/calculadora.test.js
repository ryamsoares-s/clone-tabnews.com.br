const calculadora = require("../models/calculadora.js");

test("Somar 2 + 2 deve retornar 4", () => {
  const res = calculadora.somar(2, 2);
  expect(res).toBe(4);
});

test("Somar String(10) + 10 deve retornar ERRO!", () => {
  const res = calculadora.somar("10", 10);
  expect("ERRO!").toBe();
});