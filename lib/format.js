exports.format = function({ all, groups }, format, tab) {
  const tabSize = parseInt(tab);

  tab = Number.isNaN(tabSize) ? tab : tabSize;

  if (format === "json") {
    return JSON.stringify({ ...all, ...groups }, null, tab);
  }

  const flowHeader = format === "flow" ? "// @flow\n\n" : "";

  const groupsCode = Object.keys(groups)
    .map(
      name =>
        `export const ${name} = ${JSON.stringify(
          groups[name],
          null,
          tab,
        )};\n\n`,
    )
    .join("");

  const defaultCode = `export default ${JSON.stringify(all, null, tab)}`;

  return `${flowHeader}${groupsCode}${defaultCode};`;
};
