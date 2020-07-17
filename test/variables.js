const test = require("ava");

const { getVariables } = require("../lib/variables");

test("basic variables", (t) => {
  t.deepEqual(getVariables("$red: #ff0001;"), { red: "#ff0001" });
});

test("camelCase", (t) => {
  t.deepEqual(getVariables("$color-red: #ff0001;"), { colorRed: "#ff0001" });
});

test("variable reference", (t) => {
  t.deepEqual(
    getVariables(`
      $one: 1px;
      $two: $one + 1;
    `),
    { one: "1px", two: "2px" },
  );
});

test("sass functions", (t) => {
  t.deepEqual(
    getVariables(`
      $red: #ff0001;
      $dark-red: darken($red, 10%);
    `),
    { red: "#ff0001", darkRed: "#cc0001" },
  );
});
