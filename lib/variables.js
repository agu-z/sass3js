const sass = require("sass");

const RAW_VAR_REGEX = /\$([a-z][a-z0-9-]*):\s*([^;]*);/gi;
const RENDERED_VAR_REGEX = /\.([^{]+){v:([^}]+)}/g;

exports.getVariables = function(content) {
  const variables = [];
  let match;

  while ((match = RAW_VAR_REGEX.exec(content)) !== null) {
    const [, variable, value] = match;
    variables.push([variable, value.trim()]);
  }

  const rendered = sass
    .renderSync({
      data:
        variables.map(([name, value]) => `$${name}: ${value};`).join("") +
        variables.map(([name, value]) => `.${name}{v:${value}}`).join(""),
      outputStyle: "compressed",
    })
    .css.toString();

  const parsedVariables = {};
  let rm;

  while ((rm = RENDERED_VAR_REGEX.exec(rendered)) !== null) {
    const [, variable, value] = rm;
    parsedVariables[camelCase(variable)] = value;
  }

  return parsedVariables;
};

const CAMEL_CASE_REGEX = /(?:-|\s)+([^-\s])/g;

function camelCase(str) {
  str = str.replace(CAMEL_CASE_REGEX, (_, b) => b.toUpperCase());
  return str.substr(0, 1).toLowerCase() + str.substr(1);
}
