# sass3js

[![npm version](https://img.shields.io/npm/v/sass3js.svg)](https://www.npmjs.com/package/sass3js) [![GitHub license](https://img.shields.io/badge/license-MIT-lightgrey.svg?maxAge=2592000)](LICENSE)

Convert SASS \* variables to JavaScript (flow supported), JSON, and TypeScript.

It takes this:

```scss
$red: #ff0001;
$dark-red: darken($red, 20%);
$spacing-1: 5px;
$spacing-2: $spacing-1 * 2;
```

and outputs this:

```ts
export default {
  red: "#ff0001",
  darkRed: "#990001",
  spacing1: "5px",
  spacing2: "10px",
};
```

so you can do stuff like this:

```jsx
import variables from "styles/variables";

function Logo() {
  return <Icon src={logo} fill={variables.darkRed} />;
}
```

\* [Only SCSS syntax is supported at the moment](https://github.com/aguzubiaga/sass3js/issues/2).

## Getting started

### Globally

You can install `sass3js` globally with npm:

```shell
$ npm install -g sass3js sass
```

and use it like this:

```shell
$ sass3js variables.scss variables.js
```

### In your project

You can also add `sass3js` as a dev dependency to your own module:

```shell
$ npm i -D sass3js
```

Optionally, you can add a script to your `package.json` file. Example:

```json
  "scripts": {
    "update-vars": "sass3js -f ts styles/variables.scss styles/variables.ts"
  }
```

> Note: sass3js requires you to have [sass](https://www.npmjs.com/package/sass) installed

## CLI

The CLI can take a source and a destination file:

```shell
$ sass3js source.scss destination.js
```

If those aren't provided, stdin and stdout are used instead:

```shell
$ cat source.scss | sass3js > destination.js
```

### Options

#### `-f, --format <format>`

Output format. Takes: `js`, `json`, `ts`, or `flow`. Default: `js`.

#### `-t, --tab <tab>`

Number of spaces or string to use for indentation. Default: `2`.

Using 4 spaces:

```shell
$ sass3js -t 4 source.scss
```

Using tabs instead of spaces:

```shell
$ sass3js -t $'\t' source.scss
```

## API

The API is pretty small. It contains only two functions: [getVariables](lib/variables.js#L6) and [format](lib/format.js).

Types:

```ts
type Variables = { [variable: string]: string };
type Format = "js" | "json" | "ts" | "flow";
```

#### `getVariables(contents: string): Variables`

This function takes the contents of your SCSS file and returns an object where the keys are the variable names and the values are the rendered (final) values.

#### `format(variables: Variables, format: Format, tab: number | string): string`

The `format` function serializes the variables and generates the output file. It takes the variables object returned by `getVariables`, a format option, and tab argument which can either be the number of spaces or the character to use (e.g. tab).

## The Name

I know it's silly, but [sass2js](https://www.npmjs.com/package/sass2js) is already taken 😛

## Motivation

### sass > node-sass

There are already a number of npm packages that do something similar to this one. However, most of them use [node-sass](https://www.npmjs.com/package/node-sass) instead of [sass](https://www.npmjs.com/package/sass). The latter is the official implementation and tools like [parcel](https://parceljs.org) recommend using it over the former. I didn't want to have both in my project so I made this.

### Type safety

In addition, there are some webpack loaders that let you import your SASS variables from JS. The problem with those is that even if you use TypeScript or Flow, there's no way (that I'm aware of) for the compiler to check the type of your variables object.

`sass3js` creates an actual `.js`/`.ts` file that you can import like you would any other module. This allows your type checker to infer the types of the variables object and alert you of typos and other type errors at compile time.

## Inspiration

1. https://github.com/nordnet/sass-variable-loader
2. https://github.com/hankmccoy/sass-to-js-var-loader
