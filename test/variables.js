import test from "ava";

import { getVariables } from "../lib/variables";

test("basic variables", t => {
  t.deepEqual(getVariables("$red: #ff0001;").all, { red: "#ff0001" });
});

test("camelCase", t => {
  t.deepEqual(getVariables("$color-red: #ff0001;").all, {
    colorRed: "#ff0001",
  });
});

test("variable reference", t => {
  t.deepEqual(
    getVariables(`
      $one: 1px;
      $two: $one + 1;
    `).all,
    { one: "1px", two: "2px" },
  );
});

test("sass functions", t => {
  t.deepEqual(
    getVariables(`
      $red: #ff0001;
      $dark-red: darken($red, 10%);
    `).all,
    { red: "#ff0001", darkRed: "#cc0001" },
  );
});
