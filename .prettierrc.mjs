/** @type {import("prettier").Config} */
export default {
  plugins: ['prettier-plugin-astro'],
  trailingComma: 'es5',
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  arrowParens: 'always',
  printWidth: 80,
  useTabs: false,
  quoteProps: 'consistent',
  jsxSingleQuote: true,
  bracketSpacing: true,
  bracketSameLine: false,
  singleAttributePerLine: true,
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
}
