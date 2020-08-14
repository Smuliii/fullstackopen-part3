module.exports = {
  env: {
    commonjs: true,
    es2020: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'no-console': 'warn',
    'no-param-reassign': ['error', { props: false }],
    'no-restricted-syntax': 'off',
    'no-underscore-dangle': ['error', { allow: ['_id', '__v'] }],
  },
};
