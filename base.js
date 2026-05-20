const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const autofix = require('eslint-plugin-autofix');
const importPlugin = require('eslint-plugin-import');
const promise = require('eslint-plugin-promise');
const simpleImportSort = require('eslint-plugin-simple-import-sort');

module.exports = [
  {
    files: ['**/*.{js,jsx,ts,tsx,cjs,mjs}'],
    languageOptions: {
      ecmaVersion: 2020,
      parser: tsParser,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      autofix,
      import: importPlugin,
      promise,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      '@typescript-eslint/explicit-member-accessibility': [2, { accessibility: 'no-public' }],
      '@typescript-eslint/no-inferrable-types': [2, { ignoreParameters: true }],
      '@typescript-eslint/no-namespace': [2, { allowDeclarations: true }],

      curly: 'error',
      'dot-notation': 'error',
      'eol-last': ['error', 'unix'],
      eqeqeq: ['error'],
      'func-names': ['error'],
      'import/no-duplicates': ['error'],
      indent: ['error', 2, { SwitchCase: 1, offsetTernaryExpressions: true }],
      'linebreak-style': ['error', 'unix'],
      'max-depth': ['error', 5],
      'max-params': ['error', 4],
      'no-await-in-loop': ['error'],
      'no-case-declarations': 'off',
      'no-cond-assign': ['error'],
      'no-debugger': ['error'],
      'no-return-await': 'error',
      'no-unreachable': ['error'],
      'object-curly-spacing': ['error', 'always'],
      'object-shorthand': ['error', 'always'],
      'prefer-const': ['error'],
      'prefer-rest-params': ['error'],
      'promise/prefer-await-to-then': 'error',
      quotes: ['error', 'single', { avoidEscape: true }],
      'simple-import-sort/imports': 'error',
      'sort-keys': 'error',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
    },
  },
];
