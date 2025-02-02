// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    'no-undef': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    'react/react-in-jsx-scope': 'off',
    camelcase: 'error',
    'spaced-comment': 'error',
    quotes: ['error', 'single'],
    'no-duplicate-imports': 'error',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
  ignorePatterns: ['/dist/*', '/android/*', '/ios/*'],
}
