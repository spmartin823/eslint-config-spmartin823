const react = require('eslint-plugin-react');

module.exports = [
  {
    plugins: {
      react,
    },
    rules: {
      'react/boolean-prop-naming': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': ['error', { children: 'never', props: 'never' }],
      'react/jsx-props-no-spreading': ['error', { exceptions: ['App', 'Component'] }],
      'react/no-access-state-in-setstate': 'error',
      'react/no-typos': 'error',
      'react/prefer-stateless-function': 'error',
      'react/self-closing-comp': 'error',
      'react/sort-comp': 'error',
      'react/sort-prop-types': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
