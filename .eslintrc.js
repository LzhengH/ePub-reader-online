module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'indent': ['off'],
    'prefer-const': 'off',
    'space-before-function-paren': 'off',
    'no-undef': 'off',
    'quote-props': 'off',
    'comma-dangle': 'off'
  }
}
