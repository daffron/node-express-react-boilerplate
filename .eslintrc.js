module.exports = {
  'extends': [
    'standard',
    'plugin:react/recommended'
  ],
  'settings': {
    'version': 'detect'
  },
  'plugins': [
    'standard',
    'promise',
    'react'
  ],
  "parser": "babel-eslint",
  'rules': {
    'camelcase': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'no-mixed-operators': 'off',
    'react/prop-types': 'off',
    'object-curly-spacing': ['error', 'never'],
    'arrow-parens': ['error', 'as-needed'],
    'no-warning-comments': 'off',
    "space-before-function-paren": ["error", "never"],
    "object-curly-spacing": ["error", "always"],
    "eol-last": ["error", "always"],
    "eqeqeq": "off",
    "indent": ["error", 2]
  }
}
