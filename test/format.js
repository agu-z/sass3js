const test = require("ava");

const { format } = require("../lib/format");

const variables = {
  red: "#ff0001",
  darkRed: "#cc0001",
};

function testFormat(t, f) {
  t.snapshot(format(variables, f, 2));
}

testFormat.title = (_, f) => f;

test(testFormat, "js");
test(testFormat, "flow");
test(testFormat, "ts");
test(testFormat, "json");

test("tab", (t) => {
  t.snapshot(format(variables, "json", 2));
  t.snapshot(format(variables, "json", 4));
  t.snapshot(format(variables, "json", "\t"));
});
