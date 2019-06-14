const sass = require("sass");

const RAW_VAR_REGEX = /\$([a-z][a-z0-9-]*):\s*([^;]*);/gi;
const RENDERED_VAR_REGEX = /\.([^{]+){v:([^}]+)}/g;

const GROUP_START_REGEX = /\/\/\/\sgroup:\s?([a-zA-Z][a-zA-Z0-9]*)/g;
const GROUP_END_REGEX = /\/\/\/\send group/i;

exports.getVariables = function(content, { enableGroups = false } = {}) {
  const variables = [];
  let match;

  const groupPositions = [];
  const groupVariables = {};

  if (enableGroups) {
    while ((match = GROUP_START_REGEX.exec(content)) !== null) {
      const [, name] = match;
      const start = match.index;

      groupPositions.push({
        start,
        end: start + content.substr(start).match(GROUP_END_REGEX).index,
        name,
      });

      groupVariables[name] = [];
    }
  }

  while ((match = RAW_VAR_REGEX.exec(content)) !== null) {
    const [, variable, value] = match;
    variables.push([variable, value.trim()]);

    if (enableGroups) {
      for (let group of groupPositions) {
        if (group.start <= match.index && group.end >= match.index) {
          groupVariables[group.name].push(variable);
        }
      }
    }
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

  const groups = {};

  if (enableGroups) {
    for (let group of Object.keys(groupVariables)) {
      const vars = groupVariables[group];
      groups[group] = groupVariables[group].reduce((acc, v) => {
        const camelCased = camelCase(v);
        return {
          ...acc,
          [camelCased]: parsedVariables[camelCased],
        };
      }, {});
    }
  }

  return { all: parsedVariables, groups };
};

const CAMEL_CASE_REGEX = /(?:-|\s)+([^-\s])/g;

function camelCase(str) {
  str = str.replace(CAMEL_CASE_REGEX, (_, b) => b.toUpperCase());
  return str.substr(0, 1).toLowerCase() + str.substr(1);
}
