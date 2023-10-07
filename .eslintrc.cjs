// eslint-disable-next-line no-undef
module.exports = {
  extends: [
    'eslint:recommended', 
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    project: true,
    tsconfigRootDir: './',
  },
  root: true,
};