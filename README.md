# eslint-config-spmartin823

Shared ESLint flat config and required plugins for spmartin823's frontend projects.

Bundles the plugins as `dependencies`, so a single `npm install` gets you everything:

- `@typescript-eslint/eslint-plugin` + `@typescript-eslint/parser`
- `eslint-plugin-autofix`
- `eslint-plugin-import`
- `eslint-plugin-react`
- `eslint-plugin-simple-import-sort`
- `globals`

Requires `eslint` >= 9 (flat config).

## Install

```sh
npm install --save-dev eslint eslint-config-spmartin823
```

## Usage

Each export is an array of flat-config objects you spread into your `eslint.config.js`.

### React app in the browser (e.g. webpack + Jest)

```js
const { base, react, browser } = require('eslint-config-spmartin823');

module.exports = [
  { ignores: ['node_modules/**', 'coverage/**', 'public/**', 'bundle.js', 'bundle.js.map', '**/*.log', '**/*.snap'] },
  ...base,
  ...react,
  ...browser,
];
```

### Node-only project (CLI, server, agent)

```js
const { base, node } = require('eslint-config-spmartin823');

module.exports = [
  { ignores: ['node_modules/**', 'dist/**', '**/*.log'] },
  ...base,
  ...node,
];
```

### Expo / React Native (combine with `eslint-config-expo`)

```js
const { defineConfig } = require('eslint/config');
const expo = require('eslint-config-expo/flat');
const { base, react } = require('eslint-config-spmartin823');

module.exports = defineConfig([
  { ignores: ['ios/**'] },
  ...expo,
  ...base,
  ...react,
  {
    rules: {
      // Expo's preset has a known issue with `indent`.
      indent: 'off',
      'sort-keys': 'off',
    },
  },
]);
```

## Exports

| Export    | What it adds                                                                                  |
| --------- | --------------------------------------------------------------------------------------------- |
| `base`    | TS parser, all universal rules (curly, eqeqeq, quotes, indent, sort-keys, import sort), TS overrides for `*.ts`/`*.tsx`. |
| `react`   | `eslint-plugin-react` with project rules. `react.version` set to `detect`.                    |
| `browser` | Browser + Node + ES2020 + Jest globals.                                                       |
| `node`    | Node + ES2022 globals, `ecmaVersion: 2022`.                                                   |

## Overriding rules

Append your own flat-config object after the spreads:

```js
module.exports = [
  ...base,
  ...react,
  ...browser,
  {
    rules: {
      'react/jsx-props-no-spreading': ['error', { exceptions: ['App', 'Component', 'Link'] }],
      indent: 'off',
    },
  },
];
```

## License

MIT
