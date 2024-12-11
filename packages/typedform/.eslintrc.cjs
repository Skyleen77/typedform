/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@repo/eslint-config/react-internal.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.lint.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    'no-redeclare': 'off',
    'no-unused-vars': 'off',
    'no-undef': 'off',
  },
};