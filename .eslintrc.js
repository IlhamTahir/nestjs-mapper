module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: ['./tsconfig.base.json', './packages/*/tsconfig.json'],
  },
  env: {
    node: true,
    es6: true,
  },
  rules: {
    // TypeScript 相关规则
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',

    // 通用规则
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',

    // Prettier 集成
    'prettier/prettier': 'error',
  },
  ignorePatterns: ['dist/', 'node_modules/', '*.js', '*.d.ts', 'coverage/', '.next/', 'build/'],
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['examples/**/*'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
};
