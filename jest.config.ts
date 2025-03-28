import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts'],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
   
    '^@pages(.*)$': '<rootDir>/src/pages$1',
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@ui(.*)$': '<rootDir>/src/components/ui$1',
    '^@ui-pages(.*)$': '<rootDir>/src/components/ui/pages$1',
    '^@utils-types(.*)$': '<rootDir>/src/utils/types$1',
    '^@utils-cookie(.*)$': '<rootDir>/src/utils/cookie$1',
    '^@api(.*)$': '<rootDir>/src/utils/burger-api.ts',
    '^@slices(.*)$': '<rootDir>/src/services/slices$1',
    '^@selectors(.*)$': '<rootDir>/src/services/selectors$1',
    '^@store(.*)$': '<rootDir>/src/services/store$1'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8'
};

export default config;
