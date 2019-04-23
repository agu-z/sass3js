exports.format = function(variables, format, tab) {
  const tabSize = parseInt(tab);

  const jsonVars = JSON.stringify(
    variables,
    null,
    Number.isNaN(tabSize) ? tab : tabSize,
  );

  switch (format) {
    case "js":
      return `module.exports = ${jsonVars};`;
    case "flow":
      return `// @flow\n\nmodule.exports = ${jsonVars};`;
    case "ts":
      return `export default ${jsonVars};`;
    case "json":
    default:
      return jsonVars;
  }
};
