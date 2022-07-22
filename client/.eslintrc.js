module.exports = {
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser', 
  extends: [
    'plugin:@typescript-eslint/recommended' 
  ],
  parserOptions: {
    ecmaVersion: 2018, 
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true 
    }
  },
  rules: {

  },
  settings: {
    react: {
      version: 'detect' 
    }
  },
}