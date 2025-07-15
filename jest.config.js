/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'packages/*/src/**/*.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  projects: [
    {
      displayName: 'core',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/core/**/*.spec.ts'],
      moduleNameMapper: {
        '^@ilhamtahir/ts-mapper$': '<rootDir>/packages/core/src/index.ts',
      },
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            tsconfig: '<rootDir>/packages/core/tsconfig.json',
          },
        ],
      },
    },
    {
      displayName: 'nestjs',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/nestjs/**/*.spec.ts'],
      moduleNameMapper: {
        '^@ilhamtahir/ts-mapper$': '<rootDir>/packages/core/src/index.ts',
        '^@ilhamtahir/nest-mapper$': '<rootDir>/packages/nestjs/src/index.ts',
      },
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            tsconfig: '<rootDir>/packages/nestjs/tsconfig.json',
          },
        ],
      },
    },
  ],
};
