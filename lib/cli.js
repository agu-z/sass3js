#!/usr/bin/env node

const fs = require("fs");
const program = require("commander");
const pkg = require("../package.json");
const { getVariables } = require("./variables");
const { format } = require("./format");

program
  .usage("[options] [source] [destination]")
  .version(pkg.version, "-v, --version")
  .option(
    "-f, --format <format>",
    "Output format",
    /^(js|json|ts|flow)$/i,
    "js",
  )
  .option(
    "-t, --tab <tab>",
    "Number of spaces or string to use for indentation",
    "2",
  )
  .parse(process.argv);

const [src, dst] = program.args;

let content;

if (src) {
  content = fs.readFileSync(src, "UTF-8").toString();
} else {
  process.stdin.setEncoding("utf8");

  const chunks = [];

  process.stdin.on("data", chunk => {
    chunks.push(chunk);
  });

  process.stdin.on("end", chunk => {
    content = chunks.join();
  });
}

const formatted = format(getVariables(content), program.format, program.tab);

if (dst) {
  fs.writeFileSync(dst, formatted);
} else {
  process.stdout.write(formatted);
}
