module.exports = {
  printWidth: 120,
  useTabs: false,
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  // Might have some problems with this one because of eslint
  // Because we require to have parens around an arrow function when it has a body
  arrowParens: 'avoid',
  parser: "flow"
};